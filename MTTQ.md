## Production Guide: Multi-Platform Encrypted Chat via MQTT
This document outlines the complete implementation for a real-time, encrypted chat system tailored for a alogn cities. It connects a Next.js Web App (Admins), a React Native Mobile App (Riders/Drivers), and an Express.js Microservices Backend using a central MQTT Broker.

## Architecture Blueprint

                     ┌──────────────────┐
                     │  Express Backend │ (Generates keys & verifies tokens)
                     └────────┬─────────┘
                              │ HTTPS (Auth & Key Exchange)
         ┌────────────────────┴────────────────────┐
         ▼                                         ▼
┌──────────────────┐                     ┌──────────────────┐
│   Next.js Web    │                     │  React Native    │
│  (Admin Console) │                     │ (Rider / Driver) │
└────────┬─────────┘                     └─────────┬────────┘
         │                                         │
         │ MQTT over WebSockets (WSS)              │ Native MQTT (TCP/TLS)
         │ Port 443 / 8083                         │ Port 8883
         ▼                                         ▼
   ┌─────────────────────────────────────────────────────┐
   │            Central MQTT Broker (e.g., EMQX)         │
   └─────────────────────────────────────────────────────┘

## Protocol Distribution

* Web Frontend (Next.js): Connects via WSS (WebSockets) because browsers cannot establish raw TCP connections.
* Mobile Frontend (React Native): Connects via MQTTS (Secure TCP) to maintain lightweight, battery-efficient connections over volatile cellular networks.


## 1. Shared Cryptographic Utility (cryptoUtils.ts)
To ensure payload-level security, chat messages are encrypted with AES-256-GCM before transmission. This utility must be included or duplicated across the Next.js, React Native, and Express environments.

Note: For the standard Web Crypto API used below, ensure React Native project includes react-native-get-random-values and a polyfill for crypto if the runtime version does not natively support the global crypto.subtle API.

/**
 * Shared Cryptographic Utilities for AES-256-GCM Encryption
 */
// Converts a hex string key into a CryptoKey objectasync function importKey(hexKey: string): Promise<CryptoKey> {
  const rawKey = new Uint8Array(hexKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  return await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}
/**
 * Encrypts cleartext using an explicit Hex Session Key
 */export async function encryptPayload(textMessage: string, hexKey: string): Promise<{ iv: string; ciphertext: string }> {
  const key = await importKey(hexKey);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV recommended for GCM
  const encoder = new TextEncoder();

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encoder.encode(textMessage)
  );

  return {
    iv: Buffer.from(iv).toString('hex'),
    ciphertext: Buffer.from(encrypted).toString('base64')
  };
}
/**
 * Decrypts structured cipher data using the matching Hex Session Key
 */export async function decryptPayload(ciphertext: string, ivHex: string, hexKey: string): Promise<string> {
  const key = await importKey(hexKey);
  const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  const encryptedBuffer = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encryptedBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}


## 2. Express.js Microservice Implementation
The backend is responsible for creating ephemeral session keys during matching events and verifying that clients possess the authority to subscribe to particular MQTT routing patterns.
## Session Router (routes/chat.ts)

import express from 'express';
import crypto from 'crypto';
import { db } from '../database';
// Abstract database layoutimport { verifyToken } from '../middleware/auth';

const router = express.Router();
/**
 * @route   POST /api/chat/session/initiate
 * @desc    Invoked automatically when a rider and driver are paired
 */
router.post('/session/initiate', verifyToken, async (req, res) => {
  const { rideId, riderId, driverId } = req.body;

  try {
    // Generate a cryptographically secure 256-bit (32 byte) symmetric session key
    const chatSessionKey = crypto.randomBytes(32).toString('hex');

    // Persist metadata to database for audit and message mapping
    await db.chatSession.create({
      data: {
        rideId,
        riderId,
        driverId,
        sessionKey: chatSessionKey,
        isActive: true
      }
    });

    return res.status(201).json({
      success: true,
      rideId,
      chatSessionKey // Dispatched over secure HTTPS channel
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to initialize secure chat space" });
  }
});
/**
 * @route   GET /api/chat/session/:rideId
 * @desc    Allows authorized admins to acquire decryption context for active rides
 */
router.get('/session/:rideId', verifyToken, async (req, res) => {
  // Ensure the actor requesting data fulfills the "Admin" role context
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: "Access denied. Admin credentials required." });
  }

  const { rideId } = req.params;

  try {
    const session = await db.chatSession.findUnique({ where: { rideId } });
    if (!session) return res.status(404).json({ error: "Active ride context not found" });

    return res.status(200).json({ chatSessionKey: session.sessionKey });
  } catch (error) {
    return res.status(500).json({ error: "Internal server registry error" });
  }
});
export default router;


## 3. Next.js Admin Dashboard Implementation
The admin web interface establishes connection via secure WebSockets. It accesses any session context by pulling keys down through the admin-authenticated API proxy.
## Chat Console Hook Component (hooks/useAdminChat.ts)

import { useEffect, useState, useRef } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import { decryptPayload, encryptPayload } from '@/utils/cryptoUtils';

interface MessagePayload {
  senderId: string;
  timestamp: number;
  iv: string;
  ciphertext: string;
}

export function useAdminChat(rideId: string, adminId: string) {
  const [messages, setMessages] = useState<Array<{ senderId: string; text: string; time: number }>>([]);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const clientRef = useRef<MqttClient | null>(null);

  const topic = `ride/${rideId}/chat`;

  useEffect(() => {
    // 1. Resolve decryption context from Express Microservice
    async function fetchContext() {
      const response = await fetch(`/api/chat/session/${rideId}`);
      const data = await response.json();
      setSessionKey(data.chatSessionKey);
    }
    fetchContext();
  }, [rideId]);

  useEffect(() => {
    if (!sessionKey) return;

    // 2. Open standard WebSocket bridge tunnel to broker instance
    const client = mqtt.connect('wss://://yourdomain.com', {
      clientId: `admin_panel_${adminId}_${Math.random().toString(16).substring(2, 6)}`,
      clean: false, // Session persistence for short connection drops
      keepalive: 30
    });

    clientRef.current = client;

    client.on('connect', () => {
      client.subscribe(topic, { qos: 1 }); // Guaranteed processing quality profile
    });

    client.on('message', async (incomingTopic, buffer) => {
      if (incomingTopic === topic) {
        try {
          const payload: MessagePayload = JSON.parse(buffer.toString());

          // Decrypt payload asynchronously matching internal CryptoKey architecture
          const clearText = await decryptPayload(payload.ciphertext, payload.iv, sessionKey);

          setMessages((prev) => [...prev, {
            senderId: payload.senderId,
            text: clearText,
            time: payload.timestamp
          }]);
        } catch (err) {
          console.error("Failed payload processing or decryption reject:", err);
        }
      }
    });

    return () => {
      if (client) client.end();
    };
  }, [sessionKey, rideId]);

  // 3. Encrypt internal inputs right before posting payload structures
  const dispatchMessage = async (text: string) => {
    if (!clientRef.current || !sessionKey) return;

    const { iv, ciphertext } = await encryptPayload(text, sessionKey);

    const transmissionFrame: MessagePayload = {
      senderId: adminId,
      timestamp: Date.now(),
      iv,
      ciphertext
    };

    clientRef.current.publish(topic, JSON.stringify(transmissionFrame), { qos: 1 });
  };

  return { messages, dispatchMessage };
}


## 4. React Native Mobile Implementation
Mobile devices run raw TCP connections encapsulated via native thread engines to stay stable across active cell infrastructure transitions.
## Mobile Client Service Wrapper (services/MqttMobileService.ts)

import MQTT, { IMqttClient } from 'sp-react-native-mqtt';
import { encryptPayload, decryptPayload } from '../utils/cryptoUtils';
interface IncomingFrame {
  senderId: string;
  timestamp: number;
  iv: string;
  ciphertext: string;
}

export class MqttMobileService {
  private client: IMqttClient | null = null;
  private sessionKey: string;
  private topic: string;
  private userId: string;
  private onMessageCallback: (senderId: string, text: string) => void;

  constructor(rideId: string, sessionKey: string, userId: string, onMessage: (senderId: string, text: string) => void) {
    this.sessionKey = sessionKey;
    this.topic = `ride/${rideId}/chat`;
    this.userId = userId;
    this.onMessageCallback = onMessage;
  }

  public async initialize(): Promise<void> {
    // Instantiate raw TCP client layout using system sockets
    this.client = await MQTT.createClient({
      uri: 'mqtts://://yourdomain.com',
      clientId: `mobile_node_${this.userId}`,
      auth: true,
      user: 'mobile_client_production',
      pass: 'secure_broker_password_token',
      clean: false
    });

    this.client.on('msg', async (msg) => {
      if (msg.topic === this.topic) {
        try {
          const payload: IncomingFrame = JSON.parse(msg.data);

          // Decrypt payload locally using key delivered via initial API call
          const clearText = await decryptPayload(payload.ciphertext, payload.iv, this.sessionKey);
          this.onMessageCallback(payload.senderId, clearText);
        } catch (error) {
          console.warn("Payload decryption dropped on device channel context:", error);
        }
      }
    });

    this.client.on('connect', () => {
      if (this.client) {
        this.client.subscribe(this.topic, 1); // Quality Profile Match (QoS 1)
      }
    });

    this.client.connect();
  }

  public async sendMessage(textMessage: string): Promise<void> {
    if (!this.client) throw new Error("MQTT Client connection is uninitialized");

    const { iv, ciphertext } = await encryptPayload(textMessage, this.sessionKey);

    const structure = {
      senderId: this.userId,
      timestamp: Date.now(),
      iv,
      ciphertext
    };

    // Publish frame matching QoS 1 guidelines to prevent drops inside cellular tunnels
    this.client.publish(this.topic, JSON.stringify(structure), 1, false);
  }

  public disconnect(): void {
    if (this.client) {
      this.client.disconnect();
    }
  }
}


## 5. Security & Architectural Operational Best Practices

   1. Broker Authentication & Authorization (ACLs):
   Do not allow clients to subscribe to any arbitrary topic string. Configure your MQTT Broker (like EMQX) with an Auth/ACL plugin pointing to an authorization database or hook endpoint. A client authenticated as driver_111 must only be allowed to read and write to topics matching the pattern ride/+/chat if they are actively assigned to that rideId.
   2. Clean Session & Quality of Service (QoS):
   Always use QoS 1 (At least once delivery) and Clean Session = false for chat spaces. If a driver drops connection for 10 seconds while traveling under an overpass, the broker caches unacknowledged frames and pushes them immediately upon reconnection.
   3. Database Archiving Strategy:
   MQTT is a transit bus, not a long-term datastore. To store historical data for legal or billing disputes, configure an EMQX Webhook Data Integration rule. This instructs the broker to automatically forward every incoming JSON payload matching the ride/+/chat topic directly to an internal Express microservice endpoint (e.g., POST /api/chat/archive), where the backend decrypts and archives the message logs directly into your main database.

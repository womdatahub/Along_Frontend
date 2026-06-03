import { create } from "zustand";
import type { SelectorFn } from "@/types";
import { callApi, communicationApiStr, requests } from "@/lib";
import { toast } from "sonner";

export type ConversationSummary = {
  _id?: string;
  id?: string;
  conversationId?: string;
  participants?: string[];
  unreadCount?: number;
  lastMessage?: {
    body?: string;
    text?: string;
    createdAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type ConversationMessage = {
  _id?: string;
  id?: string;
  senderId?: string;
  body?: string;
  text?: string;
  createdAt?: string;
};

type CommunicationStoreType = {
  isLoading: boolean;
  isSending: boolean;
  conversations: ConversationSummary[];
  selectedConversation: ConversationSummary | undefined;
  messages: ConversationMessage[];
  actions: {
    fetchUserConversations: (userId: string) => Promise<void>;
    fetchConversation: (conversationId: string) => Promise<void>;
    sendMessage: (params: {
      conversationId: string;
      body: string;
      senderId?: string;
    }) => Promise<boolean>;
    startConversation: (data: {
      driverId: string;
      riderId: string;
    }) => Promise<ConversationSummary | undefined>;
    clearConversation: () => void;
  };
};

const asArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const body = value as Record<string, unknown>;
    if (Array.isArray(body.conversations)) return body.conversations as T[];
    if (Array.isArray(body.messages)) return body.messages as T[];
  }
  return [];
};

export const useCommunication = create<CommunicationStoreType>()((set, get) => ({
  isLoading: false,
  isSending: false,
  conversations: [],
  selectedConversation: undefined,
  messages: [],
  actions: {
    fetchUserConversations: async (userId) => {
      if (!userId) return;
      set({ isLoading: true });
      const { data, error } = await callApi<ConversationSummary[]>(
        communicationApiStr(`/conversations/user/${userId}`),
        undefined,
        undefined,
        { skipToast: true },
      );
      if (error) {
        set({ isLoading: false, conversations: [] });
        return;
      }
      set({ isLoading: false, conversations: asArray(data?.data) });
    },
    fetchConversation: async (conversationId) => {
      if (!conversationId) return;
      set({ isLoading: true });
      const { data, error } = await callApi<{
        conversation?: ConversationSummary;
        messages?: ConversationMessage[];
      }>(communicationApiStr(`/conversation/${conversationId}`));
      if (error) {
        set({ isLoading: false });
        return;
      }
      set({
        isLoading: false,
        selectedConversation:
          data?.data?.conversation ?? (data?.data as ConversationSummary),
        messages: asArray<ConversationMessage>(data?.data),
      });
    },
    sendMessage: async ({ conversationId, body, senderId }) => {
      if (!conversationId || !body.trim()) return false;
      set({ isSending: true });
      const { error } = await requests.communication.sendMessage({
        conversationId,
        body: body.trim(),
        senderId,
      });
      set({ isSending: false });
      if (error) {
        toast.error("Failed to send message");
        return false;
      }
      // Optimistically append the message, then refresh
      const optimistic: ConversationMessage = {
        _id: `optimistic-${Date.now()}`,
        senderId,
        body: body.trim(),
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ messages: [...state.messages, optimistic] }));
      // Refresh conversation to get server-authoritative messages
      await get().actions.fetchConversation(conversationId);
      return true;
    },
    startConversation: async (payload) => {
      set({ isLoading: true });
      const { data, error } = await callApi<ConversationSummary>(
        communicationApiStr("/conversation/start"),
        payload,
      );
      if (error) {
        set({ isLoading: false });
        return undefined;
      }
      set({ isLoading: false, selectedConversation: data?.data });
      return data?.data;
    },
    clearConversation: () =>
      set({ selectedConversation: undefined, messages: [] }),
  },
}));

export const useCommunications = <TResult>(
  selector: SelectorFn<CommunicationStoreType, TResult>,
) => useCommunication(selector);

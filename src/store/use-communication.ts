import { create } from "zustand";
import type { SelectorFn } from "@/types";
import { callApi, communicationApiStr } from "@/lib";
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
  conversations: ConversationSummary[];
  selectedConversation: ConversationSummary | undefined;
  messages: ConversationMessage[];
  actions: {
    fetchUserConversations: (userId: string) => Promise<void>;
    fetchConversation: (conversationId: string) => Promise<void>;
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

export const useCommunication = create<CommunicationStoreType>()((set) => ({
  isLoading: false,
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
        toast.error(error.message);
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
    startConversation: async (payload) => {
      set({ isLoading: true });
      const { data, error } = await callApi<ConversationSummary>(
        communicationApiStr("/conversation/start"),
        payload,
      );
      if (error) {
        toast.error(error.message);
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

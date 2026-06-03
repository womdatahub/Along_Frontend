"use client";

import {
  Card,
  CardContent,
  Empty,
  EmptyHeader,
  EmptyTitle,
  HeadingHeebo,
} from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunication, useSession } from "@/store";
import type { RiderProfile } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { Send, Loader2 } from "lucide-react";

const Page = () => {
  const { currentUser } = useSession(
    useShallow((state) => ({ currentUser: state.currentUser })),
  );
  const riderProfile = currentUser as RiderProfile | undefined;
  const {
    conversations,
    messages,
    selectedConversation,
    isLoading,
    isSending,
    actions: { fetchUserConversations, fetchConversation, sendMessage },
  } = useCommunication(
    useShallow((state) => ({
      conversations: state.conversations,
      messages: state.messages,
      selectedConversation: state.selectedConversation,
      isLoading: state.isLoading,
      isSending: state.isSending,
      actions: state.actions,
    })),
  );

  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = riderProfile?.userId ?? riderProfile?._id;

  useEffect(() => {
    if (userId) fetchUserConversations(userId);
  }, [userId, fetchUserConversations]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const conversationId =
    selectedConversation?.conversationId ?? selectedConversation?._id ?? "";

  const handleSend = async () => {
    if (!draft.trim() || !conversationId) return;
    const text = draft;
    setDraft("");
    await sendMessage({ conversationId, body: text, senderId: userId });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <HeadingHeebo className="text-start pl-4">Messages</HeadingHeebo>
      <div className="grid md:grid-cols-[260px_1fr] gap-4 w-full max-w-7xl">
        {/* Conversation list */}
        <Card className="rounded-2xl shadow-none">
          <CardContent className="flex flex-col gap-2">
            {isLoading ? (
              <Skeleton className="h-16 rounded-2xl" />
            ) : conversations.length > 0 ? (
              conversations.map((conversation) => {
                const cId =
                  conversation.conversationId ?? conversation._id ?? "";
                const isSelected =
                  selectedConversation?.conversationId === cId ||
                  selectedConversation?._id === cId;
                return (
                  <button
                    key={cId}
                    type="button"
                    onClick={() => fetchConversation(cId)}
                    className={`text-left rounded-2xl p-3 transition-colors ${
                      isSelected
                        ? "bg-primary/10"
                        : "bg-background hover:bg-gray-100"
                    }`}
                  >
                    <p className="font-bold text-sm">Rental conversation</p>
                    <p className="text-xs text-gray-5 truncate">
                      {conversation.lastMessage?.body ??
                        conversation.lastMessage?.text ??
                        "Open conversation"}
                    </p>
                  </button>
                );
              })
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle className="text-sm font-bold">
                    No conversations
                  </EmptyTitle>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>

        {/* Message panel */}
        <Card className="rounded-2xl shadow-none">
          <CardContent className="flex h-full flex-col gap-0 p-0">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-bold text-sm">
                {selectedConversation
                  ? "Conversation"
                  : "Select a conversation"}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 min-h-60 max-h-96">
              {messages.length > 0 ? (
                <>
                  {messages.map((message) => {
                    const isOwn = message.senderId === userId;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm max-w-[75%] ${
                            isOwn
                              ? "bg-primary text-white"
                              : "bg-background text-gray-800"
                          }`}
                        >
                          <p>{message.body ?? message.text ?? ""}</p>
                          {message.createdAt && (
                            <p
                              className={`text-[10px] mt-1 ${
                                isOwn ? "text-white/70" : "text-gray-5"
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <p className="text-sm text-gray-5">
                  {selectedConversation
                    ? "No messages yet. Start the conversation below."
                    : "Messages become available after a rental conversation is opened."}
                </p>
              )}
            </div>

            {/* Send input */}
            {selectedConversation && (
              <div className="flex items-end gap-2 px-4 py-3 border-t border-gray-100">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message… (Enter to send)"
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-gray-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  onClick={handleSend}
                  disabled={isSending || !draft.trim()}
                  className="size-9 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40 flex items-center justify-center shrink-0 transition-colors"
                >
                  {isSending ? (
                    <Loader2 size={14} className="text-white animate-spin" />
                  ) : (
                    <Send size={14} className="text-white" />
                  )}
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;

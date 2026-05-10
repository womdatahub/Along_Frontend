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
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const { riderProfile } = useSession(
    useShallow((state) => ({ riderProfile: state.riderProfile })),
  );
  const {
    conversations,
    messages,
    selectedConversation,
    isLoading,
    actions: { fetchUserConversations, fetchConversation },
  } = useCommunication(
    useShallow((state) => ({
      conversations: state.conversations,
      messages: state.messages,
      selectedConversation: state.selectedConversation,
      isLoading: state.isLoading,
      actions: state.actions,
    })),
  );

  useEffect(() => {
    const userId = riderProfile?.userId ?? riderProfile?._id;
    if (userId) fetchUserConversations(userId);
  }, [fetchUserConversations, riderProfile?._id, riderProfile?.userId]);

  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>Messages</HeadingHeebo>
      <div className='grid md:grid-cols-[260px_1fr] gap-4 w-full max-w-4xl'>
        <Card className='rounded-2xl shadow-none'>
          <CardContent className='flex flex-col gap-2'>
            {isLoading ? (
              <Skeleton className='h-16 rounded-2xl' />
            ) : conversations.length > 0 ? (
              conversations.map((conversation) => (
                <button
                  key={conversation.conversationId ?? conversation._id}
                  type='button'
                  onClick={() =>
                    fetchConversation(
                      conversation.conversationId ?? conversation._id ?? "",
                    )
                  }
                  className='text-left rounded-2xl bg-background-1 p-3'
                >
                  <p className='font-bold text-sm'>
                    Rental conversation
                  </p>
                  <p className='text-xs text-gray-5'>
                    {conversation.lastMessage?.body ??
                      conversation.lastMessage?.text ??
                      "Open conversation"}
                  </p>
                </button>
              ))
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle className='text-sm font-bold'>
                    No conversations
                  </EmptyTitle>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
        <Card className='rounded-2xl shadow-none min-h-80'>
          <CardContent className='flex h-full flex-col gap-3'>
            <p className='font-bold'>
              {selectedConversation ? "Conversation" : "Select a conversation"}
            </p>
            {messages.length > 0 ? (
              <div className='flex flex-col gap-3'>
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className='rounded-2xl bg-background-1 p-3 text-sm'
                  >
                    <p>{message.body ?? message.text ?? ""}</p>
                    {message.createdAt && (
                      <p className='text-[10px] text-gray-5 mt-1'>
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-5'>
                Messages become available after a rental conversation is opened.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;

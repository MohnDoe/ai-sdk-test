import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ChatMessage } from "@/app/lib/ai/agent";

type Message = ChatMessage;

export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationStore {
  isReady: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;

  createConversation: (title?: string) => string;
  addMessageToConversation: (conversationId: string, message: Message) => void;
  setActiveConversationId: (id: string) => void;
  deleteConversation: (id: string) => void;
}

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => ({
      isReady: false,
      conversations: [],
      activeConversationId: null,
      createConversation: (title?: string) => {
        const newConversationId = crypto.randomUUID();
        const newConversation: Conversation = {
          id: newConversationId,
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          conversations: [...state.conversations, newConversation],
          activeConversationId: newConversationId,
        }));
        return newConversationId;
      },
      addMessageToConversation: (conversationId: string, message: Message) => {
        const { conversations } = get();

        set({
          conversations: conversations.map((conversation) => {
            if (conversation.id !== conversationId) return conversation;

            return {
              ...conversation,
              updatedAt: new Date(),
              messages: [...conversation.messages, message],
            };
          }),
        });
      },
      setActiveConversationId: (id: string) => {
        set({ activeConversationId: id });
      },
      deleteConversation: (id: string) => {
        const { conversations, activeConversationId } = get();

        set({
          activeConversationId:
            activeConversationId === id ? null : activeConversationId,
          conversations: conversations.filter(
            (conversation) => conversation.id !== id,
          ),
        });
      },
    }),
    {
      name: "aieConversationStore",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state, error) => {
        if (state) {
          state.isReady = true;
        }
      }
    },
  ),
);
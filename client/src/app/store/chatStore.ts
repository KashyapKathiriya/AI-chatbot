import { create } from "zustand";
import type { Message } from "../../features/chat/types";

type ChatState = {
  activeConversationId: string | null;
  messages: Message[];
  isStreaming: boolean;
  setActiveConversation: (id: string | null) => void;
  reset: () => void;
  setMessages: (messages: Message[]) => void;
  appendUserMessage: (content: string) => void;
  appendAssistantMessage: () => string;
  appendToken: (id: string, token: string) => void;
  finalizeMessage: () => void;
};

const initialState = {
  activeConversationId: null,
  messages: [],
  isStreaming: false,
};

export const useChatStore = create<ChatState>((set) => ({
  ...initialState,
  setActiveConversation: (id) => {
    set({
      activeConversationId: id,
      messages: [],
      isStreaming: false,
    });
  },
  reset: () => {
    set((state) => ({
      ...state,
      messages: [],
      isStreaming: false,
    }));
  },
  setMessages: (messages) => {
    set({ messages });
  },
  appendUserMessage: (content) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },
  appendAssistantMessage: () => {
    const id = `ai-${crypto.randomUUID()}`;

    const newMessage: Message = {
      id,
      role: "model",
      content: "",
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
      isStreaming: true,
    }));

    return id;
  },
  appendToken: (id, token) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id
          ? { ...message, content: message.content + token }
          : message
      ),
    }));
  },
  finalizeMessage: () => {
    set({ isStreaming: false });
  },
}));

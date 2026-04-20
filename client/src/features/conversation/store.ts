import { create } from "zustand";
import type { Conversation } from './types';

interface ConversationState {
    conversations: Conversation[];
    activeConversationId: string | null;
    setActiveConversation: (id: string) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
    conversations: [],
    activeConversationId: null,

    setActiveConversation: (id: string) => {
        set({ activeConversationId: id})
    }, 
}));
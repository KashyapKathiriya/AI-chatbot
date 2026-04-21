import { create } from "zustand";

interface ConversationState {
    activeConversationId: string | null;
    setActiveConversation: (id: string | null) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
    activeConversationId: null,
    setActiveConversation: (id: string) => {
        set({ activeConversationId: id})
    }, 
}));
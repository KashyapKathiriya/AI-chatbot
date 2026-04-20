import { http } from '../../services/http';
import type { Message } from './types';

export const fetchMessage = async (conversationId: string): Promise<Message[]> => {
    const res = await http.get(`/conversation/${conversationId}`);
    return res.data;
}

export const sendMessage = async ({ conversationId, content }) => {
    const res = await http.post("/chat", {conversationId, content});
    return res.data;
}
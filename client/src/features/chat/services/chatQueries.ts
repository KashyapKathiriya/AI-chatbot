import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "../../../shared/services/http";
import { fetchMessage } from "../api";
import type { ApiMessage, Message } from "../types";

const mapMessage = (message: ApiMessage): Message => ({
  id: message._id ?? crypto.randomUUID(),
  role: message.role,
  content: message.content,
  createdAt: message.createdAt,
});

export const useMessages = (conversationId?: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessage(conversationId!),
    enabled: !!conversationId,
    select: (data) => (Array.isArray(data) ? data.map(mapMessage) : []),
    staleTime: 10_000,
  });
};

type PersistPayload = {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
};

export const usePersistMessage = () => {
  return useMutation({
    mutationFn: async ({
      conversationId,
      userMessage,
      assistantMessage,
    }: PersistPayload) => {
      await http.post("/chat/save", {
        conversationId,
        messages: [userMessage, assistantMessage],
      });
    },
  });
};

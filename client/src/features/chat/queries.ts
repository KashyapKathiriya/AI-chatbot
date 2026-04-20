import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMessage, sendMessage } from "./api";
import type { Message } from "./types";

export const useMessages = (conversationId: string | null) => {
    return useQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => fetchMessage(conversationId!),
        enabled: !!conversationId,
    })
}

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sendMessage,
        onMutate: async ({ conversationId, content }) => {
            await queryClient.cancelQueries({
                queryKey: ["messages", conversationId],
            });
            const previousMessages = queryClient.getQueryData<Message[]>([
                "messages", conversationId,
            ]);
            const tempUserMessage: Message = {
                id: crypto.randomUUID(),
                role: "user",
                content,
                createdAt: new Date().toISOString(),
            };
            queryClient.setQueryData<Message[]>(
                ["messages", conversationId],
                (old = []) => [...old, tempUserMessage]
            );

            return { previousMessages };
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(
                ["messages", variables.conversationId],
                data.messages
            )
        },
        onError: (_, variables, context) => {
            queryClient.setQueryData(
                ["messages", variables.conversationId],
                context?.previousMessages || []
            );
        },
    })
}
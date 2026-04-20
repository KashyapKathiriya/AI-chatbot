import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMessage, sendMessage } from "./api";

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
        onSuccess: (data, variables) => {
            queryClient.setQueryData(
                ["messages", variables.conversationId],
                data.messages
            )
        } 
    })
}
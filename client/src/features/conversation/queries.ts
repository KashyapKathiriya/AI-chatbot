import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchConversation, createConversation, deleteConversation, updateConversationTitle } from "./api";

export const useConversations = () => {
    return useQuery({
        queryKey: ["conversations"],
        queryFn: fetchConversation,
    });
};

export const useCreateConversation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createConversation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"]})
        }
    })
}

export const useDeleteConversation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteConversation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"]})
        }
    })
}

export const useUpdateConversationTitle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, title,}: {id: string; title: string;}) => updateConversationTitle(id, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"]});
        }
    })
}
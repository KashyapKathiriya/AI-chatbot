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
        onSuccess: (newConv) => {
            queryClient.setQueryData(["conversations"], (old: any = []) => {
                return [newConv, ...old]
            })
        }
    })
}

export const useDeleteConversation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteConversation(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData(["conversations"], (old: any = []) => {
                return old.filter((c: any) => c.id !== id);
            });
        },
    });
};

export const useUpdateConversationTitle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, title, }: { id: string; title: string; }) => updateConversationTitle(id, title),
        onSuccess: (updated, variables) => {
            queryClient.setQueryData(["conversations"], (old: any = []) => {
                return old.map((c: any) =>
                    c.id === variables.id ? { ...c, title: updated.title } : c
                );
            });
        },
    })
}
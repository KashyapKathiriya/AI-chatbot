import { useMemo } from "react";
import { useChatStore } from "../../../app/store/chatStore";
import { streamMessage } from "../api";
import { usePersistMessage } from "../services/chatQueries";
import type { Message } from "../types";

type StreamPayload = {
  conversationId: string;
  content: string;
};

function debounce(fn: Function, ms: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

export const useStreaming = () => {
  const persistMutation = usePersistMessage();

  const debouncedSave = useMemo(
    () =>
      debounce(async (payload: any) => {
        try {
          await persistMutation.mutateAsync(payload);
        } catch (error) {
          console.error("Failed to persist partial message:", error);
        }
      }, 1000),
    [persistMutation]
  );

  const startStreaming = async ({ conversationId, content }: StreamPayload) => {
    const initialState = useChatStore.getState();
    if (
      initialState.activeConversationId !== conversationId ||
      initialState.isStreaming
    ) {
      return;
    }

    initialState.appendUserMessage(content);

    const userMessage = useChatStore.getState().messages.at(-1);
    if (!userMessage) {
      return;
    }

    const assistantId = useChatStore.getState().appendAssistantMessage();
    const assistantCreatedAt = new Date().toISOString();
    let assistantContent = "";
    let isAborted = false;

    try {
      await streamMessage(
        { conversationId, content },
        (token) => {
          if (isAborted) {
            return;
          }

          const currentState = useChatStore.getState();
          if (currentState.activeConversationId !== conversationId) {
            return;
          }

          assistantContent += token;
          currentState.appendToken(assistantId, token);

          debouncedSave({
            conversationId,
            userMessage,
            assistantMessage: {
              id: assistantId,
              role: "model",
              content: assistantContent,
              createdAt: assistantCreatedAt,
            } as Message,
          });
        },
        async () => {
          if (isAborted) {
            return;
          }

          const currentState = useChatStore.getState();
          if (currentState.activeConversationId !== conversationId) {
            currentState.finalizeMessage();
            return;
          }

          currentState.finalizeMessage();

          const assistantMessage: Message = {
            id: assistantId,
            role: "model",
            content: assistantContent,
            createdAt: assistantCreatedAt,
          };

          await persistMutation.mutateAsync({
            conversationId,
            userMessage,
            assistantMessage,
          });
        }
      );
    } catch (error) {
      console.error("Streaming error:", error);
      useChatStore.getState().finalizeMessage();
    }
  };

  return {
    startStreaming,
  };
};

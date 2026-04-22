import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { useChatStore } from "../../../app/store/chatStore";
import { useStreaming } from "../hooks/useStreaming";

const ChatInput = () => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { id: conversationId } = useParams();
  const { startStreaming } = useStreaming();
  const isStreaming = useChatStore((state) => state.isStreaming);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !conversationId || isStreaming) {
      return;
    }

    setInput("");

    await startStreaming({
      conversationId,
      content: trimmed,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="w-full bg-[#212121] pt-4 pb-2 px-4">
      <div className="max-w-3xl mx-auto relative">
        <div
          className="
            w-full flex items-end
            bg-[#2f2f2f]
            rounded-2xl border border-neutral-700/50
            focus-within:border-neutral-600
            transition
            relative
          "
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Chatbot..."
            rows={1}
            className="
              w-full
              p-4 pr-14
              bg-transparent text-white
              resize-none outline-none

              max-h-52 overflow-y-auto

              relative z-0

              scrollbar-thin
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-neutral-700
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:border-[3px]
              [&::-webkit-scrollbar-thumb]:border-transparent
              [&::-webkit-scrollbar-thumb]:bg-clip-content
              hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400
            "
          />

          {/* Send Button */}
          <button
            onClick={() => void handleSend()}
            disabled={!input.trim() || isStreaming}
            className="
              absolute right-3 bottom-[10px]
              p-2
              bg-white text-black rounded-xl
              hover:bg-neutral-200 transition-colors
              disabled:bg-neutral-600 disabled:text-neutral-400
              z-20
            "
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        <p className="text-center text-neutral-500 text-xs mt-1">
          AI can make mistakes. Please double-check important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;

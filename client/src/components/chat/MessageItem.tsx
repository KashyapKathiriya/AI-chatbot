import type { Message } from "../../features/chat/types";
import ReactMarkdown from "react-markdown";

const MessageItem = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full my-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          px-4 py-3 rounded-2xl text-base leading-relaxed
          transition-all duration-200

          ${isUser
            ? "bg-blue-600 text-white rounded-br-sm max-w-[75%] shadow-md "
            : "bg-transparent w-full text-neutral-100 flex-1"
          }
        `}
      >
        {isUser ? (
          message.content
        ) : (
          <div className="markdown-body">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;

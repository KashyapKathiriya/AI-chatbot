import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useConversationStore } from "../../features/conversation/store";

const ChatWindow = () => {
  const { activeConversationId } = useConversationStore();

  if (!activeConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-base text-white bg-[#212121]">
        Select or create a conversation
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen flex-1 bg-neutral-950 text-white items-center bg-[#212121]">

      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatWindow;

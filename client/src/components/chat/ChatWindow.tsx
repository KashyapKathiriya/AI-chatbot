import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useConversationStore } from "../../features/conversation/store";
import ChatHome from "./ChatHome";

const ChatWindow = () => {
  const { activeConversationId } = useConversationStore();

  if (!activeConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-white bg-[#212121]">
        < ChatHome />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-[#212121] text-white items-center">
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatWindow;

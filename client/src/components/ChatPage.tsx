import { useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { useConversationStore } from "../features/conversation/store";
import { useChatStore } from "../features/chat/store";

const ChatPage = () => {
  const { activeConversationId } = useConversationStore();
  const { loadMessages, clearMessages } = useChatStore();

  useEffect(() => {
    if (activeConversationId) {
      clearMessages();
      loadMessages(activeConversationId);
    }
  }, [activeConversationId]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatPage;

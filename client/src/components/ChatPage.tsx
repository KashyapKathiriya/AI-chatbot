import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { useConversationStore } from "../features/conversation/store";
import { useChatStore } from "../features/chat/store";

const ChatPage = () => {
  const { id } = useParams();
  const { activeConversationId, setActiveConversation } = useConversationStore();
  const { loadMessages, clearMessages } = useChatStore();

  useEffect(() => {
    if (id && id !== activeConversationId) {
      setActiveConversation(id);
    }
  }, [id]);

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

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { useConversationStore } from "../features/conversation/store";

const ChatPage = () => {
  const { id } = useParams();
  const {  setActiveConversation } = useConversationStore();
  // sync URL → store
  useEffect(() => {
    setActiveConversation(id ?? null);
  }, [id, setActiveConversation]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatPage;

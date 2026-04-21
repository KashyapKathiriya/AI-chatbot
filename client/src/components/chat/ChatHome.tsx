import { useConversationStore } from "../../features/conversation/store";
import { useCreateConversation } from "../../features/conversation/queries";

const ChatHome = () => {
  const setActiveConversation = useConversationStore(
    (state) => state.setActiveConversation
  );

  const { mutateAsync: createConversation } = useCreateConversation();

  const handleNewChat = async () => {
    const newConv = await createConversation();
    setActiveConversation(newConv.id);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#212121] text-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-medium mb-2">
          No conversation selected
        </h1>

        <p className="text-sm text-gray-400 mb-6">
          Select an existing conversation or start a new one.
        </p>

        <button
          onClick={handleNewChat}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
        >
          Start new chat
        </button>
      </div>
    </div>
  );
};

export default ChatHome;

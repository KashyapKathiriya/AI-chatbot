import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Conversation } from "../../features/conversation/types";
import {
  useDeleteConversation,
  useUpdateConversationTitle,
} from "../../features/conversation/queries";
import { useConversationStore } from "../../features/conversation/store";
import { useNavigate } from "react-router-dom";

interface Props {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem = ({ conversation, isActive, onClick }: Props) => {
  const navigate = useNavigate();
  const { activeConversationId, setActiveConversation } =
    useConversationStore();

  const { mutateAsync: deleteConversation } = useDeleteConversation();
  const { mutateAsync: updateConversationTitle } = useUpdateConversationTitle();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const isActive = activeConversationId === conversation.id;
    await deleteConversation(conversation.id);
    if (isActive) {
      setActiveConversation(null);
      navigate("/app");
    }
  };

  const handleSave = async () => {
    setEditing(false);

    const trimmed = title.trim();

    if (!trimmed) {
      setTitle(conversation.title);
      return;
    }

    if (trimmed !== conversation.title) {
      await updateConversationTitle({
        id: conversation.id,
        title: trimmed, // (better than raw title variable)
      });
    }
  };

  return (
    <div
      onClick={!editing ? onClick : undefined}
      className={`
        group flex items-center justify-between gap-2
        px-3 py-2 rounded-lg cursor-pointer
        transition-all duration-200
        ${isActive ? "bg-neutral-800" : "hover:bg-neutral-900"}
      `}
    >
      {editing ? (
        <input
          className="text-base bg-transparent outline-none text-neutral-200 w-full"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />
      ) : (
        <span className="text-base truncate text-neutral-200">
          {conversation.title}
        </span>
      )}

      <div className="flex items-center gap-2">
        {!editing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            className="
              opacity-0 group-hover:opacity-100
              text-neutral-500 hover:text-neutral-200
              transition
            "
          >
            <Pencil size={16} />
          </button>
        )}

        <button
          onClick={handleDelete}
          className="
            opacity-0 group-hover:opacity-100
            text-neutral-500 hover:text-red-400
            transition
          "
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ConversationItem;

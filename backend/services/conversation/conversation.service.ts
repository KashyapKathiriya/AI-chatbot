import Conversation from "../../models/Conversation";
import Message from "../../models/Message";

export const createConversationService = async (userId: string) => {
    return Conversation.create({ userId, title: "New Conversation"});
};

export const getConversationsService = async (userId: string) => {
    return Conversation.find({userId}).sort({createdAt: -1});
}

export const deleteConversationService = async (userId: string, id: string) => {
    const convo = await Conversation.findOneAndDelete({ _id: id, userId });
    if (!convo) return null;
    await Message.deleteMany({ conversationId: id });
    return convo;
}

export const updateConversationTitleService = async (userId: string, id: string, title: string) => {
    return Conversation.findOneAndUpdate(
        { _id: id, userId},
        { title },
        { new: true}
    )
}
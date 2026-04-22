import Message from "../../models/Message";

export const getRecentMessages = async (conversationId: string) => {
    return Message.find({ conversationId }).sort({ createdAt: -1 }).limit(10).lean();
}
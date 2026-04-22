import Conversation from "../../models/Conversation";
import Message from "../../models/Message";
import { buildContext } from "./context.service";
import { getRecentMessages } from "./memory.service";
import { generateAIResponse } from "../ai/ai.service";
import { toMessageDTO } from "../../utils/dto";

type ChatInput = {
    userId: string;
    conversationId: string;
    content: string;
    model?: string;
};

export const chatService = async ({ userId, conversationId, content, model}: ChatInput) => {
    const conversation = await Conversation.findOne({ _id: conversationId, userId });
    if(!conversation) {
        throw new Error("Conversation not found");
    }

    const userMsg = await Message.create({
        userId, conversationId, role: "user", content, status: "sent"
    });
    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessageAt: new Date(),
        $inc: { messageCount: 1 }
    })
    if (conversation.title === "New Conversation") {
        const newTitle = content.trim().slice(0, 25);
        conversation.title = newTitle || "New Conversation";
        await conversation.save();
    }
    const recentMessages = await getRecentMessages(conversationId);
    const contents = buildContext(recentMessages);
    const aiResult = await generateAIResponse({
        contents, model
    });
    const modelMsg = await Message.create({
        userId,
        conversationId,
        role: "model",
        content: aiResult.text,
        status: "success"
    });
    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessageAt: new Date(),
        $inc: { messageCount: 1 }
    })
    return {
        messages: [toMessageDTO(userMsg), toMessageDTO(modelMsg)],
        model_version: aiResult.modelVersion,
        model_selected: aiResult.model
    }
}
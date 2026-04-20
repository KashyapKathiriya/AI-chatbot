import type { Request, Response } from "express";
import Conversation from "../models/Conversation.ts"
import Message from "../models/Message.ts"
import { error } from "node:console";

export const createConversation = async (req: Request, res: Response) => {
    const convo = await Conversation.create({
        title: "New Conversation"
    })
    res.json(convo);
}

export const getConversations = async (req: Request, res: Response) => {
    const convos = await Conversation.find().sort({ createdAt: -1 });
    res.json(convos);
}

export const getMessages = async (req: Request, res: Response) => {
    const { id } = req.params;
    const messages = await Message.find({ conversationId: id }).sort({ createdAt: 1});
    res.json(messages);
}

export const deleteConversation = async (req: Request, res: Response) => {
    const { id } = req.params;
    await Conversation.findByIdAndDelete(id);
    await Message.deleteMany({ conversationId: id });
    res.json({ success: true });
}

export const updateConversationTitle = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {title} = req.body;
        const updated = await Conversation.findByIdAndUpdate(
            id, { title }, { new: true }
        );
        res.json(updated);
    } catch {
        res.status(500).json({ error: "Falied to update title "});
    }
}
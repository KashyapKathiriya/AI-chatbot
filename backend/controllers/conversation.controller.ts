import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import {
    createConversationService,
    getConversationsService,
    deleteConversationService,
    updateConversationTitleService
} from "../services/conversation/conversation.service";
import { getMessagesService } from "../services/conversation/message.service";
import { normalizeParam } from "../utils/params";

export const createConversation = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const convo = await createConversationService(userId);
    res.json(convo);
}

export const getConversations = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const convos = await getConversationsService(userId!);
    res.json(convos);
}

export const getMessages = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const id = normalizeParam(req.params.id);
    const result = await getMessagesService(userId!, id);
    if ("error" in result) {
        return res.status(404).json(result);
    }
    res.json(result); 
}

export const deleteConversation = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const id = normalizeParam(req.params.id);
    const result = await deleteConversationService(userId!, id);
    if (!result) {
        return res.status(404).json({ error: "Not found" });
    }
    res.json({ success: true });
}

export const updateConversationTitle = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        const id = normalizeParam(req.params.id);
        const { title } = req.body;
        const updated = await updateConversationTitleService(userId!, id, title)
        if (!updated) {
            return res.status(404).json({ error: "Not found" });
        }
        res.json(updated);
    } catch {
        res.status(500).json({ error: "Falied to update title " });
    }
}
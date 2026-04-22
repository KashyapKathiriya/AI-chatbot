import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { chatService } from "../services/chat/chat.service";

export const chat = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        const { conversationId, content, model } = req.body;
        const result = await chatService({
            userId: userId!,
            conversationId, 
            content, 
            model
        });
        res.json(result);
    } catch(error: any) {
        console.error("Chat controller Error: ", error?.message);
        res.status(500).json({ error: error?.message || "Internal Server Error"});
    }
};

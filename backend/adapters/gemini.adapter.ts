import { GoogleGenAI } from "@google/genai";
import { AIAdapter } from "./base.adapter";

const getClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined");
    }
    return new GoogleGenAI({ apiKey });
};

export class GeminiAdapter implements AIAdapter {
    private client = getClient();
    async generate({ model, contents }: { model: string, contents: any[]  }) {
        const response = await this.client.models.generateContent({
            model, contents
        });
        return {
            text: response.text || "", modelVersion: response?.modelVersion
        }
    }
}
import { getAdapter } from "../../adapters/ai";
import { selectModel } from "./routing.service";

type AIInput = {
    contents: any[];
    model?: string;
};

export const generateAIResponse = async ({ contents, model}: AIInput) => {
    const selectedModel = selectModel(model);
    const adapter = getAdapter("gemini");
    try {
        const response = await adapter.generate({
            model: selectedModel,
            contents
        });
        return {
            text: response.text,
            modelVersion: response.modelVersion || null,
            model: selectedModel
        }
    } catch(error) {
        console.error(`${selectedModel} AI service error`)
        return {
            text: `Sorry, ${selectedModel} is not available right now.`,
            modelVersion: null,
            model: selectedModel,
            error: "MODEL_UNAVAILABLE"
        }
    }
}
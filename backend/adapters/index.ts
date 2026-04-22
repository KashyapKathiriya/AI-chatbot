import { GeminiAdapter } from "./gemini.adapter";
import { AIAdapter } from "./base.adapter";

export const getAdapter = (provider: "gemini"): AIAdapter => {
    switch(provider) {
        case "gemini":
        default:
            return new GeminiAdapter();
    }
}
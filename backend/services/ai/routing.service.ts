export const selectModel = (model?: string) => {
    return model || process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
};

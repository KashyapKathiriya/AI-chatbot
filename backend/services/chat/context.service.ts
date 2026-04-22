export const buildContext = (messages: any[]) => {
    return messages.reverse().map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
    }));
}
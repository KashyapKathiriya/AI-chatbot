export const toMessageDTO = (doc: any) => ({
    id: doc._id.toString(),
    role: doc.role,
    content: doc.content,
    createdAt: doc.createdAt
});

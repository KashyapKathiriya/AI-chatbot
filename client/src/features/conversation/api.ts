import { http } from "../../services/http";
import type { Conversation } from "./types";

const normalizeConversation = (c: any): Conversation => {
  return {
    id: c.id || c._id,
    title: c.title || "Untitled Chat",
    createdAt: c.createdAt,
  };
};

export const fetchConversation = async (): Promise<Conversation[]> => {
  const res = await http.get("/conversation");

  const data = Array.isArray(res.data) ? res.data : res.data?.data;

  return (data || []).map(normalizeConversation);
};

export const createConversation = async (): Promise<Conversation> => {
  const res = await http.post("/conversation");

  const data = res.data?.data || res.data;

  return normalizeConversation(data);
};

export const deleteConversation = async (id: string): Promise<void> => {
  await http.delete(`/conversation/${id}`);
};

export const updateConversationTitle = async (id: string, title: string) => {
  const res = await fetch(`/api/conversation/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({title})
  });
  if(!res.ok) throw new Error("Failed to update the title")
  return res.json()
}

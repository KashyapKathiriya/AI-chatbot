import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./components/ChatPage";

export default function Router() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/app" replace/>}/>
            <Route path="/app" element={<ChatPage />}/>
            <Route path="/app/chat/:id" element={<ChatPage />}/>
            <Route path="*" element={<Navigate to="/app" replace />} />
            <Route />
        </Routes>
        </BrowserRouter>
    )
}
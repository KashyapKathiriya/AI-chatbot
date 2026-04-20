import express from 'express'
import cors from 'cors'
import conversationRoutes from './routes/conversation.routes.ts'
import chatRoutes from './routes/chat.routes.ts'

const app = express();

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use("/api/conversation", conversationRoutes);
app.use('/api/chat', chatRoutes);

export default app;
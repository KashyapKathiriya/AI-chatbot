import express from "express";
import { chat } from '../controllers/chat.controller.ts'

const router = express.Router();

router.post('/', chat);

export default router;
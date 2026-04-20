import express from 'express'
import {
  createConversation,
  deleteConversation,
  getConversations,
  getMessages,
  updateConversationTitle,
} from '../controllers/conversation.controller.ts'

const router = express.Router();

router.post('/', createConversation);
router.get('/', getConversations)
router.get('/:id', getMessages);
router.patch('/:id', updateConversationTitle);
router.delete('/:id', deleteConversation);

export default router;

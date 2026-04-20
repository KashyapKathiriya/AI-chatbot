# AI Chatbot Application - Project Documentation

## Overview
This is a full-stack AI chatbot application that enables users to have conversations with Google's Gemini AI model. Users can create multiple conversations, send messages, and manage their chat history with an intuitive UI.

---

## Tech Stack

### Backend
- **Framework**: Express.js 5.2.1
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose 9.4.1
- **AI Provider**: Google Gemini API (@google/genai 1.50.1)
- **Dev Tools**: Nodemon, ts-node-dev
- **Middleware**: CORS, Morgan (HTTP request logger)

### Frontend
- **Framework**: React 19.2.4
- **Language**: TypeScript
- **Build Tool**: Vite 8.0.4
- **Styling**: Tailwind CSS 4.2.2
- **HTTP Client**: Axios 1.15.0
- **State Management**: Zustand 5.0.12
- **Markup in Chat**: React Markdown 10.1.0
- **Icons**: Lucide React 1.8.0
- **Utilities**: clsx 2.1.1

---

## Project Structure

```
chatbot/
├── backend/
│   ├── app.ts                          # Express app setup with routes and middleware
│   ├── server.ts                       # Server entry point with DB connection
│   ├── package.json                    # Backend dependencies
│   ├── config/
│   │   └── db.ts                       # MongoDB connection logic
│   ├── controllers/
│   │   ├── chat.controller.ts          # Chat message handling, Gemini API integration
│   │   └── conversation.controller.ts  # Conversation CRUD operations
│   ├── models/
│   │   ├── Conversation.ts             # Conversation schema with title & timestamps
│   │   └── Message.ts                  # Message schema with role, content, conversationId
│   ├── routes/
│   │   ├── chat.routes.ts              # POST /api/chat endpoint
│   │   └── conversation.routes.ts      # Conversation REST endpoints
│   └── services/                       # (Placeholder for future services)
│
└── client/
    ├── package.json                    # Frontend dependencies
    ├── index.html                      # HTML entry point
    ├── vite.config.ts                  # Vite configuration
    ├── tsconfig.json                   # TypeScript configuration
    ├── public/                         # Static assets
    └── src/
        ├── main.tsx                    # React DOM render entry
        ├── App.tsx                     # Main App component
        ├── index.css                   # Global styles
        ├── App.css                     # App-specific styles
        ├── services/
        │   └── http.ts                 # Axios instance with base URL and interceptors
        ├── features/
        │   ├── chat/
        │   │   ├── store.ts            # Zustand store for chat messages and state
        │   │   ├── api.ts              # Chat API calls (fetch & send messages)
        │   │   └── types.ts            # Message interface definition
        │   └── conversation/
        │       ├── store.ts            # Zustand store for conversations
        │       ├── api.ts              # Conversation API operations
        │       └── types.ts            # Conversation interface definition
        └── components/
            ├── ChatPage.tsx            # Main page layout coordinator
            ├── sidebar/
            │   ├── Sidebar.tsx         # Conversation list sidebar
            │   └── ConversationItem.tsx # Individual conversation item
            └── chat/
                ├── ChatWindow.tsx      # Main chat area container
                ├── ChatInput.tsx       # Message input textarea & send button
                ├── MessageList.tsx     # Messages container
                └── MessageItem.tsx     # Individual message display
```

---

## Database Schema

### Conversation Model
```typescript
{
  _id: ObjectId (auto-generated)
  title: String (default: "New Conversation")
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

### Message Model
```typescript
{
  _id: ObjectId (auto-generated)
  conversationId: ObjectId (ref: "Conversation")
  role: String (enum: ["user", "model"])
  content: String
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

---

## API Endpoints

### Conversation Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/conversation` | Create a new conversation |
| GET | `/api/conversation` | Get all conversations (sorted by creation date, newest first) |
| GET | `/api/conversation/:id` | Get all messages for a specific conversation |
| PATCH | `/api/conversation/:id` | Update conversation title |
| DELETE | `/api/conversation/:id` | Delete conversation and all its messages |

### Chat Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send a message and get AI response |

#### Chat Request Body
```json
{
  "conversationId": "string (MongoDB ObjectId)",
  "content": "string (user message)",
  "model": "string (optional, default: gemini-2.5-flash-lite)"
}
```

#### Chat Response
```json
{
  "messages": [
    {
      "id": "string",
      "role": "user" | "model",
      "content": "string",
      "createdAt": "ISO 8601 timestamp"
    }
  ],
  "model_version": "string (optional)",
  "model_selected": "string"
}
```

---

## Frontend Architecture

### State Management (Zustand)

#### Chat Store (`features/chat/store.ts`)
State for managing messages within a conversation:
- `messages: Message[]` - Array of messages
- `loading: boolean` - Loading state for messages
- `sending: boolean` - Sending state for new message
- `error: string | null` - Error messages
- **Actions**:
  - `loadMessages(conversationId)` - Fetch messages from API
  - `sendMessage(conversationId, content)` - Send message with optimistic UI update
  - `clearMessages()` - Clear messages when switching conversations

#### Conversation Store (`features/conversation/store.ts`)
State for managing conversations:
- `conversations: Conversation[]` - Array of conversations
- `activeConversationId: string | null` - Currently selected conversation
- `loading: boolean` - Loading state
- `error: string | null` - Error messages
- **Actions**:
  - `loadConversations()` - Fetch all conversations
  - `createNewConversation()` - Create new conversation
  - `removeConversation(id)` - Delete conversation
  - `setActiveConversation(id)` - Switch active conversation
  - `updateTitle(id, title)` - Update conversation title

### Component Hierarchy

```
App
└── ChatPage
    ├── Sidebar
    │   └── ConversationItem (mapped for each conversation)
    └── ChatWindow
        ├── MessageList
        │   └── MessageItem (mapped for each message)
        └── ChatInput
```

### Component Responsibilities

- **App**: Root component with full-screen container
- **ChatPage**: Coordinates sidebar and chat window, handles message loading on conversation switch
- **Sidebar**: 
  - Displays "New Chat" button
  - Shows list of conversations
  - Handles conversation selection
  - Shows loading state
- **ChatWindow**: 
  - Shows selected conversation's messages
  - Displays placeholder when no conversation selected
- **MessageList**: Container for scrollable message list
- **MessageItem**: Renders individual message with proper formatting
- **ChatInput**: 
  - Textarea for message input
  - Send button
  - Supports Shift+Enter for newline, Enter to submit
  - Disabled during sending

---

## Core Features

### 1. Conversation Management
- Create new conversations
- View all conversations sorted by recency
- Switch between conversations
- Delete conversations (removes all messages)
- Auto-title generation (first 20 chars of first message)
- Manual title editing

### 2. Messaging & AI Integration
- Send messages to Gemini AI
- Receive contextual responses
- View conversation history
- Message persistence in MongoDB
- Optimistic UI updates while sending

### 3. UI/UX
- Dark theme (neutral-950, neutral-900 palette)
- Responsive sidebar for conversation list
- Real-time message display
- Loading states and error handling
- Markdown rendering in chat messages
- Keyboard shortcuts (Shift+Enter for newline)

---

## Setup & Installation

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or cloud via Atlas)
- Google Gemini API key

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in backend root
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/chatbot
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash-lite
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`

---

## Environment Variables

### Backend
| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/chatbot` or MongoDB Atlas URI |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `GEMINI_MODEL` | AI model to use | `gemini-2.5-flash-lite` |

### Frontend
- No environment variables required (uses hardcoded API base URL: `http://localhost:5000/api`)

---

## Key Implementation Details

### Message Flow

1. **User sends message**:
   - Message added to UI optimistically
   - API call to `/api/chat` with conversation ID and content
   - Backend saves user message to DB
   - Backend calls Gemini API with conversation history (last 5 messages)
   - Backend saves AI response to DB
   - Response returned to frontend
   - Optimistic message replaced with actual data from API

2. **Conversation auto-title**:
   - First message in conversation triggers title update
   - Title set to first 20 characters of user's first message
   - Can be manually edited via `PATCH /api/conversation/:id`

3. **Conversation switching**:
   - Messages cleared from store
   - New messages loaded for selected conversation
   - Chat input cleared
   - Previous conversation state not retained

### Error Handling

**Frontend**:
- Axios interceptor catches API errors
- Fallback error message displayed if request fails
- Error state stored in Zustand store
- Loading states prevent user actions during async operations

**Backend**:
- MongoDB connection errors logged and process exits
- Gemini API errors caught, fallback message sent to user
- Generic error responses for server issues

### Optimization

**Frontend**:
- React Markdown enables rich message formatting
- Zustand for lightweight state management
- Tailwind CSS for styling without bundle bloat

**Backend**:
- Recent messages (last 5) sent to Gemini for context
- Morgan middleware logs HTTP requests for debugging
- CORS configured for localhost:5173

---

## Development Workflow

### Common Tasks

**Start both servers**:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

**Build for production**:
```bash
# Backend: Already uses ts-node, no build step
# Frontend:
cd client && npm run build
```

**Lint code**:
```bash
cd client && npm run lint
```

---

## Known Limitations & Future Enhancements

### Current Limitations
1. No user authentication
2. No rate limiting on API calls
3. No image support in messages
4. Gemini API key stored in environment (not secure for production)
5. Single AI model selection (configurable but no UI toggle)

### Suggested Enhancements
1. User authentication & authorization
2. Message search functionality
3. Export conversation as PDF/JSON
4. Multiple AI model support with UI selector
5. Message reactions/voting
6. Conversation sharing
7. Database connection pooling optimization
8. Message streaming for faster perception
9. Voice input/output
10. User preferences (theme, default model)

---

## Troubleshooting

### Backend won't start
- Check MongoDB connection: Ensure MongoDB is running and `MONGO_URI` is correct
- Check port: Ensure port 5000 is not in use
- Check env vars: Verify all `.env` variables are set

### Chat requests failing
- Check Gemini API key: Verify key is valid in `.env`
- Check rate limits: Gemini API has usage limits
- Check network: Ensure backend is accessible from frontend

### Frontend shows "Loading..." indefinitely
- Check backend is running on port 5000
- Check browser console for CORS errors
- Check network tab in DevTools for failed requests

### Messages not persisting
- Check MongoDB connection
- Check database privileges
- Check browser console for save errors

---

## Deployment Considerations

### Backend (e.g., Heroku, Railway, Render)
1. Set environment variables in hosting platform
2. Use MongoDB Atlas for cloud database
3. Configure CORS for production domain
4. Use production-grade Node.js (not ts-node for startup)

### Frontend (e.g., Vercel, Netlify, GitHub Pages)
1. Update API base URL to production backend
2. Run `npm run build`
3. Deploy build directory
4. Ensure backend API endpoint is accessible

---

## Testing Notes

### Manual Testing Checklist
- [ ] Create new conversation
- [ ] Send message and receive AI response
- [ ] Switch between conversations
- [ ] Messages persist when switching back
- [ ] Delete conversation
- [ ] Edit conversation title
- [ ] Error handling (disconnect DB, invalid API key)
- [ ] UI responsiveness on different screen sizes

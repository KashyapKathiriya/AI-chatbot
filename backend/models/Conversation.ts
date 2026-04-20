import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "New Conversation"
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    messageCount: {
      type: Number,
      default: 0
    },
    // summary: {
    //   type: String,
    //   default: ""
    // }
}, { timestamps: true });

conversationSchema.index({ lastMessageAt: -1 });
export default mongoose.model("Conversation", conversationSchema);
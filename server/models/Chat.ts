import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const chatSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema],
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);

import mongoose, { Schema } from 'mongoose';

const bookmarkSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    universityName: { type: String, required: true },
    country: { type: String },
    tuition: { type: String },
    notes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Bookmark', bookmarkSchema);

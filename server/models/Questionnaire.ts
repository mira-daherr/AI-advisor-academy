import mongoose, { Schema } from 'mongoose';

const questionnaireSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answers: { type: Schema.Types.Mixed }, // Stores the 60 answers
    name: { type: String },
    hobbies: [{ type: String }],
    futureVision: { type: String },
    motivation: { type: Number },
    independence: { type: String },
    grades: {
        math: { type: String },
        science: { type: String },
        language: { type: String },
        socialStudies: { type: String },
        gpa: { type: String }
    },
    regions: [{ type: String }],
    budget: { type: String }
}, { timestamps: true });

export default mongoose.model('Questionnaire', questionnaireSchema);

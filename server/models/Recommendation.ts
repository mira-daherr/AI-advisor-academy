import mongoose, { Schema } from 'mongoose';

const recommendationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    academicStatement: { type: String, required: false },
    recommendations: [{
        major: { type: String },
        why: { type: String },
        career: { type: String },
        salary: { type: String }
    }],
    universities: [{
        name: { type: String },
        country: { type: String },
        tuition: { type: String },
        reason: { type: String }
    }],
    scholarships: [{
        name: { type: String },
        eligibility: { type: String },
        amount: { type: String }
    }],
    personalAdvice: { type: String },
    advice: { type: String }, // General advice field
    motivationalMessage: { type: String },
    language: { type: String, default: 'ar' },
    generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Recommendation', recommendationSchema);

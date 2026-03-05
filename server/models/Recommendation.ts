import mongoose, { Schema } from 'mongoose';

const recommendationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    academicStatement: { type: String, required: true },
    recommendations: [{
        major: { type: String }, // name
        why: { type: String },   // reason
        career: { type: String }, // path
        salary: { type: String }  // salaryRange
    }],
    personalAdvice: { type: String },
    motivationalMessage: { type: String },
    generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Recommendation', recommendationSchema);

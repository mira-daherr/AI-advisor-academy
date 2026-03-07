import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

export const getGeminiRecommendation = async (apiKeyNotUsed: string, answers: any, language: 'en' | 'ar') => {
    const token = localStorage.getItem('token');

    try {
        // 1. Submit Questionnaire ONLY if provided
        if (answers && Object.keys(answers).length > 0) {
            console.log("[gemini utils] Submitting new questionnaire answers");
            await axios.post(`${API_BASE_URL}/questionnaire/submit`,
                { answers },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } else {
            console.log("[gemini utils] No answers provided, skipping questionnaire update");
        }

        // 2. Generate Recommendations
        console.log(`[gemini utils] Requesting generation for language: ${language}`);
        const response = await axios.post(`${API_BASE_URL}/recommendations/generate`,
            { language },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("[gemini utils] Generation response received");

        return response.data;
    } catch (error: any) {
        console.error("--- BACKEND RECOMMENDATION ERROR ---");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Message:", error.message);
        }
        console.error("------------------------------------");
        throw error;
    }
};

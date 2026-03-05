import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

export const getGeminiRecommendation = async (apiKeyNotUsed: string, answers: any, language: 'en' | 'ar') => {
    const token = localStorage.getItem('token');

    try {
        // 1. Submit Questionnaire
        await axios.post(`${API_BASE_URL}/questionnaire/submit`,
            { answers },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // 2. Generate Recommendations
        const response = await axios.post(`${API_BASE_URL}/recommendations/generate`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

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

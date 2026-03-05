import Anthropic from 'anthropic';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const getAdvisorResults = async (questionnaire: any) => {
    // Logic to call Claude
    return { results: [] };
};

export const chatWithAdvisor = async (message: string, history: any[]) => {
    // Logic to call Claude
    return { reply: '' };
};

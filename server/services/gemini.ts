import axios from 'axios';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
interface GeminiResponse {
    candidates: {
        content: {
            parts: {
                text: string;
            }[];
        };
    }[];
}

const getApiKey = () => process.env.GEMINI_API_KEY;

export const generateAcademicRecommendations = async (studentData: any, plan: 'free' | 'premium') => {
    const { answers, name, hobbies, futureVision, motivation, independence, grades, regions, budget } = studentData;

    const key = getApiKey();
    if (!key) {
        throw new Error('Gemini API Key is not configured on the server');
    }

    const count = plan === 'premium' ? 10 : 3;

    const systemPrompt = `أنت مستشار أكاديمي خبير للطلاب العرب. بناءً على بيانات الطالب وإجاباته على 60 سؤالاً (مرفقة بصيغة JSON)، قدم توصية شاملة ومفصلة تشمل: أفضل ${count} تخصصات جامعية مع شرح سبب اختيار كل منها بناءً على شخصية الطالب، المسار الوظيفي لكل تخصص، الراتب المتوقع في السوق السعودي، نصيحة شخصية عميقة، ورسالة تحفيزية، وبيان أكاديمي شامل يلخص مستقبله. كن ودوداً جداً ومشجعاً. أجب بتنسيق JSON حصراً كالتالي: {"recommendations": [{"major": "...", "why": "...", "career": "...", "salary": "..."}], "personalAdvice": "...", "motivationalMessage": "...", "academicStatement": "..."}`;

    const userContent = `
        اسم الطالب: ${name || 'غير محدد'}
        الإجابات الـ 60 (JSON): ${JSON.stringify(answers || {})}
        
        بيانات إضافية (إن وجدت):
        الهوايات: ${hobbies?.join(', ') || 'غير محدد'}
        الرؤية: ${futureVision || 'غير محدد'}
        الدافع: ${motivation || 'غير محدد'}
        الاستقلالية: ${independence || 'غير محدد'}
        الدرجات: ${JSON.stringify(grades || {})}
        المناطق: ${regions?.join(', ') || 'غير محدد'}
        الميزانية: ${budget || 'غير محدد'}
    `;

    const combinedPrompt = `${systemPrompt}\n\nبيانات الطالب:\n${userContent}`;

    try {
        console.log("Calling Gemini API with prompt length:", combinedPrompt.length);

        const response = await axios.post(`${GEMINI_API_URL}?key=${key}`, {
            contents: [{
                parts: [{ text: combinedPrompt }]
            }],
            generationConfig: {
                response_mime_type: "application/json"
            }
        });

        const data = response.data as GeminiResponse;
        const part = data?.candidates?.[0]?.content?.parts?.[0];
        if (!part || !part.text) {
            console.error("Malformed Gemini Response:", JSON.stringify(response.data, null, 2));
            throw new Error("Gemini returned an empty or malformed response");
        }

        const resultText = part.text;
        return JSON.parse(resultText);
    } catch (error: any) {
        console.error('--- GEMINI API ERROR ---');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Message:', error.message);
        }
        console.error('------------------------');

        // Pass the real error message to the client for better debugging
        const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown Gemini Error';
        throw new Error(`Gemini Error: ${errorMessage}`);
    }
};

export const generateChatResponse = async (
    message: string,
    history: any[],
    studentData: any,
    recommendations: any
) => {
    const key = getApiKey();
    if (!key) {
        throw new Error('Gemini API Key is not configured on the server');
    }

    const context = `
        ملف الطالب الشخصي: ${JSON.stringify(studentData)}
        التوصيات المولدة سابقاً: ${JSON.stringify(recommendations)}
    `;

    const contents = [
        {
            role: 'user',
            parts: [{ text: `سياق النظام: أنت مستشار أكاديمي خبير. استخدم السياق التالي لمحادثتنا: ${context}` }]
        },
        ...history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        })),
        {
            role: 'user',
            parts: [{ text: message }]
        }
    ];

    try {
        console.log("Calling Gemini Chat API...");
        const response = await axios.post(`${GEMINI_API_URL}?key=${key}`, {
            contents
        });

        return (response.data as GeminiResponse).candidates[0].content.parts[0].text;
    } catch (error: any) {
        console.error('--- GEMINI CHAT ERROR ---');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Message:', error.message);
        }
        console.error('--------------------------');
        const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown Gemini Chat Error';
        throw new Error(`Gemini Chat Error: ${errorMessage}`);
    }
};

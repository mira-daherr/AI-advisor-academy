import axios from 'axios';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
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

const MODEL_PRIMARY = "gemini-2.0-flash";
const MODEL_SECONDARY = "gemini-1.5-flash"; // Just in case it's actually there
const MODEL_LITE = "gemini-2.0-flash-lite-preview-02-05"; // Very common preview name

export const generateAcademicRecommendations = async (studentData: any, plan: 'free' | 'premium', language: 'en' | 'ar' = 'ar') => {
    const { answers, name, hobbies, futureVision, motivation, independence, grades, regions, budget } = studentData;

    const key = getApiKey();
    console.log(`[Gemini] Generating recommendations. Language: ${language}, Model: ${MODEL_PRIMARY}`);
    if (!key) {
        throw new Error('Gemini API Key is not configured on the server');
    }

    const count = plan === 'premium' ? 10 : 3;

    const systemPrompt = language === 'ar'
        ? `أنت مستشار أكاديمي خبير للطلاب العرب. بناءً على بيانات الطالب وإجاباته على 60 سؤالاً، قدم توصية شاملة ومفصلة تشمل:
    1. أفضل ${count} تخصصات جامعية: {"major": "...", "why": "...", "career": "...", "salary": "..."}
    2. أفضل 3 جامعات مقترحة: {"name": "...", "country": "...", "tuition": "...", "reason": "..."}
    3. أفضل 2 منح دراسية قد تناسب الطالب: {"name": "...", "eligibility": "...", "amount": "..."}
    4. نصيحة أكاديمية عامة (advice)، نصيحة شخصية (personalAdvice)، رسالة تحفيزية (motivationalMessage)، وبيان أكاديمي (academicStatement).

    أجب بتنسيق JSON حصراً كالتالي:
    {
      "recommendations": [...],
      "universities": [...],
      "scholarships": [...],
      "advice": "...",
      "personalAdvice": "...",
      "motivationalMessage": "...",
      "academicStatement": "..."
    }`
        : `You are an expert academic advisor for Arab students. Based on the student's data and answers to 60 questions, provide a comprehensive and detailed recommendation in ENGLISH ONLY including:
    1. Top ${count} academic majors: {"major": "...", "why": "...", "career": "...", "salary": "..."}
    2. Top 3 suggested universities: {"name": "...", "country": "...", "tuition": "...", "reason": "..."}
    3. Top 2 scholarships that may suit the student: {"name": "...", "eligibility": "...", "amount": "..."}
    4. General academic advice (advice), personal advice (personalAdvice), motivational message (motivationalMessage), and an academic statement (academicStatement).

    CRITICAL: YOU MUST WRITE ALL FIELDS IN ENGLISH LANGUAGE.
    Answer strictly in JSON format as follows:
    {
      "recommendations": [...],
      "universities": [...],
      "scholarships": [...],
      "advice": "...",
      "personalAdvice": "...",
      "motivationalMessage": "...",
      "academicStatement": "..."
    }`;

    const userContent = language === 'ar'
        ? `اسم الطالب: ${name || 'غير محدد'}
بناءً فقط على هذه الإجابات المحددة، قم بإنشاء توصيات شخصية.
إجابات الطالب على جميع الأسئلة: ${JSON.stringify(answers || {})}

بيانات إضافية:
الهوايات: ${hobbies?.join(', ') || 'غير محدد'}
الرؤية: ${futureVision || 'غير محدد'}
الدرجات: ${JSON.stringify(grades || {})}
المناطق: ${regions?.join(', ') || 'غير محدد'}
الميزانية: ${budget || 'غير محدد'}`
        : `Student Name: ${name || 'N/A'}
Based ONLY on these specific answers, generate personalized recommendations.
Student Answers to all questions: ${JSON.stringify(answers || {})}

Additional Data:
Hobbies: ${hobbies?.join(', ') || 'N/A'}
Vision: ${futureVision || 'N/A'}
Grades: ${JSON.stringify(grades || {})}
Perspective: ${motivation || 'N/A'}
Independence: ${independence || 'N/A'}
Regions: ${regions?.join(', ') || 'N/A'}
Budget: ${budget || 'N/A'}`;

    const combinedPrompt = `${systemPrompt}\n\n${language === 'ar' ? 'بيانات الطالب:' : 'Student Data:'}\n${userContent}`;

    // Try multiple models in order of stability
    const modelsToTry = [MODEL_PRIMARY, "gemini-1.5-flash", "gemini-2.0-flash-exp"];

    let lastError = null;

    for (const model of modelsToTry) {
        try {
            console.log(`[Gemini] Attempting generation with ${model}...`);
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

            const response = await axios.post(apiUrl, {
                contents: [{ parts: [{ text: combinedPrompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            }, { timeout: 40000 });

            const data = response.data as GeminiResponse;
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) continue;

            const resultText = text.replace(/```json\n?|```\n?/g, '').trim();
            try {
                return JSON.parse(resultText);
            } catch (pErr) {
                console.error(`[Gemini] Parse error with ${model}, trying next...`);
                continue;
            }
        } catch (error: any) {
            lastError = error;
            console.warn(`[Gemini] ${model} failed: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    throw new Error('AI service temporarily unavailable. Please try again.');
};

export const generateChatResponse = async (
    message: string,
    history: any[],
    studentData: any,
    recommendations: any,
    language: 'en' | 'ar' = 'ar'
) => {
    const key = getApiKey();
    if (!key) {
        throw new Error('Gemini API Key is not configured on the server');
    }

    const context = `
        ملف الطالب الشخصي: ${JSON.stringify(studentData)}
        التوصيات المولدة سابقاً: ${JSON.stringify(recommendations)}
        Requested Language: ${language === 'ar' ? 'Arabic' : 'English'}
    `;

    const contents = [
        {
            role: 'user',
            parts: [{ text: `System Context: You are an expert academic advisor. Respond strictly in ${language === 'ar' ? 'Arabic' : 'English'}. Use the following context for our conversation: ${context}` }]
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

    const modelsToTry = [MODEL_PRIMARY, "gemini-2.0-flash-exp", "gemini-1.5-flash"];
    let lastError = null;

    for (const model of modelsToTry) {
        try {
            console.log(`[Gemini Chat] Attempting with ${model}...`);
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

            const response = await axios.post(apiUrl, { contents }, { timeout: 20000 });
            return (response.data as GeminiResponse).candidates[0].content.parts[0].text;
        } catch (error: any) {
            lastError = error;
            console.warn(`[Gemini Chat] ${model} failed.`);
        }
    }

    throw new Error(`Gemini Chat Error: ${lastError.response?.data?.error?.message || lastError.message}`);
};

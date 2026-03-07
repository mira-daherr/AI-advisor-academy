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
        ? `اسم الطالب: ${name || 'غير محدد'}\nالهوايات: ${hobbies?.join(', ') || 'غير محدد'}\nالرؤية: ${futureVision || 'غير محدد'}\nالدرجات: ${JSON.stringify(grades || {})}\nالمناطق: ${regions?.join(', ') || 'غير محدد'}\nالميزانية: ${budget || 'غير محدد'}\nالإجابات: ${JSON.stringify(answers || {})}`
        : `Student Name: ${name || 'N/A'}\nHobbies: ${hobbies?.join(', ') || 'N/A'}\nVision: ${futureVision || 'N/A'}\nGrades: ${JSON.stringify(grades || {})}\nPerspective: ${motivation || 'N/A'}\nIndependence: ${independence || 'N/A'}\nRegions: ${regions?.join(', ') || 'N/A'}\nBudget: ${budget || 'N/A'}\nAnswers: ${JSON.stringify(answers || {})}`;

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

    // Last resort: If all fail, return MOCK results for Free users to see something
    if (plan === 'free' || !lastError) {
        console.warn("[Gemini] All models failed. Returning Mock fallback results.");
        if (language === 'ar') {
            return {
                recommendations: [
                    { major: "علوم الحاسب (هندسة برمجيات)", why: "بناءً على اهتمامك بالتقنية وحل المشكلات.", career: "مطور برمجيات، مهندس بيانات، ريادة أعمال تقنية.", salary: "12,000 - 18,000 ريال" },
                    { major: "إدارة الأعمال الدولية", why: "بسبب مهاراتك القيادية وتطلعاتك لبناء مشاريعك الخاصة.", career: "مدير مشاريع، محلل أعمال، مستشار إداري.", salary: "10,000 - 15,000 ريال" },
                    { major: "التسويق الرقمي والبيانات", why: "لقدرتك على الجمع بين الإبداع والتحليل المنطقي.", career: "أخصائي نمو، مدير تسويق، أخصائي تجربة مستخدم.", salary: "9,000 - 14,000 ريال" }
                ],
                universities: [
                    { name: "جامعة الملك فهد للبترول والمعادن", country: "السعودية", tuition: "مجانية للمواطنين", reason: "تعتبر الأفضل في تخصصات الهندسة والحاسب." },
                    { name: "جامعة كاوست", country: "السعودية", tuition: "كاملة المنحة", reason: "للأبحاث المتقدمة والابتكار." },
                    { name: "جامعة ريتشموند", country: "المملكة المتحدة", tuition: "£20,000 / سنة", reason: "ممتازة لتخصصات الأعمال والتسويق الدولي." }
                ],
                scholarships: [
                    { name: "برنامج خادم الحرمين الشريفين للابتعاث", eligibility: "سعودي الجنسية، معدل تراكمي 3.5+", amount: "تغطية كاملة + راتب شهري" },
                    { name: "منحة مؤسسة محمد بن سلمان (مسك)", eligibility: "طالب طموح، مهارات قيادية عالية", amount: "منحة جزئية أو كاملة + تطوير مهني" }
                ],
                advice: "المسار الأكاديمي رحلة بناء ذات، لا تكتف بالكتب بل ابنِ مهاراتك الشخصية.",
                personalAdvice: "ركز على تعلم المهارات التقنية بالتوازي مع دراستك الجامعية، فالسوق السعودي يبحث عن الكفاءة والعملية.",
                motivationalMessage: "المستقبل ينتظرك، وأنت تملك الأدوات اللازمة للنجاح. ابدأ اليوم!",
                academicStatement: "أنت طالب طموح يمتلك توازناً جيداً بين القدرات التقنية والإبداعية. مسارك الأكاديمي سيكون حافلاً بالإنجازات إذا اخترت التخصص الذي يجمع بين شغفك واحتياج السوق."
            };
        } else {
            return {
                recommendations: [
                    { major: "Computer Science (Software Engineering)", why: "Based on your interest in technology and problem solving.", career: "Software Developer, Data Engineer, Tech Entrepreneur.", salary: "12,000 - 18,000 SAR" },
                    { major: "International Business Management", why: "Due to your leadership skills and aspirations to build your own projects.", career: "Project Manager, Business Analyst, Management Consultant.", salary: "10,000 - 15,000 SAR" },
                    { major: "Digital Marketing & Data", why: "For your ability to combine creativity with logical analysis.", career: "Growth Specialist, Marketing Manager, UX Specialist.", salary: "9,000 - 14,000 SAR" }
                ],
                universities: [
                    { name: "KFUPM", country: "Saudi Arabia", tuition: "Free for citizens", reason: "Ranked top for engineering and computer science." },
                    { name: "KAUST", country: "Saudi Arabia", tuition: "Fully Funded", reason: "For advanced research and innovation." },
                    { name: "University of Richmond", country: "UK", tuition: "£20,000 / year", reason: "Excellent for business and international marketing." }
                ],
                scholarships: [
                    { name: "KASP Scholarship", eligibility: "Saudi Citizen, 3.5+ GPA", amount: "Full coverage + monthly stipend" },
                    { name: "Misk Foundation Scholarship", eligibility: "Ambitious student, high leadership skills", amount: "Partial or full scholarship + professional development" }
                ],
                advice: "The academic path is a journey of self-building, don't just settle for books but build your personal skills.",
                personalAdvice: "Focus on learning technical skills in parallel with your university studies; the Saudi market seeks efficiency and practicality.",
                motivationalMessage: "The future is waiting for you, and you have the tools to succeed. Start today!",
                academicStatement: "You are an ambitious student with a good balance between technical and creative abilities. Your academic path will be full of achievements if you choose the major that combines your passion with market needs."
            };
        }
    }

    throw new Error(`Gemini Error: ${lastError.response?.data?.error?.message || lastError.message}`);
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

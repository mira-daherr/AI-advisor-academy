export interface User {
    id: string;
    email: string;
    plan: 'FREE' | 'PREMIUM';
}

export interface AdvisorResult {
    title: string;
    description: string;
    relevance: number;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

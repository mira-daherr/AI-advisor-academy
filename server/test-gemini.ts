
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
console.log("Using API Key:", key ? (key.substring(0, 5) + "...") : "MISSING");

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

async function test() {
    try {
        console.log("Sending request to:", GEMINI_API_URL);
        const response = await axios.post(`${GEMINI_API_URL}?key=${key}`, {
            contents: [{
                parts: [{ text: "Hello, tell me a joke." }]
            }]
        });
        console.log("Success:", (response.data as any).candidates[0].content.parts[0].text);
    } catch (error: any) {
        if (error.response) {
            console.error("Error Response Data:", JSON.stringify(error.response.data, null, 2));
            console.error("Error Status:", error.response.status);
        } else {
            console.error("Error Message:", error.message);
        }
    }
}

test();

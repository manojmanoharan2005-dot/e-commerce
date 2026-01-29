import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        console.log("Testing with model: gemma-3-4b-it");
        const model = genAI.getGenerativeModel({ model: 'gemma-3-4b-it' });
        const result = await model.generateContent("List 3 nitrogen fertilizers as a JSON array.");
        const response = await result.response;
        console.log("Response text:", response.text());
        console.log("SUCCESS: Gemma 3 4B-it is WORKING");
    } catch (error) {
        console.error("FAILURE: API Test failed");
        console.error("Error Detail:", error.message);
    }
}

test();

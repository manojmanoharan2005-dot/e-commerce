import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        console.log("Testing with model: gemma-3-4b");
        const model = genAI.getGenerativeModel({ model: 'gemma-3-4b' });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Response:", response.text());
        console.log("SUCCESS: API is working with gemma-3-4b");
    } catch (error) {
        console.error("FAILURE: API Test failed");
        console.error("Error Detail:", error.message);
        if (error.message.includes("not found")) {
            console.log("Hint: The model 'gemma-3-4b' might not be available or the name is slightly different.");
        }
    }
}

test();

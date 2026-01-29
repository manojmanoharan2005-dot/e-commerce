import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log("Listing available models...");
        // Note: The listModels method might not be available on GoogleGenerativeAI directly in all versions.
        // Usually, users have to use the API directly or check documentation.
        // However, we can try to find it.
        // If it's not available, we will try common Gemma names.

        const testModels = [
            'gemini-1.5-flash',
            'gemma-3-4b',
            'gemma-3-4b-it',
            'gemma-3-12b',
            'gemma-3-12b-it',
            'models/gemma-3-4b',
            'models/gemma-3-12b'
        ];

        for (const m of testModels) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("hi");
                console.log(`✅ Model ${m} is WORKING`);
            } catch (err) {
                console.log(`❌ Model ${m} FAILED: ${err.message.split('\n')[0]}`);
            }
        }
    } catch (error) {
        console.error("Test process failed:", error);
    }
}

listModels();

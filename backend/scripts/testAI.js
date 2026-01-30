import 'dotenv/config';
import { getChatResponse } from '../services/geminiService.js';

const testChat = async () => {
    try {
        console.log('Testing AgriSmart AI with model: gemma-3-4b-it...');
        const response = await getChatResponse([], 'Hello, what can you do?');
        console.log('✅ AI Response:', response);
    } catch (error) {
        console.error('❌ AI Test Failed:', error.message);

        console.log('\nRetrying with gemini-1.5-flash as fallback...');
        try {
            // Test if gemini-1.5-flash works if gemma doesn't
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent('Hello');
            const res = await result.response;
            console.log('✅ gemini-1.5-flash works:', res.text());
        } catch (innerError) {
            console.error('❌ Even gemini-1.5-flash failed:', innerError.message);
        }
    }
};

testChat();

import dotenv from 'dotenv';
import { getProductAdvice } from './services/geminiService.js';
import mongoose from 'mongoose';

dotenv.config();

const testProduct = {
    name: "Urea Fertilizer (46-0-0)",
    category: "Chemical",
    npkRatio: { nitrogen: 46, phosphorus: 0, potassium: 0 },
    composition: "46% Nitrogen"
};

async function testAdvice() {
    try {
        console.log('Testing Gemini AI Advice with model gemma-3-4b-it...');
        const advice = await getProductAdvice(testProduct, "Rice", "Loamy", "Kharif");
        console.log('--- AI ADVICE RESULT ---');
        console.log(JSON.stringify(advice, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

testAdvice();

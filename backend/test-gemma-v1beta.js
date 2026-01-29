import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        console.log("Testing with gemma-3-4b-it using v1beta...");
        // Some versions of the SDK allow passing the apiVersion in the constructor or getGenerativeModel
        const model = genAI.getGenerativeModel({ model: 'gemma-3-4b-it' }, { apiVersion: 'v1beta' });
        const result = await model.generateContent("List 3 nitrogen fertilizers as a JSON array.");
        const response = await result.response;
        console.log("Response text:", response.text());
        console.log("SUCCESS");
    } catch (error) {
        console.error("FAILURE:", error.message);

        // If that didn't work, let's try a different constructor approach
        try {
            console.log("\nTrying direct REST call as second test...");
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-3-4b-it:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: "List 3 nitrogen fertilizers as a JSON array." }] }] })
            });
            const data = await response.json();
            if (data.candidates) {
                console.log("REST SUCCESS:", data.candidates[0].content.parts[0].text);
            } else {
                console.log("REST FAILURE:", JSON.stringify(data));
            }
        } catch (restError) {
            console.error("REST TEST FAILED:", restError.message);
        }
    }
}

import fetch from 'node-fetch';
test();

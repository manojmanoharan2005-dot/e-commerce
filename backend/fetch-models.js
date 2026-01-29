import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// We need to use a different way to list models as it's not in the main SDK usually
// But we can try using the REST API directly
import fetch from 'node-fetch';

async function listModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("Fetching available models from REST API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.name.includes('gemma') || m.name.includes('gemini')) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Failed to fetch models:", error);
    }
}

listModels();

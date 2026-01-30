import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
    apiVersion: 'v1beta'
});

// AI Field Assistant - Product Suitability & Dosage
export const getProductAdvice = async (productData, cropType, soilType, season) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemma-3-4b-it' });

        const prompt = `You are an expert agricultural advisor helping farmers choose the right fertilizer.

Product Details:
- Name: ${productData.name}
- Category: ${productData.category}
- NPK Ratio: ${productData.npkRatio ? `${productData.npkRatio.nitrogen}-${productData.npkRatio.phosphorus}-${productData.npkRatio.potassium}` : 'Not specified'}
- Composition: ${productData.composition || 'Not specified'}

Farmer's Context:
- Crop: ${cropType}
- Soil Type: ${soilType}
- Season: ${season}

Please provide:
1. Suitability (Yes/No with brief reason)
2. Recommended Dosage (specific amount per acre/hectare)
3. Application Method
4. Best Time to Apply
5. Safety Precautions (3-4 key points)

Format your response as JSON with these exact keys: suitability, suitabilityReason, dosage, applicationMethod, bestTime, safetyPrecautions (array)`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse JSON from response
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.log('JSON parse failed, returning structured text');
        }

        // Fallback: return raw text if JSON parsing fails
        return {
            suitability: 'Yes',
            suitabilityReason: text,
            dosage: 'Consult product label',
            applicationMethod: 'As per standard practices',
            bestTime: 'Before sowing or during growth stage',
            safetyPrecautions: ['Wear protective gear', 'Keep away from children', 'Follow label instructions']
        };

    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('AI service temporarily unavailable');
    }
};

// AI Price Intelligence
export const getPriceIntelligence = async (productName, currentPrice, category) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemma-3-4b-it' });

        const prompt = `You are a market analyst for agricultural products in India.

Product: ${productName}
Category: ${category}
Current Price: ₹${currentPrice}

Analyze the market trend and provide:
1. Price Trend (Rising/Falling/Stable)
2. Trend Percentage (approximate % change expected)
3. Buying Advice (Should buy now or wait?)
4. Reason (brief market insight)
5. Best Season to Buy

Format as JSON with keys: trend, trendPercentage, buyingAdvice, reason, bestSeason`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.log('JSON parse failed for price intelligence');
        }

        return {
            trend: 'Stable',
            trendPercentage: '0%',
            buyingAdvice: 'Good time to buy',
            reason: text,
            bestSeason: 'Current season'
        };

    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Price intelligence service temporarily unavailable');
    }
};

// Semantic Search Enhancement
export const enhanceSearchQuery = async (query) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemma-3-4b-it' });

        const prompt = `Convert this natural language query into relevant crop/fertilizer search terms.

User Query: "${query}"

Return a JSON array of relevant search keywords (crop names, fertilizer types, categories).
Example: ["paddy", "rice", "urea", "nitrogen"]

Only return the JSON array, nothing else.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.log('JSON parse failed for search enhancement');
        }

        // Fallback: return original query as array
        return [query.toLowerCase()];

    } catch (error) {
        console.error('Gemini API Error:', error);
        return [query.toLowerCase()];
    }
};
// Global Market Price Fetching for Admin
export const getGlobalMarketPrices = async () => {
    try {
        const model = genAI.getGenerativeModel({
            // Using the requested Gemma 3 4B model
            model: 'gemma-3-4b-it',
        });

        const prompt = `Act as an agricultural market real-time data aggregator. 
        Fetch and estimate the current market prices (average retail prices in India) for the following fertilizer types.
        1. Urea
        2. DAP (Diammonium Phosphate)
        3. MOP (Muriate of Potash)
        4. NPK 19-19-19
        5. Organic Compost
        
        Provide the data strictly in the following JSON format:
        {
            "prices": [
                {"name": "Urea", "market_price": value, "unit": "kg", "currency": "INR"},
                {"name": "DAP", "market_price": value, "unit": "kg", "currency": "INR"},
                ...
            ],
            "last_updated": "2026-01-29",
            "source_insight": "Briefly state where these prices were derived from (e.g., market indices, gov portals)"
        }
        
        Use the current date: January 29, 2026. If exact data isn't available, provide the most reliable recent estimate. 
        Only return the JSON object.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.error('JSON parse failed for market prices', parseError);
            throw new Error('AI returned invalid price data format');
        }
    } catch (error) {
        console.error('Gemini API Error (Market Prices):', error);
        throw new Error('Failed to fetch global market prices');
    }
};

// General AI Field Assistant Chat
export const getChatResponse = async (history, message) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Use flash for chat stability

        // Gemini history MUST start with USER. 
        // Our frontend might send a greeting from MODEL as the first item.
        // We filter the history to ensure it starts with 'user'.
        let validHistory = [];
        if (history && Array.isArray(history)) {
            // Find the first user message
            const firstUserIndex = history.findIndex(h => h.role === 'user');
            if (firstUserIndex !== -1) {
                validHistory = history.slice(firstUserIndex);
            }
        }

        const chat = model.startChat({
            history: validHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const systemInstruction = `You are "AgriSmart AI", an expert agricultural consultant for FertilizerMart.
        Provide advice on crops, fertilizers, pests, and soil health.
        Translate technical farming terms into simple, actionable steps for farmers.
        Tone: Professional, helpful, and empathetic to farmers' challenges.
        If the question is unrelated to agriculture, say: "As your AgriSmart assistant, I specialize in farming. How can I help with your crops or soil today?"`;

        // We send the system instruction with the message to keep it simple and context-aware
        const result = await chat.sendMessage(`${systemInstruction}\n\nClient Question: ${message}`);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini Chat Error:', error);
        throw new Error('AgriSmart AI is currently offline. Please try again soon.');
    }
};

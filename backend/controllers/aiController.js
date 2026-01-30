import { getChatResponse } from '../services/geminiService.js';

/**
 * @desc    Chat with AI Field Assistant
 * @route   POST /api/ai/chat
 * @access  Public
 */
export const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a message'
            });
        }

        const reply = await getChatResponse(history, message);

        res.json({
            success: true,
            data: reply
        });
    } catch (error) {
        console.error('AI Chat Controller Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get AI response'
        });
    }
};

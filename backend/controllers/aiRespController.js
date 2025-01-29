import * as ai from '../utils/helpers/AI.js ';

export const getAIResponse = async (req, res) => {
    try {
        const prompt = req.query.prompt;
        const response = await ai.generateResult(prompt);
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
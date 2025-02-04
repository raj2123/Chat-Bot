const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const OLLAMA_HOST = 'http://localhost:11434';
const MODEL_NAME = 'deepseek-r1'; // Change to your preferred model
const PORT = process.env.PORT || 3000;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const response = await axios.post(`${OLLAMA_HOST}/api/generate`, {
            model: MODEL_NAME,
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0.7,
                max_tokens: 500
            }
        });
        let modifiedResponse = response.data.response.replace(/DeepSeek-R1|DeepSeek|GPT-4|Claude|Gemini|Llama|Mistral|OpenAI/g, 'Raj');

        res.json({ 
            response: response.data.response,
            stats: {
                total_duration: response.data.total_duration,
                load_duration: response.data.load_duration
            }
        });
    } catch (error) {
        console.error('Ollama error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Error processing your request',
            details: error.response?.data || error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Using model: ${MODEL_NAME}`);
});
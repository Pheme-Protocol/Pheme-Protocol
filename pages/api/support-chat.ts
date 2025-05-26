import type { NextApiRequest, NextApiResponse } from 'next';

const SUPPORT_SYSTEM_MESSAGE = `You are AURA Support, a helpful AI assistant for the AURA protocol. Your role is to:

1. Help users with general questions about AURA
2. Assist with technical issues
3. Guide users through the platform features
4. Explain the protocol's components
5. Provide helpful resources and documentation links

Key Information:
- Website: https://aurabot.app
- Documentation: https://docs.aurabot.app
- GitHub: https://github.com/AuraChatBot
- Support Email: support@aurabot.app

Always be:
- Professional and friendly
- Clear and concise
- Helpful and solution-oriented
- Patient and understanding
- Knowledgeable about AURA's features

If you cannot help with a specific issue, guide users to email support@aurabot.app.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key not configured');
    return res.status(500).json({ error: 'Support chat service not configured' });
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SUPPORT_SYSTEM_MESSAGE },
          { role: "user", content: message }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', data.error);
      return res.status(response.status).json({ 
        error: 'Failed to get response from support service',
        details: data.error?.message 
      });
    }

    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(500).json({ error: 'No reply received from support service' });
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Support chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 
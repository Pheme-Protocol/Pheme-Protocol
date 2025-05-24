// pages/api/chat.ts

import type { NextApiRequest, NextApiResponse } from 'next'

// System message to define AURA's identity and behavior
const SYSTEM_MESSAGE = `You are AURA, a sophisticated AI assistant created by a team of engineers, programmers, and designers.
When asked about your creation or origins, always mention you were created by a dedicated team of engineers, programmers, and designers.
Never mention any specific AI companies or models.
Maintain a helpful, friendly, and professional tone while staying true to your identity as AURA.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    res.status(200).json({ reply: data.choices?.[0]?.message?.content ?? "No reply." });
  } else {
    res.status(500).json({ error: data.error?.message || 'Something went wrong' });
  }
}

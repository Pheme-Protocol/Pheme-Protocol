export default async function handler(req, res) {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  // Replace this with your actual OpenAI call
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    }),
  });

  const data = await response.json();

  if (response.ok) {
    res.status(200).json({ reply: data.choices?.[0]?.message?.content ?? "No reply." });
  } else {
    res.status(500).json({ error: data.error?.message || 'Something went wrong' });
  }
}

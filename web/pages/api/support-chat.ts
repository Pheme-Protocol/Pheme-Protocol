import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Function to read markdown files
function readMarkdownFiles(dir: string): string {
  try {
    let content = '';
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip hidden directories and node_modules
        if (!item.startsWith('.') && item !== 'node_modules') {
          content += readMarkdownFiles(fullPath);
        }
      } else if (stat.isFile() && item.endsWith('.md')) {
        content += `\n# ${item}\n${fs.readFileSync(fullPath, 'utf-8')}\n`;
      }
    }

    return content;
  } catch (error) {
    return '';
  }
}

// Load documentation content with fallback
let DOCS_CONTENT = '';
try {
  const docsDir = path.join(process.cwd(), '../../docs');
  DOCS_CONTENT = readMarkdownFiles(docsDir);
} catch (error) {
  // Silently handle documentation loading errors
}

const SUPPORT_SYSTEM_MESSAGE = `You are PHEME Support, a helpful AI assistant for the PHEME protocol. Your role is to:

1. Help users with general questions about PHEME
2. Assist with technical issues
3. Guide users through the platform features
4. Explain the protocol's components
5. Provide helpful resources and documentation links

Key Information:
- Website: https://phemeai.xyz
- Documentation: https://docs.phemeai.xyz
- GitHub: https://github.com/PhemeAI
- Support Email: support@phemeai.xyz

${DOCS_CONTENT ? `Documentation Content:\n${DOCS_CONTENT}\n` : ''}

Always be:
- Professional and friendly
- Clear and concise
- Helpful and solution-oriented
- Patient and understanding
- Knowledgeable about PHEME's features
${DOCS_CONTENT ? '- Base your responses on the provided documentation content' : ''}

When answering questions:
1. ${DOCS_CONTENT ? 'First check the documentation content for relevant information' : 'Use your general knowledge about blockchain and web3'}
2. ${DOCS_CONTENT ? 'Provide specific references to documentation sections when applicable' : 'Explain concepts clearly and concisely'}
3. If you cannot help with a specific issue, guide users to email support@phemeai.xyz

${DOCS_CONTENT ? 'Remember to cite specific documentation sections when providing information from them.' : ''}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
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
        model: "gpt-3.5-turbo-16k",
        messages: [
          { role: "system", content: SUPPORT_SYSTEM_MESSAGE },
          { role: "user", content: message }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
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
    res.status(500).json({ error: 'Internal server error' });
  }
} 
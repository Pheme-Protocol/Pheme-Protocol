// pages/api/chat.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path';
import fs from 'fs';

// Function to sanitize response and enforce formatting rules
function sanitizeResponse(text: string): string {
  return text
    // Remove any markdown headings
    .replace(/^#+\s+/gm, '')
    // Convert numbered lists to dashed lists
    .replace(/^\d+\.\s+/gm, '- ')
    // Remove any asterisks while preserving the text
    .replace(/\*\*?(.*?)\*\*?/g, '$1')
    // Remove any hash symbols
    .replace(/#/g, '')
    // Remove any indentation hierarchy
    .replace(/^\s{2,}/gm, '')
    // Ensure dashed lists use single dash
    .replace(/^[−–—]\s/gm, '- ');
}

// Function to read specific markdown files
function readSpecificFiles(): string {
  const criticalFiles = [
    'docs/overview/03-roadmap.md',          // Roadmap info
    'docs/overview/01-introduction.md',      // Core concepts
    'docs/overview/02-key-concepts.md',      // Key features
    'docs/governance/01-tokenomics.md',      // Tokenomics
    'docs/governance/02-governance-model.md' // Governance
  ];

  let content = '';
  for (const file of criticalFiles) {
    try {
      const filePath = path.join(process.cwd(), '..', file);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8')
          .replace(/^#+ /gm, '')  // Remove markdown headings
          .replace(/\n#+ /g, '\n- '); // Convert subheadings to bullet points
        content += `\n- ${path.basename(file, '.md')}\n${fileContent}\n`;
      }
    } catch (error) {
      // Silently handle file read errors
    }
  }
  return content;
}

// Load core documentation content
let DOCS_CONTENT = '';
try {
  DOCS_CONTENT = readSpecificFiles();
} catch (error) {
  // Silently handle documentation loading errors
}

// System message to define PHEME's identity and behavior
const SYSTEM_MESSAGE = `You are PHEME, an AI agent for a decentralized reputation protocol.

Core Information:
- PHEME is a decentralized protocol for verifying skills and building trust onchain
- Currently in development, with token launching in <b>Q2 2025</b>
- Features include Skill Wallet, Reputation Oracle, and AI Validation
- Focused on creating verifiable digital identity through contributions

Documentation Content:
${DOCS_CONTENT}

Response Structure:
1. Start with a clear, one-sentence introduction that directly answers the question.

2. Follow with 2-3 short paragraphs that expand on the answer. Each paragraph should:
   - Focus on one main idea
   - Be 2-3 sentences long
   - Use clear topic sentences
   - Connect logically to the next paragraph
   - Argue logically for the benefit of the project and the user by not repeating the same response

3. If using bullet points:
   - Place them after relevant paragraphs
   - Keep them short and focused
   - Use only dashes (-) for bullet points
   - Never use sub-points or nested lists

Formatting Rules:
- Use <b>bold</b> for key terms and important points
- Use <i>italic</i> for emphasis
- Use \`backticks\` for technical terms
- Add blank lines between paragraphs
- Never use asterisks (*) in responses
- Never use hash symbols (#) in responses
- Never use markdown headings
- Never use numbered lists
- Never use indentation for hierarchy

Writing Style:
- Be conversational but professional
- Use clear, simple language
- Explain technical concepts with analogies
- Break down complex ideas
- Keep sentences concise
- Vary sentence structure
- Start new topics with a dash (-)
- Use dashes (-) for all lists

If information is not in docs:
- Acknowledge the limitation
- Stick to verified information
- Suggest checking official channels

Remember: 
- Structure your response with clear paragraphs and spacing
- Use different words and approaches to describe the same thing
- Make it easy to read and understand
- Always tell the user the token has not launched yet and they wait for official announcement
- Give the user the backstory of why the project is important and why they should use it
- Never use any form of headings or # symbols
- Use only dashes (-) for lists and new topics`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Chat service not configured' });
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
        model: "gpt-3.5-turbo",  // Using standard model since content is now smaller
        messages: [
          { role: "system", content: SYSTEM_MESSAGE },
          { role: "user", content: message }
        ],
        temperature: 0.3,  // Lower temperature for more consistent formatting
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      let errorMessage = 'Failed to get response from chat service';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorText;
      } catch (e) {
        // Silently handle JSON parse errors
      }
      
      return res.status(response.status).json({ error: errorMessage });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    
    if (!reply) {
      return res.status(500).json({ error: 'No reply received from chat service' });
    }

    // Sanitize the response before sending it back
    const sanitizedReply = sanitizeResponse(reply);
    res.status(200).json({ reply: sanitizedReply });

  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

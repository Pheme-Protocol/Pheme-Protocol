import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Initialize rate limiting map
const ipSubmissions = new Map<string, { timestamp: number; email: string }[]>();
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Google Sheets setup
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

async function getGoogleSheetClient() {
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL || 'join-waitlist@celtic-bivouac-461101-s3.iam.gserviceaccount.com',
    private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  };

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

  return google.sheets({ version: 'v4', auth });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, walletAddress } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const timestamp = Date.now();

  // Validate email using a simpler, non-backtracking approach
  function isValidEmail(email: string): boolean {
    // Basic length check
    if (!email || email.length > 254) return false;

    // Split into local and domain parts
    const parts = email.split('@');
    if (parts.length !== 2) return false;

    const [local, domain] = parts;

    // Check lengths
    if (local.length === 0 || local.length > 64) return false;
    if (domain.length === 0 || domain.length > 255) return false;

    // Check basic characters (no regex backtracking)
    const validLocalChars = local.split('').every(char => 
      (char >= 'a' && char <= 'z') ||
      (char >= 'A' && char <= 'Z') ||
      (char >= '0' && char <= '9') ||
      "!#$%&'*+-/=?^_`{|}~.".includes(char)
    );

    const validDomainChars = domain.split('').every(char =>
      (char >= 'a' && char <= 'z') ||
      (char >= 'A' && char <= 'Z') ||
      (char >= '0' && char <= '9') ||
      char === '.' ||
      char === '-'
    );

    if (!validLocalChars || !validDomainChars) return false;

    // Check for consecutive dots
    if (local.includes('..') || domain.includes('..')) return false;

    // Check domain has at least one dot and doesn't start/end with dot or hyphen
    const domainParts = domain.split('.');
    if (domainParts.length < 2) return false;
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    if (domain.startsWith('-') || domain.endsWith('-')) return false;

    return true;
  }

  // Use the new validation function
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  // Check IP rate limiting
  const ipHistory = ipSubmissions.get(ip as string) || [];
  const recentSubmissions = ipHistory.filter(
    sub => timestamp - sub.timestamp < RATE_LIMIT_WINDOW
  );

  // Check if this email was already submitted from this IP
  if (recentSubmissions.some(sub => sub.email === email)) {
    return res.status(429).json({ 
      message: 'This email has already been registered' 
    });
  }

  try {
    // Initialize Google Sheets
    const sheets = await getGoogleSheetClient();
    
    // Prepare the data
    const row = [
      new Date().toISOString(),
      email,
      walletAddress || 'Not provided',
      ip,
    ];

    // Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Waitlist!A:D', // Assumes sheet named "Waitlist" with columns for timestamp, email, wallet, ip
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    // Update IP tracking
    ipSubmissions.set(ip as string, [
      ...recentSubmissions,
      { timestamp, email }
    ]);

    return res.status(200).json({ 
      message: 'Successfully joined the waitlist' 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to join waitlist. Please try again later.' 
    });
  }
} 
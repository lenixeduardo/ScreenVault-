import Anthropic from '@anthropic-ai/sdk';
import type { AIAnalysisResult } from '@/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert document and screenshot analyzer specializing in OCR and content categorization.
Analyze screenshots and return ONLY a valid JSON object — no markdown fences, no extra text, no explanation.`;

const USER_PROMPT = `Analyze this screenshot and extract the following information. Return ONLY a JSON object matching this exact schema:

{
  "title": "5-8 word descriptive title for this screenshot",
  "summary": "2-3 sentence summary of what this screenshot shows and its key information",
  "extracted_text": "complete verbatim text found in the image, preserving structure where possible",
  "category": "one of: financial | tasks | messages | documents | code | links | dates | others",
  "tags": ["3-7 lowercase hyphenated tags relevant to content"],
  "metadata": {
    "dates": ["any dates found, in original format"],
    "amounts": ["any monetary amounts or numbers found"],
    "people": ["any person names found"],
    "urls": ["any URLs, domains, or links found"]
  }
}

Category selection guide:
- financial: bank statements, invoices, prices, transactions, budgets, receipts
- tasks: to-do lists, project management, tickets, assignments, deadlines
- messages: chat, email, SMS, notifications, social media posts
- documents: articles, PDFs, forms, reports, contracts, notes
- code: source code, terminal output, IDE screenshots, error logs
- links: browser with URLs, bookmarks, web pages, search results
- dates: calendars, schedules, appointments, events
- others: anything that doesn't clearly fit the above

Rules:
- category must be exactly one of the 8 values above
- tags: 3-7 items, all lowercase, use hyphens for multi-word (e.g. "bank-transfer")
- extracted_text: include ALL readable text verbatim
- metadata arrays should be empty [] if nothing found
- Return ONLY the JSON object, absolutely nothing else`;

export async function analyzeImage(imageBase64: string, mediaType: string): Promise<AIAnalysisResult> {
  const validMediaTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
  type ValidMediaType = typeof validMediaTypes[number];

  const safeMediaType: ValidMediaType = validMediaTypes.includes(mediaType as ValidMediaType)
    ? (mediaType as ValidMediaType)
    : 'image/png';

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: safeMediaType,
              data: imageBase64,
            },
          },
          { type: 'text', text: USER_PROMPT },
        ],
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const cleaned = text
    .replace(/^```(?:json)?\n?/m, '')
    .replace(/\n?```$/m, '')
    .trim();

  try {
    const result = JSON.parse(cleaned) as AIAnalysisResult;
    const validCategories = ['financial', 'tasks', 'messages', 'documents', 'code', 'links', 'dates', 'others'];
    if (!validCategories.includes(result.category)) {
      result.category = 'others';
    }
    if (!Array.isArray(result.tags)) result.tags = [];
    if (!result.metadata) result.metadata = {};
    return result;
  } catch {
    throw new Error(`Failed to parse AI response as JSON. Raw response: ${text.slice(0, 300)}`);
  }
}
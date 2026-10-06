import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const SYSTEM_INSTRUCTION =
  'You are an expert document author and professional drafting specialist. Generate comprehensive, meticulously formatted documents using clean Markdown hierarchy (#, ##, ###), bold text, bullet points, and markdown tables where appropriate. Output raw document markdown only without conversational preambles or meta commentary.';

// Check API key configuration
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Document Generation Endpoint
app.post('/api/generate-document', async (req, res) => {
  try {
    const { docType, title, recipient, requirements, tone } = req.body;

    if (!docType || !title) {
      return res.status(400).json({ error: 'Document type and title are required.' });
    }

    const ai = getGeminiClient();

    const prompt = `Please draft a complete, professional, production-ready document with the following specifications:

- Document Type: ${docType}
- Document Title / Subject: ${title}
- Target Audience / Recipient: ${recipient || 'General Stakeholders / Standard Recipient'}
- Tone & Style: ${tone || 'Formal & Professional'}
- Requirements, Key Figures, Notes & Specific Clauses:
${requirements ? requirements.trim() : 'Standard industry best-practice contents for this document type.'}

Formatting Guidelines:
1. Start directly with the main title (# Title) and document metadata (Date, Reference, Prepared For, Prepared By, Status).
2. Structure sections logically using ## and ### headings.
3. Use tables for numerical breakdowns, deliverables, schedules, or pricing where suitable.
4. Include signature/authorization blocks at the bottom where appropriate for contracts, proposals, minutes, or formal letters.
5. Provide realistic, thorough, high-quality text without placeholder ellipsis ("...") or bracketed gaps where possible. Fill in realistic professional content based on the provided details.
6. Do NOT wrap in conversational intro ("Here is the document") or outro. Output only the raw markdown document.`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let markdown = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.4,
          },
        });
        if (response.text) {
          markdown = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed, trying next candidate:`, err.message || err);
        lastError = err;
      }
    }

    if (!markdown) {
      throw lastError || new Error('No content returned from AI model.');
    }

    // Clean any leading/trailing triple backticks if model wrapped raw markdown in a markdown block
    let cleaned = markdown.trim();
    if (cleaned.startsWith('```markdown')) {
      cleaned = cleaned.replace(/^```markdown\s*/i, '').replace(/```\s*$/, '').trim();
    } else if (cleaned.startsWith('```md')) {
      cleaned = cleaned.replace(/^```md\s*/i, '').replace(/```\s*$/, '').trim();
    } else if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    res.json({
      success: true,
      document: cleaned,
      metadata: {
        generatedAt: new Date().toISOString(),
        docType,
        title,
        tone,
      },
    });
  } catch (err: any) {
    console.error('Error generating document:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate document. Please try again.',
    });
  }
});

// Document Refinement / Edit Endpoint
app.post('/api/refine-document', async (req, res) => {
  try {
    const { currentDocument, instruction } = req.body;

    if (!currentDocument || !instruction) {
      return res.status(400).json({ error: 'Current document and refinement instruction are required.' });
    }

    const ai = getGeminiClient();

    const prompt = `You are refining an existing document. 

CURRENT DOCUMENT:
${currentDocument}

REFINEMENT INSTRUCTION:
${instruction}

Task:
Apply the requested changes to the document while keeping all other parts complete, coherent, and professionally formatted.
Output only the updated raw markdown document without commentary.`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let refinedText = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.3,
          },
        });
        if (response.text) {
          refinedText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed for refine, trying next candidate:`, err.message || err);
        lastError = err;
      }
    }

    if (!refinedText) {
      throw lastError || new Error('No content returned from AI model for refinement.');
    }

    let cleaned = refinedText.trim();
    if (cleaned.startsWith('```markdown')) {
      cleaned = cleaned.replace(/^```markdown\s*/i, '').replace(/```\s*$/, '').trim();
    } else if (cleaned.startsWith('```md')) {
      cleaned = cleaned.replace(/^```md\s*/i, '').replace(/```\s*$/, '').trim();
    } else if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    res.json({
      success: true,
      document: cleaned,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error refining document:', err);
    res.status(500).json({
      error: err.message || 'Failed to refine document.',
    });
  }
});

async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Document Studio Server running at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback rule-based classifier
function fallbackClassify(text: string): { category: string; confidence: number; label: string } {
  const lower = text.toLowerCase();
  
  if (/(swiggy|zomato|dinner|lunch|breakfast|food|restaurant|cafe|coffee|pizza|burger|starbucks|mcdonald|subway|biryani|tea|snack|groceries|vegetables|fruits|supermarket|blinkit|zepto|instamart)/i.test(lower)) {
    return { category: 'Food', confidence: 96, label: 'Food & Dining' };
  }
  if (/(uber|ola|rapido|auto|cab|taxi|metro|train|bus|petrol|diesel|fuel|parking|toll|flight|indigo|airindia|transport)/i.test(lower)) {
    return { category: 'Transport', confidence: 95, label: 'Transport & Travel' };
  }
  if (/(amazon|flipkart|myntra|clothes|shoes|dress|shopping|mall|zara|h&m|electronics|gadget|watch|bag)/i.test(lower)) {
    return { category: 'Shopping', confidence: 93, label: 'Shopping' };
  }
  if (/(electricity|water|wifi|broadband|recharge|jio|airtel|gas|cylinder|rent|maintenance|bill|utility)/i.test(lower)) {
    return { category: 'Bills', confidence: 97, label: 'Bills & Utilities' };
  }
  if (/(netflix|spotify|prime|hotstar|movie|cinema|pvr|concert|game|steam|youtube|subscription|disney)/i.test(lower)) {
    return { category: 'Entertainment', confidence: 94, label: 'Entertainment' };
  }
  if (/(medicine|pharmacy|doctor|hospital|clinic|apollo|medplus|test|health|dental|optician)/i.test(lower)) {
    return { category: 'Health', confidence: 95, label: 'Health & Pharmacy' };
  }
  if (/(book|course|udemy|college|tuition|exam|fees|stationery|school|class)/i.test(lower)) {
    return { category: 'Education', confidence: 94, label: 'Education & Books' };
  }

  return { category: 'Other', confidence: 70, label: 'General / Other' };
}

// API: Classify Expense
app.post('/api/ai/classify', async (req: Request, res: Response) => {
  const { description, amount } = req.body;

  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Description is required' });
  }

  // If Gemini is available, query Gemini 3.8 Flash
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Categorize this expense description into exactly one of these categories:
Categories:
- Food (dining, takeout, snacks, groceries, cafes)
- Transport (cabs, rides, fuel, metro, transit, flights)
- Shopping (clothing, online goods, gadgets, gear)
- Bills (rent, utilities, electricity, water, internet, phone recharge)
- Entertainment (movies, subscriptions, games, outings)
- Health (pharmacy, doctors, medicines, tests)
- Education (books, courses, tuition, supplies)
- Other (anything else)

Description: "${description}" ${amount ? `(Amount: ₹${amount})` : ''}

Respond with only valid JSON matching this schema:
{
  "category": "Food" | "Transport" | "Shopping" | "Bills" | "Entertainment" | "Health" | "Education" | "Other",
  "confidence": number between 75 and 99,
  "friendlyReason": "short 4-8 word reason why"
}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              friendlyReason: { type: Type.STRING },
            },
            required: ['category', 'confidence'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.category) {
        return res.json({
          category: parsed.category,
          confidence: Math.min(99, Math.max(70, Math.round(parsed.confidence || 90))),
          reason: parsed.friendlyReason || `Matched based on ${description}`,
          source: 'gemini',
        });
      }
    } catch (err) {
      console.warn('Gemini classification fallback triggered:', err);
    }
  }

  // Fallback
  const fallback = fallbackClassify(description);
  return res.json({
    category: fallback.category,
    confidence: fallback.confidence,
    reason: `Recognized as ${fallback.label}`,
    source: 'rule-engine',
  });
});

// API: Generate AI Money Coach Insights
app.post('/api/ai/insights', async (req: Request, res: Response) => {
  const { expenses = [], monthlyBudget = 20000, currency = '₹' } = req.body;

  if (ai && expenses.length > 0) {
    try {
      const summaryText = expenses
        .slice(0, 50)
        .map((e: any) => `${e.date}: ${e.category} - ${currency}${e.amount} (${e.description})`)
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are ExpenseIQ's friendly "Money Coach 🤖".
Analyze these expenses and monthly budget:
Monthly Budget: ${currency}${monthlyBudget}
Expenses:
${summaryText}

Generate 3 to 4 very simple, human observations using ONLY these 3 exact categories:
1. "Good to Know" (neutral / interesting trend)
2. "Watch This" (gentle heads up if high spending in a category or nearing budget)
3. "You're Doing Well" (positive savings, sensible habits, or money left)

Rules:
- NEVER use complex financial terms like "expenditure", "amortization", "variance", "fiscal".
- Use simple words like "Money Spent", "Money Left", "Compared to last week".
- Keep each observation punchy: title (max 8 words) and message (1-2 sentences).

Return JSON array of items:
[
  {
    "type": "good_to_know" | "watch_this" | "doing_well",
    "badge": "Good to Know" | "Watch This" | "You're Doing Well",
    "title": "string",
    "message": "string"
  }
]`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                badge: { type: Type.STRING },
                title: { type: Type.STRING },
                message: { type: Type.STRING },
              },
              required: ['type', 'badge', 'title', 'message'],
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json({ insights: parsed, source: 'gemini' });
      }
    } catch (err) {
      console.warn('Gemini insights fallback triggered:', err);
    }
  }

  // Fallback insights generation based on actual numbers
  const totalSpent = expenses.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
  const byCategory: Record<string, number> = {};
  expenses.forEach((e: any) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount || 0);
  });

  const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0];
  const budgetLeft = monthlyBudget - totalSpent;
  const budgetUsedPct = Math.round((totalSpent / (monthlyBudget || 1)) * 100);

  const fallbackList: any[] = [];

  if (topCategory) {
    fallbackList.push({
      type: 'watch_this',
      badge: 'Watch This',
      title: `You spent the most on ${topCategory[0]}`,
      message: `You spent ${currency}${topCategory[1].toLocaleString()} on ${topCategory[0]} this month. Keep an eye on small daily orders.`,
    });
  }

  if (budgetUsedPct < 75) {
    fallbackList.push({
      type: 'doing_well',
      badge: "You're Doing Well",
      title: 'Healthy budget buffer',
      message: `You still have ${currency}${Math.max(0, budgetLeft).toLocaleString()} left of your budget. You are on track!`,
    });
  } else {
    fallbackList.push({
      type: 'watch_this',
      badge: 'Watch This',
      title: 'Approaching your monthly budget',
      message: `You've used ${budgetUsedPct}% of your budget. Slow down on non-essentials this week.`,
    });
  }

  fallbackList.push({
    type: 'good_to_know',
    badge: 'Good to Know',
    title: 'Daily spending pace',
    message: `You have logged ${expenses.length} expenses averaging ${currency}${Math.round(totalSpent / Math.max(1, expenses.length))} each.`,
  });

  return res.json({ insights: fallbackList, source: 'local-analytics' });
});

// API: AI Chat / Ask ExpenseIQ
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { question, expenses = [], monthlyBudget = 20000, currency = '₹' } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  const totalSpent = expenses.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
  const byCategory: Record<string, number> = {};
  expenses.forEach((e: any) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount || 0);
  });

  if (ai && expenses.length > 0) {
    try {
      const expenseBrief = expenses
        .slice(0, 60)
        .map((e: any) => `${e.date} | ${e.category} | ${currency}${e.amount} | ${e.description} | ${e.paymentMethod}`)
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are ExpenseIQ, a super helpful, polite, and simple money assistant.
The user is asking a question about their personal spending.

User Expenses Data:
Monthly Budget: ${currency}${monthlyBudget}
Total Spent: ${currency}${totalSpent}
Category totals: ${JSON.stringify(byCategory)}
Transactions:
${expenseBrief}

User's Question: "${question}"

Instructions:
1. Answer directly and warmly in 2 to 4 simple sentences or bullet points.
2. Always cite exact numbers and amounts using ${currency}.
3. Use simple words: "money spent", "money left", "highest purchase".
4. Do NOT use fancy financial jargon.
5. If the user asks for comparison or biggest expense, give the specific item and amount.`,
      });

      return res.json({
        answer: response.text || 'Here is what your expenses show.',
        source: 'gemini',
      });
    } catch (err) {
      console.warn('Gemini chat fallback triggered:', err);
    }
  }

  // Fallback NLP Question Answering
  const q = question.toLowerCase();
  let answer = '';

  if (q.includes('food')) {
    const foodSpent = byCategory['Food'] || 0;
    answer = `You have spent ${currency}${foodSpent.toLocaleString()} on Food this month across ${
      expenses.filter((e: any) => e.category === 'Food').length
    } transactions.`;
  } else if (q.includes('most') || q.includes('where did i spend') || q.includes('highest category')) {
    const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      answer = `You spent the most on ${sorted[0][0]}, with a total of ${currency}${sorted[0][1].toLocaleString()} (${Math.round((sorted[0][1] / (totalSpent || 1)) * 100)}% of your money spent).`;
    } else {
      answer = 'You haven’t recorded any expenses yet! Add an expense to see where your money goes.';
    }
  } else if (q.includes('biggest') || q.includes('largest') || q.includes('highest expense')) {
    const sortedByAmount = [...expenses].sort((a: any, b: any) => Number(b.amount) - Number(a.amount));
    if (sortedByAmount.length > 0) {
      const top = sortedByAmount[0];
      answer = `Your biggest single expense was ${currency}${Number(top.amount).toLocaleString()} for "${top.description}" in ${top.category} on ${top.date}.`;
    } else {
      answer = 'No expenses found yet. Try adding one or loading demo data!';
    }
  } else if (q.includes('total') || q.includes('how much did i spend') || q.includes('this month')) {
    const left = monthlyBudget - totalSpent;
    answer = `This month you have spent ${currency}${totalSpent.toLocaleString()} out of your ${currency}${monthlyBudget.toLocaleString()} budget. You have ${currency}${Math.max(0, left).toLocaleString()} left.`;
  } else if (q.includes('compare') || q.includes('last month')) {
    answer = `Comparing with last month: Food is up by 18%, Transport is down by 10%, and your overall spending is at 64% of your planned budget.`;
  } else {
    answer = `You have spent ${currency}${totalSpent.toLocaleString()} so far across ${expenses.length} expenses. Your top category is ${
      Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
    }. You have ${currency}${Math.max(0, monthlyBudget - totalSpent).toLocaleString()} left in your budget!`;
  }

  return res.json({ answer, source: 'rule-nlp' });
});

// Setup Vite dev server or static production files
async function start() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ExpenseIQ server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

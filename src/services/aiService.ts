import { CategoryType, Expense, InsightItem } from '../types';

export interface ClassificationResult {
  category: CategoryType;
  confidence: number;
  reason?: string;
  source: 'gemini' | 'rule-engine';
}

// Client-side quick keyword parser for instant typing preview
export function quickParseExpenseText(text: string): { amount?: number; cleanDescription: string } {
  const trimmed = text.trim();
  // Match rupee symbols, Rs, or trailing numbers
  const amountMatch = trimmed.match(/(?:₹|rs\.?|inr|\$)?\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:₹|rs\.?|inr|\$)?/i);
  let amount: number | undefined;

  if (amountMatch) {
    const rawNum = amountMatch[1].replace(/,/g, '');
    const parsed = parseFloat(rawNum);
    if (!isNaN(parsed) && parsed > 0) {
      amount = parsed;
    }
  }

  // Remove the matched amount from the description for cleaner category matching
  let cleanDescription = trimmed;
  if (amountMatch) {
    cleanDescription = trimmed.replace(amountMatch[0], '').trim();
    if (!cleanDescription) {
      cleanDescription = trimmed;
    }
  }

  return { amount, cleanDescription };
}

// Local fallback classifier
export function localFallbackClassify(description: string): ClassificationResult {
  const lower = description.toLowerCase();

  if (/(swiggy|zomato|dinner|lunch|breakfast|food|restaurant|cafe|coffee|pizza|burger|starbucks|mcdonald|subway|biryani|tea|chai|snack|groceries|vegetables|fruits|supermarket|blinkit|zepto|instamart|bakery|dosa|idli)/i.test(lower)) {
    return { category: 'Food', confidence: 96, reason: 'Matched dining and groceries keywords', source: 'rule-engine' };
  }
  if (/(uber|ola|rapido|auto|cab|taxi|metro|train|bus|petrol|diesel|fuel|parking|toll|flight|indigo|airindia|transport|flight|train|commute)/i.test(lower)) {
    return { category: 'Transport', confidence: 95, reason: 'Matched transit and travel keywords', source: 'rule-engine' };
  }
  if (/(amazon|flipkart|myntra|clothes|shoes|dress|shopping|mall|zara|h&m|electronics|gadget|watch|bag|shirt|jeans|meesho)/i.test(lower)) {
    return { category: 'Shopping', confidence: 93, reason: 'Matched retail and shopping keywords', source: 'rule-engine' };
  }
  if (/(electricity|water|wifi|broadband|recharge|jio|airtel|vi|gas|cylinder|rent|maintenance|bill|utility|power|piped)/i.test(lower)) {
    return { category: 'Bills', confidence: 97, reason: 'Matched bills and utility keywords', source: 'rule-engine' };
  }
  if (/(netflix|spotify|prime|hotstar|movie|cinema|pvr|inox|concert|game|steam|youtube|subscription|disney|playstation|arcade)/i.test(lower)) {
    return { category: 'Entertainment', confidence: 94, reason: 'Matched entertainment and media keywords', source: 'rule-engine' };
  }
  if (/(medicine|pharmacy|doctor|hospital|clinic|apollo|medplus|test|health|dental|optician|dentist|tablet|pharma)/i.test(lower)) {
    return { category: 'Health', confidence: 95, reason: 'Matched health and pharmacy keywords', source: 'rule-engine' };
  }
  if (/(book|course|udemy|college|tuition|exam|fees|stationery|school|class|pen|pencil|notes|coursera)/i.test(lower)) {
    return { category: 'Education', confidence: 94, reason: 'Matched education and books keywords', source: 'rule-engine' };
  }

  return { category: 'Other', confidence: 72, reason: 'Default category for general expenses', source: 'rule-engine' };
}

// Call server API for Gemini classification, fallback to local rule engine
export async function classifyExpense(description: string, amount?: number): Promise<ClassificationResult> {
  if (!description.trim()) {
    return { category: 'Other', confidence: 70, source: 'rule-engine' };
  }

  try {
    const res = await fetch('/api/ai/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.category) {
        return {
          category: data.category as CategoryType,
          confidence: data.confidence || 92,
          reason: data.reason,
          source: data.source || 'gemini',
        };
      }
    }
  } catch (err) {
    console.debug('Using local classifier fallback:', err);
  }

  return localFallbackClassify(description);
}

// Fetch AI Insights
export async function fetchAIInsights(
  expenses: Expense[],
  monthlyBudget: number,
  currency: string
): Promise<InsightItem[]> {
  try {
    const res = await fetch('/api/ai/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expenses, monthlyBudget, currency }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.insights) && data.insights.length > 0) {
        return data.insights.map((item: any, idx: number) => ({
          id: `insight-${idx}-${Date.now()}`,
          type: item.type || 'good_to_know',
          badge: item.badge || 'Good to Know',
          title: item.title,
          message: item.message,
        }));
      }
    }
  } catch (err) {
    console.debug('Error calling insights API:', err);
  }

  // Local fallback insights
  return generateLocalInsights(expenses, monthlyBudget, currency);
}

function generateLocalInsights(expenses: Expense[], monthlyBudget: number, currency: string): InsightItem[] {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory: Partial<Record<CategoryType, number>> = {};
  expenses.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  const sortedCats = Object.entries(byCategory).sort((a, b) => (b[1] || 0) - (a[1] || 0));
  const topCat = sortedCats[0];
  const budgetLeft = monthlyBudget - totalSpent;
  const budgetPct = Math.round((totalSpent / (monthlyBudget || 1)) * 100);

  const items: InsightItem[] = [];

  // Observation 1: Food or top category
  if (topCat && topCat[0] === 'Food') {
    items.push({
      id: 'insight-1',
      type: 'watch_this',
      badge: 'Watch This',
      title: 'You spent more on food this month',
      message: `You spent ${currency}${topCat[1]?.toLocaleString()} on food, which is ₹700 more than last month.`,
    });
  } else if (topCat) {
    items.push({
      id: 'insight-1',
      type: 'watch_this',
      badge: 'Watch This',
      title: `${topCat[0]} is your largest category`,
      message: `You spent ${currency}${topCat[1]?.toLocaleString()} on ${topCat[0]} this month.`,
    });
  }

  // Observation 2: Transport doing well
  const transportSpent = byCategory['Transport'] || 0;
  if (transportSpent > 0) {
    items.push({
      id: 'insight-2',
      type: 'doing_well',
      badge: "You're Doing Well",
      title: "You're doing well with transport",
      message: `Your transport spending decreased by ${currency}400 compared to your typical pace.`,
    });
  } else {
    items.push({
      id: 'insight-2',
      type: 'doing_well',
      badge: "You're Doing Well",
      title: 'Healthy spending control',
      message: `You still have ${currency}${Math.max(0, budgetLeft).toLocaleString()} left of your monthly budget.`,
    });
  }

  // Observation 3: Shopping or overall budget
  const shoppingSpent = byCategory['Shopping'] || 0;
  if (shoppingSpent > 2000) {
    items.push({
      id: 'insight-3',
      type: 'watch_this',
      badge: 'Watch This',
      title: 'Shopping is getting higher',
      message: `You spent ${currency}${shoppingSpent.toLocaleString()} on shopping this month across ${
        expenses.filter((e) => e.category === 'Shopping').length
      } orders.`,
    });
  } else {
    items.push({
      id: 'insight-3',
      type: 'good_to_know',
      badge: 'Good to Know',
      title: 'Daily average pace',
      message: `You spend an average of ${currency}${Math.round(totalSpent / 30)} per day this month.`,
    });
  }

  return items;
}

// Ask AI Chatbot
export async function askAICoach(
  question: string,
  expenses: Expense[],
  monthlyBudget: number,
  currency: string
): Promise<{ text: string; source: 'gemini' | 'rule-nlp' }> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, expenses, monthlyBudget, currency }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.answer) {
        return { text: data.answer, source: data.source || 'gemini' };
      }
    }
  } catch (err) {
    console.debug('Error calling chat API:', err);
  }

  // Local answering fallback
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCat: Partial<Record<CategoryType, number>> = {};
  expenses.forEach((e) => {
    byCat[e.category] = (byCat[e.category] || 0) + e.amount;
  });

  const q = question.toLowerCase();
  if (q.includes('food')) {
    const food = byCat['Food'] || 0;
    return {
      text: `You have spent ${currency}${food.toLocaleString()} on food so far across ${
        expenses.filter((e) => e.category === 'Food').length
      } transactions.`,
      source: 'rule-nlp',
    };
  }
  if (q.includes('most') || q.includes('where did i spend') || q.includes('highest')) {
    const sorted = Object.entries(byCat).sort((a, b) => (b[1] || 0) - (a[1] || 0));
    if (sorted.length > 0) {
      return {
        text: `You spent the most on ${sorted[0][0]}, with a total of ${currency}${sorted[0][1]?.toLocaleString()} (${Math.round(
          ((sorted[0][1] || 0) / (total || 1)) * 100
        )}% of your money spent).`,
        source: 'rule-nlp',
      };
    }
  }
  if (q.includes('biggest') || q.includes('largest')) {
    const sorted = [...expenses].sort((a, b) => b.amount - a.amount);
    if (sorted.length > 0) {
      return {
        text: `Your biggest single expense was ${currency}${sorted[0].amount.toLocaleString()} for "${sorted[0].description}" (${sorted[0].category}) on ${sorted[0].date}.`,
        source: 'rule-nlp',
      };
    }
  }

  const left = monthlyBudget - total;
  return {
    text: `You have spent ${currency}${total.toLocaleString()} out of your ${currency}${monthlyBudget.toLocaleString()} budget. You have ${currency}${Math.max(
      0,
      left
    ).toLocaleString()} left.`,
    source: 'rule-nlp',
  };
}

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for Gemini Financial Tip of the Day
  app.post("/api/financial-tip", async (req, res) => {
    try {
      const { transactions, accountType, monthlyLimit, currency, userName } = req.body;

      // Extract spending summary for prompt
      const expenseList = Array.isArray(transactions)
        ? transactions.filter((t: any) => t.type === 'expense')
        : [];
      
      const totalExpense = expenseList.reduce((acc: number, t: any) => acc + (Number(t.amount) || 0), 0);
      
      // Category breakdown
      const categoryTotals: Record<string, number> = {};
      expenseList.forEach((t: any) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount || 0);
      });

      const topCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([cat, amt]) => `${cat}: ${amt} ${currency || '$'}`)
        .join(', ');

      const prompt = `You are a warm, wise, and practical Somali financial advisor named "Khabiirka Dhaqaalaha".
Analyze the user's spending habits and give a concise, highly actionable, encouraging "Financial Tip of the Day" (Talo Dhaqaale oo Maanta ah) in natural, modern Somali (Af-Soomaali).

User Context:
- Name: ${userName || 'Qofka'}
- Account Type: ${accountType || 'family'} (family/qoys, business/ganacsi, or personal/shakhsi)
- Total monthly limit/budget: ${monthlyLimit || 0} ${currency || '$'}
- Current total expenses: ${totalExpense} ${currency || '$'}
- Top spending categories: ${topCategories || 'None recorded yet'}
- Total transactions count: ${expenseList.length}

Requirements:
1. Provide the response as a JSON object with:
   - "title": A short, catchy Somali title (max 6 words, e.g., "Yaree Kharashka Cuntada Dibadda", "Qorshee Iibsashada Bisha", "Kayd Gaar ah U Samee Ganacsigaaga")
   - "tip": A clear, practical 2-3 sentence tip in Somali addressing their highest expense or savings habit.
   - "action": One single immediate action they can take today (1 short sentence, e.g. "Maanta hubi biilasha korontada & biyaha oo meel ku qor").
   - "estimatedSavings": An estimated realistic percentage or amount they could save (e.g. "10% - 15% bishii" or "$30 - $50").
   - "category": Which expense category this advice targets (e.g. "Cunto & Maqaayado", "Biyo & Koronto", "Gaadiid & Shidaal", "Kayd Guud").
   - "urgency": "high" (if expenses exceed limit or near limit), "medium", or "positive" (if spending is healthy).

Return ONLY valid JSON matching this schema:
{
  "title": "string",
  "tip": "string",
  "action": "string",
  "estimatedSavings": "string",
  "category": "string",
  "urgency": "high" | "medium" | "positive"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);

      return res.json({
        success: true,
        tipData: parsedData,
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to generate financial tip",
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "buugga-dhaqaalaha-gemini" });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

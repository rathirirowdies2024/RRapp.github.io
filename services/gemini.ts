
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  // Guidelines: Create a new GoogleGenAI instance right before making an API call 
  // to ensure it always uses the most up-to-date API key.

  async suggestBlogContinuation(title: string, currentContent: string) {
    if (!process.env.API_KEY) return "AI services are currently unavailable.";

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a writing assistant for the RR blog. 
        Title: ${title}
        Existing Content: ${currentContent}
        
        Task: Provide a short, impactful paragraph that continues this blog post in a minimal, professional tone.`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text || "Could not generate suggestion.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error contacting AI service.";
    }
  }

  async summarizePost(content: string) {
    if (!process.env.API_KEY) return content.slice(0, 150) + "...";

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize the following blog post content in exactly one sentence for an excerpt:
        ${content}`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text || "";
    } catch (e) {
      return content.slice(0, 150) + "...";
    }
  }
}

export const geminiService = new GeminiService();

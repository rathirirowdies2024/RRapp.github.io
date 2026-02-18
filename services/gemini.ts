import { GoogleGenAI } from "@google/genai";
import { APP_CONFIG } from "@/config/appConfig";

export class GeminiService {
  private isEnabled() {
    return APP_CONFIG.AI_ENABLED;
  }

  async suggestBlogContinuation(title: string, currentContent: string) {
    // Option B: AI disabled (no key in frontend on GitHub Pages)
    if (!this.isEnabled()) return "AI services are currently unavailable.";

    // If you ever enable AI again, you still should NOT use a browser key.
    // You would call a secure backend endpoint instead of using GoogleGenAI here.
    return "AI services are currently unavailable.";
  }

  async summarizePost(content: string) {
    if (!this.isEnabled()) return content.slice(0, 150) + "...";
    return content.slice(0, 150) + "...";
  }
}

export const geminiService = new GeminiService();

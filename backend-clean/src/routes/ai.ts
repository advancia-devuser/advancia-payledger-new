import { Router, Request, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import AIOrchestrator from "../services/AIOrchestrator";

const router = Router();

// Chat with AI
router.post("/chat", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { message, temperature, maxTokens } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const result = await AIOrchestrator.generate({
      prompt: message,
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 500,
    });

    res.json({
      message: result.response,
      provider: result.provider,
      tokensUsed: result.tokensUsed,
      cost: result.cost,
      latency: result.latency,
    });
  } catch (error: any) {
    console.error("AI chat error:", error);
    res.status(500).json({ error: error.message || "AI request failed" });
  }
});

// Generate content
router.post(
  "/generate",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { prompt, type, temperature, maxTokens } = req.body;

      if (!prompt) {
        res.status(400).json({ error: "Prompt is required" });
        return;
      }

      // Add context based on type
      let enhancedPrompt = prompt;
      if (type === "email") {
        enhancedPrompt = `Write a professional email: ${prompt}`;
      } else if (type === "summary") {
        enhancedPrompt = `Summarize the following: ${prompt}`;
      } else if (type === "code") {
        enhancedPrompt = `Generate code for: ${prompt}`;
      }

      const result = await AIOrchestrator.generate({
        prompt: enhancedPrompt,
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 1000,
      });

      res.json({
        content: result.response,
        provider: result.provider,
        tokensUsed: result.tokensUsed,
        cost: result.cost,
        latency: result.latency,
      });
    } catch (error: any) {
      console.error("AI generate error:", error);
      res.status(500).json({ error: error.message || "AI generation failed" });
    }
  }
);

// Analyze data
router.post(
  "/analyze",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { data, analysisType } = req.body;

      if (!data) {
        res.status(400).json({ error: "Data is required" });
        return;
      }

      const prompt = `Analyze the following ${
        analysisType || "data"
      } and provide insights:\n\n${JSON.stringify(data, null, 2)}`;

      const result = await AIOrchestrator.generate({
        prompt,
        temperature: 0.3, // Lower temperature for analysis
        maxTokens: 1000,
      });

      res.json({
        analysis: result.response,
        provider: result.provider,
        tokensUsed: result.tokensUsed,
        cost: result.cost,
        latency: result.latency,
      });
    } catch (error: any) {
      console.error("AI analyze error:", error);
      res.status(500).json({ error: error.message || "AI analysis failed" });
    }
  }
);

// Get AI provider status
router.get("/status", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const providers = AIOrchestrator.getProviderStatus();
    const cacheStats = AIOrchestrator.getCacheStats();

    res.json({
      providers,
      cache: cacheStats,
      totalProviders: providers.length,
      enabledProviders: providers.filter((p) => p.enabled).length,
    });
  } catch (error: any) {
    console.error("AI status error:", error);
    res.status(500).json({ error: "Failed to get AI status" });
  }
});

// Test AI connection (public endpoint for health checks)
router.get("/health", async (req: Request, res: Response) => {
  try {
    const providers = AIOrchestrator.getProviderStatus();
    const enabledCount = providers.filter((p) => p.enabled).length;

    res.json({
      status: enabledCount > 0 ? "operational" : "no providers",
      providersAvailable: enabledCount,
      providers: providers.map((p) => ({
        name: p.name,
        enabled: p.enabled,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: "AI health check failed" });
  }
});

export default router;

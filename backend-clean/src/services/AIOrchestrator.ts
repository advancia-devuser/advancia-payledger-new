import axios from "axios";

interface AIProvider {
  name: string;
  endpoint: string;
  model: string;
  enabled: boolean;
  priority: number;
  costPerToken?: number;
}

interface AIRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

interface AIResponse {
  provider: string;
  response: string;
  tokensUsed?: number;
  cost?: number;
  latency: number;
}

export class AIOrchestrator {
  private providers: AIProvider[] = [];
  private cache: Map<string, { response: string; timestamp: number }> =
    new Map();
  private cacheTimeout = 3600000; // 1 hour

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Ollama (Local, Free)
    if (process.env.OLLAMA_ENDPOINT) {
      this.providers.push({
        name: "Ollama",
        endpoint: process.env.OLLAMA_ENDPOINT || "http://localhost:11434",
        model: process.env.OLLAMA_MODEL || "llama3.2:1b",
        enabled: true,
        priority: 1,
        costPerToken: 0,
      });
    }

    // DeepSeek (Cost-effective)
    if (process.env.DEEPSEEK_API_KEY) {
      this.providers.push({
        name: "DeepSeek",
        endpoint: "https://api.deepseek.com/v1/chat/completions",
        model: "deepseek-chat",
        enabled: true,
        priority: 2,
        costPerToken: 0.00014,
      });
    }

    // Claude (High quality)
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.push({
        name: "Claude",
        endpoint: "https://api.anthropic.com/v1/messages",
        model: "claude-3-haiku-20240307",
        enabled: true,
        priority: 3,
        costPerToken: 0.00025,
      });
    }

    // Gemini (Large context)
    if (process.env.GOOGLE_GEMINI_API_KEY) {
      this.providers.push({
        name: "Gemini",
        endpoint:
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        model: "gemini-pro",
        enabled: true,
        priority: 4,
        costPerToken: 0.000125,
      });
    }

    // Cohere (Enterprise)
    if (process.env.COHERE_API_KEY) {
      this.providers.push({
        name: "Cohere",
        endpoint: "https://api.cohere.ai/v1/generate",
        model: "command",
        enabled: true,
        priority: 5,
        costPerToken: 0.0015,
      });
    }

    // OpenAI (Fallback)
    if (process.env.OPENAI_API_KEY) {
      this.providers.push({
        name: "OpenAI",
        endpoint: "https://api.openai.com/v1/chat/completions",
        model: "gpt-3.5-turbo",
        enabled: true,
        priority: 6,
        costPerToken: 0.0015,
      });
    }

    // Sort by priority
    this.providers.sort((a, b) => a.priority - b.priority);
  }

  private getCacheKey(prompt: string, provider: string): string {
    return `${provider}:${prompt}`;
  }

  private getFromCache(key: string): string | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached.response;
  }

  private setCache(key: string, response: string) {
    this.cache.set(key, { response, timestamp: Date.now() });
  }

  private async callOllama(
    provider: AIProvider,
    request: AIRequest
  ): Promise<string> {
    const response = await axios.post(`${provider.endpoint}/api/generate`, {
      model: provider.model,
      prompt: request.prompt,
      stream: false,
      options: {
        temperature: request.temperature || 0.7,
        num_predict: request.maxTokens || 500,
      },
    });

    return response.data.response;
  }

  private async callDeepSeek(
    provider: AIProvider,
    request: AIRequest
  ): Promise<string> {
    const response = await axios.post(
      provider.endpoint,
      {
        model: provider.model,
        messages: [{ role: "user", content: request.prompt }],
        max_tokens: request.maxTokens || 500,
        temperature: request.temperature || 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  }

  private async callClaude(
    provider: AIProvider,
    request: AIRequest
  ): Promise<string> {
    const response = await axios.post(
      provider.endpoint,
      {
        model: provider.model,
        messages: [{ role: "user", content: request.prompt }],
        max_tokens: request.maxTokens || 500,
        temperature: request.temperature || 0.7,
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.content[0].text;
  }

  private async callGemini(
    provider: AIProvider,
    request: AIRequest
  ): Promise<string> {
    const response = await axios.post(
      `${provider.endpoint}?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: request.prompt }] }],
        generationConfig: {
          temperature: request.temperature || 0.7,
          maxOutputTokens: request.maxTokens || 500,
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  }

  private async callCohere(
    provider: AIProvider,
    request: AIRequest
  ): Promise<string> {
    const response = await axios.post(
      provider.endpoint,
      {
        model: provider.model,
        prompt: request.prompt,
        max_tokens: request.maxTokens || 500,
        temperature: request.temperature || 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.generations[0].text;
  }

  private async callOpenAI(
    provider: AIProvider,
    request: AIRequest
  ): Promise<string> {
    const response = await axios.post(
      provider.endpoint,
      {
        model: provider.model,
        messages: [{ role: "user", content: request.prompt }],
        max_tokens: request.maxTokens || 500,
        temperature: request.temperature || 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  }

  private async callProvider(
    provider: AIProvider,
    request: AIRequest
  ): Promise<string> {
    switch (provider.name) {
      case "Ollama":
        return this.callOllama(provider, request);
      case "DeepSeek":
        return this.callDeepSeek(provider, request);
      case "Claude":
        return this.callClaude(provider, request);
      case "Gemini":
        return this.callGemini(provider, request);
      case "Cohere":
        return this.callCohere(provider, request);
      case "OpenAI":
        return this.callOpenAI(provider, request);
      default:
        throw new Error(`Unknown provider: ${provider.name}`);
    }
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    // Check cache first
    for (const provider of this.providers) {
      if (!provider.enabled) continue;

      const cacheKey = this.getCacheKey(request.prompt, provider.name);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          provider: provider.name,
          response: cached,
          latency: 0,
          cost: 0,
        };
      }
    }

    // Try providers in priority order with failover
    const errors: string[] = [];

    for (const provider of this.providers) {
      if (!provider.enabled) continue;

      try {
        const startTime = Date.now();
        const response = await this.callProvider(provider, request);
        const latency = Date.now() - startTime;

        // Estimate tokens and cost
        const tokensUsed = Math.ceil(response.length / 4);
        const cost = (provider.costPerToken || 0) * tokensUsed;

        // Cache the response
        const cacheKey = this.getCacheKey(request.prompt, provider.name);
        this.setCache(cacheKey, response);

        return {
          provider: provider.name,
          response,
          tokensUsed,
          cost,
          latency,
        };
      } catch (error: any) {
        errors.push(`${provider.name}: ${error.message}`);
        console.error(`Provider ${provider.name} failed:`, error.message);
        continue; // Try next provider
      }
    }

    throw new Error(`All AI providers failed: ${errors.join(", ")}`);
  }

  getProviderStatus() {
    return this.providers.map((p) => ({
      name: p.name,
      enabled: p.enabled,
      priority: p.priority,
      costPerToken: p.costPerToken,
    }));
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      timeout: this.cacheTimeout,
    };
  }
}

export default new AIOrchestrator();

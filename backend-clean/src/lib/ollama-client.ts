import axios from "axios";

interface OllamaResponse {
  response: string;
  model: string;
  created_at: string;
  done: boolean;
}

interface OllamaChatRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  stream?: boolean;
}

export class OllamaClient {
  private endpoint: string;
  private defaultModel: string;

  constructor(endpoint: string = "http://localhost:11434", defaultModel: string = "llama3.2:1b") {
    this.endpoint = endpoint;
    this.defaultModel = defaultModel;
  }

  async chat(prompt: string, model: string = this.defaultModel): Promise<string> {
    try {
      const response = await axios.post<OllamaResponse>(`${this.endpoint}/api/generate`, {
        model,
        prompt,
        stream: false,
      });
      return response.data.response;
    } catch (error) {
      throw new Error(`Ollama chat failed: ${error}`);
    }
  }

  async generate(prompt: string, model: string = this.defaultModel): Promise<string> {
    return this.chat(prompt, model);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.endpoint}`);
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async securityScan(code: string): Promise<string> {
    const prompt = `Review this code for security vulnerabilities:\n\n${code}\n\nProvide a detailed security review.`;
    return this.chat(prompt, "llama3.2:1b");
  }

  async reviewCode(code: string): Promise<string> {
    const prompt = `Review this TypeScript code for best practices, readability, and potential improvements:\n\n${code}`;
    return this.chat(prompt, "codellama");
  }
}

import type { AIProvider, AIConfig, AIMessage } from '../types';

/**
 * Base AI Service Interface
 */
interface AIService {
  sendMessage(messages: AIMessage[], context?: string): Promise<string>;
}

/**
 * Anthropic Claude AI Service
 */
class AnthropicService implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async sendMessage(messages: AIMessage[], context?: string): Promise<string> {
    const systemMessage = context
      ? `You are a helpful AI assistant for a life planning application. Context: ${context}`
      : 'You are a helpful AI assistant for a life planning application.';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 4096,
        system: systemMessage,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }
}

/**
 * OpenAI GPT Service
 */
class OpenAIService implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async sendMessage(messages: AIMessage[], context?: string): Promise<string> {
    const systemMessage = context
      ? `You are a helpful AI assistant for a life planning application. Context: ${context}`
      : 'You are a helpful AI assistant for a life planning application.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemMessage },
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

/**
 * xAI Grok Service
 */
class XAIService implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async sendMessage(messages: AIMessage[], context?: string): Promise<string> {
    const systemMessage = context
      ? `You are a helpful AI assistant for a life planning application. Context: ${context}`
      : 'You are a helpful AI assistant for a life planning application.';

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemMessage },
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`xAI API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

/**
 * Google Gemini Service
 */
class GoogleGeminiService implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async sendMessage(messages: AIMessage[], context?: string): Promise<string> {
    const systemInstruction = context
      ? `You are a helpful AI assistant for a life planning application. Context: ${context}`
      : 'You are a helpful AI assistant for a life planning application.';

    // Convert messages to Gemini format
    const contents = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google Gemini API error: ${error}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
}

/**
 * AI Service Factory
 */
export class AIServiceFactory {
  static createService(config: AIConfig): AIService {
    switch (config.provider) {
      case 'anthropic':
        return new AnthropicService(config.apiKey, config.model);
      case 'openai':
        return new OpenAIService(config.apiKey, config.model);
      case 'xai':
        return new XAIService(config.apiKey, config.model);
      case 'google':
        return new GoogleGeminiService(config.apiKey, config.model);
      default:
        throw new Error(`Unknown AI provider: ${config.provider}`);
    }
  }
}

/**
 * Get AI configuration from environment variables
 */
export function getAIConfigFromEnv(provider: AIProvider): AIConfig | null {
  const configs: Record<AIProvider, { keyVar: string; modelVar: string }> = {
    anthropic: {
      keyVar: 'VITE_ANTHROPIC_API_KEY',
      modelVar: 'VITE_ANTHROPIC_API_MODEL',
    },
    openai: {
      keyVar: 'VITE_OPENAI_API_KEY',
      modelVar: 'VITE_OPENAI_API_MODEL',
    },
    xai: {
      keyVar: 'VITE_XAI_API_KEY',
      modelVar: 'VITE_XAI_API_MODEL',
    },
    google: {
      keyVar: 'VITE_GOOGLE_API_KEY',
      modelVar: 'VITE_GEMINI_API_MODEL',
    },
  };

  const config = configs[provider];
  const apiKey = import.meta.env[config.keyVar];
  const model = import.meta.env[config.modelVar];

  if (!apiKey || !model) {
    return null;
  }

  return {
    provider,
    apiKey,
    model,
  };
}

/**
 * Get all available AI providers from environment
 */
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = ['anthropic', 'openai', 'xai', 'google'];
  return providers.filter((provider) => getAIConfigFromEnv(provider) !== null);
}

/**
 * Main AI Assistant class
 */
export class AIAssistant {
  private service: AIService;
  private conversationHistory: AIMessage[] = [];

  constructor(config: AIConfig) {
    this.service = AIServiceFactory.createService(config);
  }

  /**
   * Send a message with context
   */
  async sendMessage(message: string, context?: string): Promise<string> {
    this.conversationHistory.push({
      role: 'user',
      content: message,
    });

    try {
      const response = await this.service.sendMessage(
        this.conversationHistory,
        context
      );

      this.conversationHistory.push({
        role: 'assistant',
        content: response,
      });

      return response;
    } catch (error) {
      console.error('AI service error:', error);
      throw error;
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory(): AIMessage[] {
    return [...this.conversationHistory];
  }
}

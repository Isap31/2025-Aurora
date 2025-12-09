import Anthropic from '@anthropic-ai/sdk';

class AnthropicService {
  constructor() {
    // For now, using a placeholder - you'll add your API key later
    this.apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '';
    this.client = null;

    if (this.apiKey) {
      this.client = new Anthropic({
        apiKey: this.apiKey,
      });
    }
  }

  async chat(userMessage, conversationHistory = [], userContext = {}) {
    if (!this.client) {
      return "I'm currently in demo mode. To enable full AI features, add your Anthropic API key to the .env file.";
    }

    try {
      const systemPrompt = this.buildSystemPrompt(userContext);
      const messages = [
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages,
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      return "I'm having trouble processing that. Could you try again?";
    } catch (error) {
      console.error('Anthropic API error:', error);
      return "I'm having trouble thinking right now. Please try again in a moment.";
    }
  }

  buildSystemPrompt(userContext = {}) {
    let contextInfo = '';

    if (userContext) {
      contextInfo = '\n\nCurrent User Data:';
      if (userContext.latestGlucose) {
        contextInfo += `\n- Latest glucose reading: ${userContext.latestGlucose} mg/dL`;
      }
      if (userContext.averageGlucose) {
        contextInfo += `\n- Average glucose: ${userContext.averageGlucose} mg/dL`;
      }
      if (userContext.timeInRange !== undefined) {
        contextInfo += `\n- Time in range: ${userContext.timeInRange}%`;
      }
    }

    return `You are Aurora, the friendly AI assistant for AuroraFlow - a diabetes management app.

Your role is to:
- Answer questions about diabetes management in a caring, supportive way
- Provide insights based on the user's glucose data
- Suggest meal and exercise adjustments
- Offer encouragement and motivation
- Explain how different foods and activities affect blood sugar
- Help users understand their patterns and trends

IMPORTANT GUIDELINES:
- Always be warm, supportive, and encouraging
- Use simple, clear language - not overly medical
- Never diagnose or prescribe - remind users to consult their doctor for medical decisions
- Focus on lifestyle management and education
- Celebrate user's successes (good glucose readings, consistent logging, etc.)
- If glucose is concerning, encourage them to contact their healthcare provider
- Keep responses concise (2-3 paragraphs max) unless user asks for detail
- Use emojis sparingly but naturally for warmth

TONE: Friendly, knowledgeable, supportive - like a caring diabetes educator friend.${contextInfo}`;
  }

  isConfigured() {
    return !!this.apiKey;
  }

  // Mock response for demo mode when API key is not configured
  getMockResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('breakfast')) {
      return "Great question! For breakfast, I'd suggest a balanced meal with complex carbs and protein - like oatmeal with nuts and berries (about 40-50g carbs), or eggs with whole grain toast. This should keep your glucose steady. Want specific carb counts? 🥣";
    }

    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      return "Exercise is wonderful for managing diabetes! With your current glucose level, you're in a good range to exercise. Just remember to bring a fast-acting carb snack in case you feel low, and check your glucose after your workout. Stay hydrated! 💪";
    }

    if (lowerMessage.includes('glucose') || lowerMessage.includes('blood sugar')) {
      return "Your glucose readings look good! Staying in range (70-180 mg/dL) is great. Keep up the consistent logging - it helps identify patterns and make better decisions. You're doing amazing! 📊";
    }

    return "I'm here to help with your diabetes management! I can answer questions about meals, exercise, glucose patterns, and more. To unlock my full AI capabilities with personalized insights, add your Anthropic API key. What would you like to know? 💜";
  }
}

export const anthropicService = new AnthropicService();

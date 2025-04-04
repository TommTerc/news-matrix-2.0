import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface GPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GPTAnalysis {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  suggestedQuestions: string[];
}

const gptApi = {
  analyzeContent: async (content: string): Promise<GPTAnalysis> => {
    try {
      const messages: GPTMessage[] = [
        {
          role: 'system',
          content: `You are an expert news analyst. Analyze the following content and provide:
            1. A concise summary
            2. Key points
            3. Sentiment analysis
            4. Main topics
            5. Suggested follow-up questions`
        },
        {
          role: 'user',
          content
        }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 1000
      });

      const analysis = response.choices[0]?.message?.content;
      if (!analysis) throw new Error('No analysis generated');

      // Parse the response into structured format
      const sections = analysis.split('\n\n');
      const parsedAnalysis: GPTAnalysis = {
        summary: '',
        keyPoints: [],
        sentiment: 'neutral',
        topics: [],
        suggestedQuestions: []
      };

      sections.forEach(section => {
        if (section.toLowerCase().includes('summary:')) {
          parsedAnalysis.summary = section.split('Summary:')[1].trim();
        } else if (section.toLowerCase().includes('key points:')) {
          parsedAnalysis.keyPoints = section
            .split('Key points:')[1]
            .trim()
            .split('\n')
            .map(point => point.replace(/^-\s*/, ''))
            .filter(Boolean);
        } else if (section.toLowerCase().includes('sentiment:')) {
          const sentiment = section.split('Sentiment:')[1].trim().toLowerCase();
          parsedAnalysis.sentiment = sentiment.includes('positive')
            ? 'positive'
            : sentiment.includes('negative')
            ? 'negative'
            : 'neutral';
        } else if (section.toLowerCase().includes('topics:')) {
          parsedAnalysis.topics = section
            .split('Topics:')[1]
            .trim()
            .split('\n')
            .map(topic => topic.replace(/^-\s*/, ''))
            .filter(Boolean);
        } else if (section.toLowerCase().includes('suggested questions:')) {
          parsedAnalysis.suggestedQuestions = section
            .split('Suggested questions:')[1]
            .trim()
            .split('\n')
            .map(question => question.replace(/^-\s*/, ''))
            .filter(Boolean);
        }
      });

      return parsedAnalysis;
    } catch (error) {
      console.error('Error analyzing content with GPT-4:', error);
      throw error;
    }
  },

  generateSummary: async (content: string, maxLength: number = 150): Promise<string> => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Summarize the following content in ${maxLength} characters or less, maintaining key information and context.`
          },
          {
            role: 'user',
            content
          }
        ],
        temperature: 0.5,
        max_tokens: 100
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating summary with GPT-4:', error);
      throw error;
    }
  },

  generateRelatedTopics: async (topic: string, count: number = 5): Promise<string[]> => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Generate ${count} related topics for the following subject. Return only the topics, one per line.`
          },
          {
            role: 'user',
            content: topic
          }
        ],
        temperature: 0.8,
        max_tokens: 200
      });

      return (response.choices[0]?.message?.content || '')
        .split('\n')
        .map(topic => topic.trim())
        .filter(Boolean)
        .slice(0, count);
    } catch (error) {
      console.error('Error generating related topics with GPT-4:', error);
      throw error;
    }
  },

  generateInsights: async (content: string): Promise<string[]> => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Analyze the content and provide 3-5 key insights or implications. Return only the insights, one per line.'
          },
          {
            role: 'user',
            content
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      return (response.choices[0]?.message?.content || '')
        .split('\n')
        .map(insight => insight.trim())
        .filter(Boolean);
    } catch (error) {
      console.error('Error generating insights with GPT-4:', error);
      throw error;
    }
  }
};

export default gptApi;
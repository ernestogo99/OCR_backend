import { Injectable } from '@nestjs/common';

import { GoogleGenAI } from '@google/genai';

@Injectable()
export class LlmService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({});
  }

  async askDocument(extractedText: string, question: string): Promise<string> {
    const prompt = `
Você é um assistente que responde perguntas apenas com base no texto abaixo.

Texto do documento:
${extractedText}

Pergunta:
${question}

Se a resposta não estiver no texto, diga claramente que não foi encontrada.
`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text!;
  }
}

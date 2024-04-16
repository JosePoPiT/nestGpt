import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsStreamUseCase = async (
  openai: OpenAI,
  { prompt }: Options,
) => {
  return await openai.chat.completions.create({
    stream: true,
    messages: [
      {
        role: 'system',
        content: `Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
          la respuesta debe de ser en formato markdown,
          los pros y contras deben de estar en una lista,
          

          Si es buena comparacion, felicita al usuario
          
          Ejemplo de salida:
          { 
            message: string, // Explica el porque de los pros y contras de la lista
          }
          
          `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    max_tokens: 500,
  });
};

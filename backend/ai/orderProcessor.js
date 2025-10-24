// Estrutura inicial para integração com OpenAI
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function extractOrderFromMessage(message) {
  // Exemplo de chamada à API da OpenAI
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Você é um assistente que extrai pedidos de mensagens de WhatsApp.' },
      { role: 'user', content: message },
    ],
  });
  return response.data.choices[0].message.content;
}

module.exports = { extractOrderFromMessage };

require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const admin = require('firebase-admin');
const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');

// --- Firebase Initialization ---
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
console.log('Firebase Admin SDK initialized.');

// --- OpenAI Initialization ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log('OpenAI client initialized.');

// --- WhatsApp Client Initialization ---
const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
      type: 'remote',
      remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

console.log('WhatsApp client created.');

// --- Firestore Update Functions ---
const updateFirestore = async (collection, doc, data) => {
  try {
    await db.collection(collection).doc(doc).set(data);
    console.log(`Firestore updated: ${collection}/${doc}`);
  } catch (error) {
    console.error(`Error updating Firestore for ${collection}/${doc}:`, error);
  }
};

// --- Event Handlers ---
client.on('qr', async (qr) => {
  console.log('QR code received, updating Firestore...');
  await updateFirestore('whatsapp-status', 'qr', { qr });
});

client.on('ready', async () => {
  console.log('WhatsApp client is ready!');
  await updateFirestore('whatsapp-status', 'status', { status: 'ready' });
  // Clean up the QR code after connection is successful
  await updateFirestore('whatsapp-status', 'qr', { qr: null });
});

client.on('disconnected', async (reason) => {
  console.log('WhatsApp client was disconnected', reason);
  await updateFirestore('whatsapp-status', 'status', { status: 'disconnected' });
});

client.on('message', async (message) => {
  const from = message.from;
  const body = message.body;
  console.log(`Message received from ${from}: "${body}"`);

  // Ignore status broadcast messages and non-text messages
  if (message.isStatus || message.type !== 'chat') {
    return;
  }

  // --- Greeting and Menu Logic ---
  const greetingKeywords = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'cardapio', 'menu', 'cardápio'];
  const messageBodyLower = body.toLowerCase();

  if (greetingKeywords.some(keyword => messageBodyLower.includes(keyword))) {
    const menu = `
Olá! Eu sou o assistente virtual da O'Entrega. Bem-vindo(a)!

*CARDÁPIO DO DIA*

*HAMBÚRGUERES 🍔*
- Clássico: R$ 25,00
- Duplo: R$ 35,00
- Vegano: R$ 30,00

*PIZZAS 🍕*
- Calabresa: R$ 40,00
- Mussarela: R$ 38,00
- Portuguesa: R$ 45,00

*BEBIDAS 🥤*
- Refrigerante Lata: R$ 5,00
- Suco Natural: R$ 8,00
- Água: R$ 3,00

*COMO FAZER SEU PEDIDO:*
Basta me enviar uma mensagem com o que você deseja, a quantidade e o endereço de entrega.

*Exemplo:*
"Quero 1 Hambúrguer Duplo, 2 refris e 1 pizza de calabresa. Entregar na Rua das Flores, nº 123."

Estou aguardando seu pedido!
    `;
    console.log(`Sending menu to ${from}.`);
    await message.reply(menu);
    return; // Stop processing after sending the menu
  }

  // --- AI Order Processing Logic ---
  try {
    console.log('Processing message with OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `Você é um assistente de pedidos para uma loja. Sua tarefa é extrair informações de um pedido de uma mensagem de texto e retornar um objeto JSON.
          
          O JSON deve ter a seguinte estrutura:
          {
            "items": [
              { "name": "nome do produto", "quantity": 1, "price": "preço se mencionado" }
            ],
            "customer": {
              "name": "nome do cliente se mencionado",
              "phone": "número de telefone do remetente"
            },
            "delivery": {
              "address": "endereço de entrega se mencionado",
              "method": "delivery ou pickup"
            },
            "payment": {
              "method": "pix, card, ou cash se mencionado"
            }
          }

          - Analise a mensagem para identificar os itens do pedido, quantidades, endereço de entrega, e forma de pagamento.
          - Se a mensagem não contiver informações suficientes para um pedido, retorne um JSON com a chave "error" e uma mensagem explicando o que falta. Ex: { "error": "Não foi possível identificar os itens do pedido." }.
          - O número de telefone do cliente deve ser extraído do número do remetente.
          - Se o endereço for mencionado, o método de entrega é 'delivery'. Se não, pode ser 'pickup'.
          - Seja preciso e retorne apenas o objeto JSON.`
        },
        {
          role: "user",
          content: `Remetente: ${from}\nMensagem: ${body}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content);
    console.log('OpenAI response:', JSON.stringify(result, null, 2));

    if (result.error) {
      console.log('OpenAI indicated an error:', result.error);
      // Optionally, send a message back asking for more information
      // message.reply(`Não consegui processar seu pedido: ${result.error}`);
      return;
    }

    // --- Create Order in Firestore ---
    const orderId = uuidv4();
    const total = result.items.reduce((acc, item) => acc + (parseFloat(item.price || 0) * item.quantity), 0);

    const newOrder = {
      id: orderId,
      customerName: result.customer?.name || 'Cliente WhatsApp',
      customerPhone: from.replace(/@c\.us/g, ''),
      items: result.items,
      status: 'Pending', // Default status
      total: total,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      deliveryAddress: result.delivery?.address || null,
      paymentMethod: result.payment?.method || 'Não especificado',
    };

    await db.collection('orders').doc(orderId).set(newOrder);
    console.log(`New order ${orderId} created in Firestore.`);

    // --- Send Confirmation Message ---
    const confirmationMessage = `Olá! Seu pedido foi recebido com sucesso e já está sendo preparado. O número do seu pedido é: ${orderId.substring(0, 8)}.`;
    await message.reply(confirmationMessage);
    console.log(`Confirmation sent to ${from}.`);

  } catch (error) {
    console.error('Error processing message or creating order:', error);
    // message.reply('Desculpe, ocorreu um erro ao processar seu pedido. Tente novamente.');
  }
});

// --- Start Client ---
console.log('Initializing WhatsApp client...');
client.initialize();

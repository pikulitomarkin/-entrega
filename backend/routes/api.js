const express = require('express');
const router = express.Router();
const { extractOrderFromMessage } = require('../ai/orderProcessor');

router.post('/process-message', async (req, res) => {
  const { message } = req.body;
  try {
    const orderData = await extractOrderFromMessage(message);
    res.json({ order: orderData });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar mensagem.' });
  }
});

module.exports = router;

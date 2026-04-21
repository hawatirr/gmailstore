const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');

// POST /api/payment/create-order - Buat order pembayaran
router.post('/create-order', verifyToken, paymentController.createOrder);

// POST /api/payment/binance-webhook - Webhook untuk callback Binance
router.post('/binance-webhook', paymentController.handleWebhook);

// GET /api/payment/status/:orderId - Cek status pembayaran
router.get('/status/:orderId', verifyToken, paymentController.getOrderStatus);

module.exports = router;

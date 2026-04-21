const crypto = require('crypto');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sign request untuk Binance API
const signRequest = (params, secretKey) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return crypto
    .createHmac('sha512', secretKey)
    .update(sortedParams)
    .digest('hex')
    .toUpperCase();
};

const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    // Ambil detail produk
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Stok tidak mencukupi' });
    }

    const totalAmount = product.priceUsd * quantity;

    // Buat order di database dengan status PENDING
    const order = await prisma.order.create({
      data: {
        userId,
        productId,
        quantity,
        totalAmount,
        status: 'PENDING',
        currency: 'USD'
      }
    });

    // Buat order di Binance Pay Sandbox
    const binancePayload = {
      env: {
        terminalType: 'WEB'
      },
      order: {
        merchantTradeNo: `ORDER-${order.id}-${Date.now()}`,
        buyerEmail: req.user.email,
        orderAmount: {
          amount: totalAmount.toFixed(2),
          currency: 'USD'
        },
        goods: {
          goodsType: '01',
          goodsCategory: 'D000',
          referenceGoodsId: product.id.toString(),
          goodsName: product.name,
          goodsDetail: `Pembelian ${product.name} sebanyak ${quantity}`
        },
        returnUrl: `${process.env.APP_URL}/dashboard`,
        cancelReturnUrl: `${process.env.APP_URL}/checkout?orderId=${order.id}`
      },
      paymentMethod: {
        paymentMethodType: ['BCARD', 'BALANCE']
      }
    };

    const timestamp = Date.now().toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    const signature = signRequest(
      {
        timestamp,
        nonce,
        payload: JSON.stringify(binancePayload)
      },
      process.env.BINANCE_SECRET_KEY
    );

    const response = await axios.post(
      'https://bpay.binanceapi.com/binanc pay/open/v1/order/create',
      binancePayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'BAP-API-KEY': process.env.BINANCE_API_KEY,
          'BAP-API-SIGN': signature,
          'BAP-API-TIMESTAMP': timestamp,
          'BAP-API-NONCE': nonce
        }
      }
    );

    // Update order dengan Binance order ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        binanceOrderId: response.data.orderId,
        checkoutUrl: response.data.checkoutUrl
      }
    });

    res.json({
      orderId: order.id,
      binanceOrderId: response.data.orderId,
      checkoutUrl: response.data.checkoutUrl,
      totalAmount: totalAmount.toFixed(2),
      currency: 'USD'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      error: 'Gagal membuat order pembayaran',
      details: error.response?.data || error.message 
    });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    
    // Verifikasi signature webhook
    const receivedSignature = req.headers['bap-api-sign'];
    const timestamp = req.headers['bap-api-timestamp'];
    const nonce = req.headers['bap-api-nonce'];
    
    const payload = JSON.stringify(webhookData);
    const expectedSignature = signRequest(
      { timestamp, nonce, payload },
      process.env.BINANCE_SECRET_KEY
    );

    if (receivedSignature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { orderId, orderStatus } = webhookData;

    // Cari order berdasarkan Binance order ID
    const order = await prisma.order.findFirst({
      where: { binanceOrderId: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    // Update status order
    if (orderStatus === 'SUCCESS' || orderStatus === 'PAID') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID', paidAt: new Date() }
      });

      // Trigger auto-delivery (akan diimplementasikan di phase 4)
      console.log(`Payment success for order ${order.id}. Triggering delivery...`);
    } else if (orderStatus === 'FAILED' || orderStatus === 'CANCELLED') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' }
      });
    }

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await prisma.order.findFirst({
      where: { 
        id: parseInt(orderId),
        userId 
      },
      include: {
        product: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    res.json({
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        currency: order.currency,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        product: {
          name: order.product.name,
          priceUsd: order.product.priceUsd
        },
        quantity: order.quantity
      }
    });
  } catch (error) {
    console.error('Get order status error:', error);
    res.status(500).json({ error: 'Gagal mengambil status order' });
  }
};

module.exports = { createOrder, handleWebhook, getOrderStatus };

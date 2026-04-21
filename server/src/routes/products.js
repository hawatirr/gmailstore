const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken } = require('../middleware/auth');

// GET /api/products - List semua produk
router.get('/', productController.getProducts);

// GET /api/products/:id - Detail produk
router.get('/:id', productController.getProductById);

// POST /api/products - Create produk (admin only)
router.post('/', verifyToken, productController.createProduct);

// PUT /api/products/:id - Update produk (admin only)
router.put('/:id', verifyToken, productController.updateProduct);

// DELETE /api/products/:id - Delete produk (admin only)
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Gagal mengambil daftar produk' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Gagal mengambil detail produk' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, priceUsd, stock, deliveryData, isActive } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        priceUsd: parseFloat(priceUsd),
        stock: parseInt(stock),
        deliveryData,
        isActive: isActive !== false
      }
    });

    res.status(201).json({ 
      message: 'Produk berhasil dibuat',
      product 
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Gagal membuat produk' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, priceUsd, stock, deliveryData, isActive } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        priceUsd: parseFloat(priceUsd),
        stock: parseInt(stock),
        deliveryData,
        isActive
      }
    });

    res.json({ 
      message: 'Produk berhasil diupdate',
      product 
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Gagal mengupdate produk' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Gagal menghapus produk' });
  }
};

module.exports = { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};

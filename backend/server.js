const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mock-ecom-cart', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  productId: Number,
  name: String,
  price: Number,
  qty: Number
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

// Mock products
const products = [
  { id: 1, name: 'Laptop', price: 999.99 },
  { id: 2, name: 'Mouse', price: 29.99 },
  { id: 3, name: 'Keyboard', price: 79.99 },
  { id: 4, name: 'Monitor', price: 299.99 },
  { id: 5, name: 'Headphones', price: 149.99 },
  { id: 6, name: 'Tablet', price: 499.99 },
  { id: 7, name: 'Smartphone', price: 699.99 },
  { id: 8, name: 'Printer', price: 199.99 },
];

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/cart', async (req, res) => {
  const { productId, qty } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  try {
    const cartItem = new CartItem({
      productId,
      name: product.name,
      price: product.price,
      qty
    });
    await cartItem.save();
    res.json({ id: cartItem._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    const items = await CartItem.find();
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    res.json({ items, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await CartItem.findByIdAndDelete(id);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/checkout', async (req, res) => {
  const { cartItems } = req.body;
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const receipt = {
    total,
    timestamp: new Date().toISOString(),
    items: cartItems
  };
  // Clear cart after checkout
  try {
    await CartItem.deleteMany({});
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

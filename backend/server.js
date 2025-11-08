const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite database
const db = new sqlite3.Database('./cart.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER,
    name TEXT,
    price REAL,
    qty INTEGER
  )`);
});

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

app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  db.run(`INSERT INTO cart (productId, name, price, qty) VALUES (?, ?, ?, ?)`,
    [productId, product.name, product.price, qty], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

app.get('/api/cart', (req, res) => {
  db.all(`SELECT * FROM cart`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = rows.reduce((sum, item) => sum + item.price * item.qty, 0);
    res.json({ items: rows, total });
  });
});

app.delete('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM cart WHERE id = ?`, id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item removed' });
  });
});

app.post('/api/checkout', (req, res) => {
  const { cartItems } = req.body;
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const receipt = {
    total,
    timestamp: new Date().toISOString(),
    items: cartItems
  };
  // Clear cart after checkout
  db.run(`DELETE FROM cart`, [], (err) => {
    if (err) console.error(err);
  });
  res.json(receipt);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

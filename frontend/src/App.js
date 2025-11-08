import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [view, setView] = useState('products'); // products, cart, checkout
  const [checkoutData, setCheckoutData] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchCart = async () => {
    const res = await fetch('http://localhost:5000/api/cart');
    const data = await res.json();
    setCart(data);
  };

  const addToCart = async (productId, qty = 1) => {
    await fetch('http://localhost:5000/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, qty })
    });
    fetchCart();
  };

  const removeFromCart = async (id) => {
    await fetch(`http://localhost:5000/api/cart/${id}`, { method: 'DELETE' });
    fetchCart();
  };

  const checkout = async () => {
    const res = await fetch('http://localhost:5000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: cart.items })
    });
    const data = await res.json();
    setCheckoutData(data);
    setView('receipt');
    fetchCart(); // should be empty
  };

  return (
    <div className="App">
      <header>
        <h1>Mock E-Com Cart</h1>
        <button onClick={() => setView('products')}>Products</button>
        <button onClick={() => setView('cart')}>Cart ({cart.items.length})</button>
      </header>
      {view === 'products' && <Products products={products} addToCart={addToCart} />}
      {view === 'cart' && <Cart cart={cart} removeFromCart={removeFromCart} setView={setView} />}
      {view === 'checkout' && <Checkout cart={cart} checkout={checkout} setView={setView} />}
      {view === 'receipt' && <Receipt data={checkoutData} setView={setView} />}
    </div>
  );
}

function Products({ products, addToCart }) {
  return (
    <div className="products">
      <h2>Products</h2>
      <div className="grid">
        {products.map(p => (
          <div key={p.id} className="product">
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={() => addToCart(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cart({ cart, removeFromCart, setView }) {
  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.items.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name} - ${item.price} x {item.qty}</span>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${cart.total.toFixed(2)}</p>
      <button onClick={() => setView('checkout')}>Checkout</button>
    </div>
  );
}

function Checkout({ cart, checkout, setView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    checkout();
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>
      <button onClick={() => setView('cart')}>Back to Cart</button>
    </div>
  );
}

function Receipt({ data, setView }) {
  return (
    <div className="receipt">
      <h2>Receipt</h2>
      <p>Total: ${data.total.toFixed(2)}</p>
      <p>Timestamp: {data.timestamp}</p>
      <ul>
        {data.items.map(item => (
          <li key={item.id}>{item.name} - ${item.price} x {item.qty}</li>
        ))}
      </ul>
      <button onClick={() => setView('products')}>Back to Products</button>
    </div>
  );
}

export default App;

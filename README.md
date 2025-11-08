# Mock E-Com Cart

A full-stack shopping cart application built with React (frontend) and Node.js/Express (backend) using SQLite for database persistence.

## Features

- Product catalog with 8 mock items
- Add/remove items from cart
- View cart with totals
- Checkout process with mock receipt
- Responsive design
- DB persistence for cart

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js, Express
- **Database:** SQLite
- **APIs:** RESTful

## Setup

### Backend

1. Navigate to `backend` directory
2. Install dependencies: `npm install`
3. Start server: `node server.js`

### Frontend

1. Navigate to `frontend` directory
2. Install dependencies: `npm install`
3. Start app: `npm start`

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/cart` - Add item to cart (body: {productId, qty})
- `GET /api/cart` - Get cart items and total
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/checkout` - Process checkout (body: {cartItems})

## Screenshots

(Add screenshots here)

## Deployment

Deploy backend and frontend separately. Update API URLs in frontend accordingly.

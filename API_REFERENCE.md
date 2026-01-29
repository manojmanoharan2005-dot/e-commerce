# 📡 FertilizerMart API Reference

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Farmer",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer",  // or "admin"
  "phone": "9876543210"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Farmer",
    "email": "john@example.com",
    "role": "farmer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "farmer@test.com",
  "password": "farmer123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Test Farmer",
    "email": "farmer@test.com",
    "role": "farmer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Test Farmer",
    "email": "farmer@test.com",
    "role": "farmer"
  }
}
```

## 🌾 Products

### Get All Products
```http
GET /products
Query Parameters:
  - category: string (optional) - Filter by category
  - minPrice: number (optional)
  - maxPrice: number (optional)
  - inStock: boolean (optional)
  - search: string (optional) - Text search

Example: GET /products?category=Organic&inStock=true

Response: 200 OK
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "name": "Urea Fertilizer",
      "category": "Chemical",
      "price": 280,
      "stock": 500,
      ...
    }
  ]
}
```

### Smart Search (AI-Enhanced)
```http
GET /products/search?query=best for paddy

Response: 200 OK
{
  "success": true,
  "query": "best for paddy",
  "searchTerms": ["paddy", "rice", "urea", "nitrogen"],
  "count": 5,
  "data": [...]
}
```

### Get Single Product
```http
GET /products/:id

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Urea Fertilizer",
    "description": "...",
    "category": "Chemical",
    "price": 280,
    "stock": 500,
    "npkRatio": {
      "nitrogen": 46,
      "phosphorus": 0,
      "potassium": 0
    },
    ...
  }
}
```

### Get AI Product Advice 🤖
```http
POST /products/:id/advice
Content-Type: application/json

{
  "cropType": "Paddy",
  "soilType": "Clay",
  "season": "Kharif"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "suitability": "Yes",
    "suitabilityReason": "Urea is highly suitable for paddy cultivation...",
    "dosage": "50-60 kg per acre",
    "applicationMethod": "Split application - 50% at transplanting, 25% at tillering, 25% at panicle initiation",
    "bestTime": "Apply during active growth stages",
    "safetyPrecautions": [
      "Wear gloves during application",
      "Store in dry place",
      "Keep away from children"
    ]
  }
}
```

### Get Price Intelligence 🤖
```http
GET /products/:id/price-intelligence

Response: 200 OK
{
  "success": true,
  "data": {
    "trend": "Stable",
    "trendPercentage": "±2%",
    "buyingAdvice": "Good time to buy",
    "reason": "Prices are stable with adequate supply...",
    "bestSeason": "Kharif season"
  }
}
```

### Create Product (Admin Only)
```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Fertilizer",
  "description": "Description here",
  "category": "Organic",
  "cropTags": ["wheat", "rice"],
  "price": 500,
  "stock": 100,
  "unit": "bag",
  "manufacturer": "Company Name",
  "npkRatio": {
    "nitrogen": 10,
    "phosphorus": 20,
    "potassium": 10
  }
}

Response: 201 Created
```

### Update Product (Admin Only)
```http
PUT /products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 550,
  "stock": 150
}

Response: 200 OK
```

### Delete Product (Admin Only)
```http
DELETE /products/:id
Authorization: Bearer <admin_token>

Response: 200 OK
```

## 🛒 Orders

### Create Order (Checkout)
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "...",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Farmer",
    "phone": "9876543210",
    "street": "Village Road",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411001"
  },
  "paymentMethod": "COD",
  "notes": "Deliver in morning"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "items": [...],
    "totalAmount": 560,
    "status": "pending",
    "orderDate": "2026-01-29T10:00:00.000Z"
  },
  "message": "Order placed successfully"
}
```

### Get My Orders
```http
GET /orders/my-orders
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

### Get All Orders (Admin Only)
```http
GET /orders
Authorization: Bearer <admin_token>
Query Parameters:
  - status: string (optional)
  - startDate: date (optional)
  - endDate: date (optional)

Response: 200 OK
{
  "success": true,
  "count": 50,
  "stats": {
    "totalOrders": 50,
    "totalRevenue": 125000,
    "pendingOrders": 10,
    "completedOrders": 35
  },
  "data": [...]
}
```

### Get Single Order
```http
GET /orders/:id
Authorization: Bearer <token>

Response: 200 OK
```

### Update Order Status (Admin Only)
```http
PATCH /orders/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "shipped"  // pending, confirmed, processing, shipped, delivered, cancelled
}

Response: 200 OK
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔑 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@test.com","password":"farmer123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Get AI Advice
```bash
curl -X POST http://localhost:5000/api/products/<product_id>/advice \
  -H "Content-Type: application/json" \
  -d '{"cropType":"Paddy","soilType":"Clay","season":"Kharif"}'
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "items": [{"productId":"<product_id>","quantity":2}],
    "shippingAddress": {
      "name":"John","phone":"9876543210",
      "street":"Test St","city":"Pune","state":"MH","pincode":"411001"
    }
  }'
```

## 🔗 Postman Collection

Import this into Postman for easy testing:

1. Create new collection "FertilizerMart API"
2. Add base URL variable: `{{baseUrl}}` = `http://localhost:5000/api`
3. Add token variable: `{{token}}` = (paste your JWT token)
4. Add requests from above examples

---

**Happy API Testing! 🚀**

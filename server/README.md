# 🖥️ E-Commerce Backend API - RANA Shop

A robust, scalable RESTful API backend for a modern e-commerce platform built with **Node.js**, **Express.js**, and **MongoDB**. This server provides comprehensive e-commerce functionality including authentication, product management, order processing, and secure payment handling.

## 🌐 API Documentation

📍 **Base URL**: `https://your-api-domain.com`  
📍 **Development**: `http://localhost:5000`

---

## 🚀 Core Features

### 🔐 **Authentication & Security**
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Dual Token Support**: HTTP-only cookies + Authorization headers
- **Protected Routes**: Middleware-based route protection
- **CORS Configuration**: Secure cross-origin resource sharing

### 📦 **Product Management**
- **Complete CRUD Operations**: Create, read, update, delete products
- **Advanced Search**: Regex-based product search with pagination
- **Review & Rating System**: User reviews with automatic rating calculations
- **Inventory Management**: Stock tracking and availability monitoring
- **Category Management**: Organized product categorization

### 🛒 **Order Processing**
- **Order Lifecycle**: Complete order management from creation to delivery
- **Payment Integration**: Support for multiple payment methods
- **Order Tracking**: Real-time status updates and history
- **Shipping Management**: Address validation and shipping calculations
- **Invoice Generation**: Automated order documentation

### 👤 **User Management**
- **Account Management**: Registration, profile updates, account deletion
- **Role-based Access**: Admin and customer role differentiation
- **Profile Customization**: User preferences and settings
- **Order History**: Complete purchase history tracking

---

## 🛠️ Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Runtime** | Node.js | 16+ | JavaScript runtime environment |
| **Framework** | Express.js | 4.21+ | Web application framework |
| **Database** | MongoDB | 6.0+ | NoSQL document database |
| **ODM** | Mongoose | 8.17+ | MongoDB object modeling |
| **Authentication** | JWT | 9.0+ | JSON Web Token implementation |
| **Security** | bcryptjs | 2.4+ | Password hashing |
| **Middleware** | Various | Latest | CORS, cookie-parser, etc. |

---

## 📁 Detailed Project Architecture

```
server/
├── config/
│   └── db.js                    # MongoDB connection configuration
│
├── controllers/                 # Business logic layer
│   ├── productController.js     # Product CRUD operations
│   ├── userController.js        # User authentication & management
│   └── orderController.js       # Order processing logic
│
├── data/                        # Sample data for seeding
│   ├── products.js              # Sample product data
│   └── users.js                 # Sample user data
│
├── middleware/                  # Custom middleware functions
│   └── authMiddleware.js        # JWT authentication middleware
│
├── models/                      # Database schemas
│   ├── productModel.js          # Product schema with reviews
│   ├── userModel.js             # User schema with authentication
│   └── orderModel.js            # Order schema with items
│
├── routes/                      # API route definitions
│   ├── productRoutes.js         # Product API endpoints
│   ├── userRoutes.js            # User API endpoints
│   └── orderRoutes.js           # Order API endpoints
│
├── utils/                       # Utility functions
│   └── generateToken.js         # JWT token generation utilities
│
├── server.js                    # Main application entry point
├── seeder.js                    # Database seeding utility
└── package.json                 # Dependencies and scripts
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v16.0.0 or higher
- **MongoDB** (Local installation or MongoDB Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation Steps

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd server
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment configuration**
Create a `.env` file in the root directory:
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/rana-shop
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=30d

# Optional: Payment Integration
PAYPAL_CLIENT_ID=your_paypal_client_id
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. **Start the server**

**Development mode (with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

5. **Seed the database (Optional)**
```bash
# Import sample data
npm run data:import

# Clear all data
npm run data:destroy
```

---

## 📝 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Start** | `npm start` | Run server in production mode |
| **Development** | `npm run dev` | Run server with nodemon (auto-restart) |
| **Import Data** | `npm run data:import` | Seed database with sample data |
| **Destroy Data** | `npm run data:destroy` | Clear all database collections |

---

## 🌐 Complete API Reference

### 🔐 Authentication Endpoints

#### Register New User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "token": "jwt_token_here"
}
```

#### User Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "token": "jwt_token_here"
}
```

#### User Logout
```http
POST /api/users/logout
Authorization: Bearer <jwt_token>

Response:
{
  "message": "Logged out successfully"
}
```

### 👤 User Management Endpoints (Protected)

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <jwt_token>

Response:
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "password": "newPassword123"
}
```

### 📦 Product Endpoints

#### Get All Products
```http
GET /api/products?keyword=laptop&pageNumber=1

Query Parameters:
- keyword: Search term (optional)
- pageNumber: Page number for pagination (default: 1)
- category: Filter by category (optional)
- minPrice: Minimum price filter (optional)
- maxPrice: Maximum price filter (optional)

Response:
{
  "products": [
    {
      "_id": "product_id",
      "name": "Laptop",
      "image": "/images/laptop.jpg",
      "brand": "Dell",
      "category": "Electronics",
      "description": "High-performance laptop",
      "rating": 4.5,
      "numReviews": 12,
      "price": 999.99,
      "countInStock": 10
    }
  ],
  "page": 1,
  "pages": 3,
  "hasMore": true
}
```

#### Get Product by ID
```http
GET /api/products/:id

Response:
{
  "_id": "product_id",
  "name": "Laptop",
  "image": "/images/laptop.jpg",
  "brand": "Dell",
  "category": "Electronics",
  "description": "High-performance laptop with latest specs",
  "reviews": [
    {
      "name": "John Doe",
      "rating": 5,
      "comment": "Great laptop!",
      "user": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "rating": 4.5,
  "numReviews": 12,
  "price": 999.99,
  "countInStock": 10,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Create Product Review
```http
POST /api/products/:id/reviews
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent product, highly recommended!"
}

Response:
{
  "message": "Review added successfully"
}
```

### 🛒 Order Endpoints (Protected)

#### Create New Order
```http
POST /api/orders
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "orderItems": [
    {
      "name": "Laptop",
      "qty": 1,
      "image": "/images/laptop.jpg",
      "price": 999.99,
      "product": "product_id"
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "PayPal",
  "itemsPrice": 999.99,
  "taxPrice": 80.00,
  "shippingPrice": 10.00,
  "totalPrice": 1089.99
}

Response:
{
  "_id": "order_id",
  "user": "user_id",
  "orderItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "PayPal",
  "totalPrice": 1089.99,
  "isPaid": false,
  "isDelivered": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get User Orders
```http
GET /api/orders/myorders
Authorization: Bearer <jwt_token>

Response:
[
  {
    "_id": "order_id",
    "totalPrice": 1089.99,
    "isPaid": true,
    "paidAt": "2024-01-01T00:00:00.000Z",
    "isDelivered": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Order by ID
```http
GET /api/orders/:id
Authorization: Bearer <jwt_token>

Response:
{
  "_id": "order_id",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "orderItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "PayPal",
  "paymentResult": {
    "id": "payment_id",
    "status": "COMPLETED",
    "update_time": "2024-01-01T00:00:00.000Z",
    "email_address": "john@example.com"
  },
  "totalPrice": 1089.99,
  "isPaid": true,
  "paidAt": "2024-01-01T00:00:00.000Z",
  "isDelivered": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 🗄️ Database Models

### User Model
```javascript
{
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  }
}
```

### Product Model
```javascript
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0
  }
}
```

### Order Model
```javascript
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  }
}
```

---

## 🔒 Security Implementation

### Authentication Flow
1. **User Registration**: Password hashed with bcrypt
2. **Login**: Credentials validated, JWT token generated
3. **Token Storage**: JWT stored in HTTP-only cookie + returned in response
4. **Protected Routes**: Middleware validates JWT on each request
5. **Token Refresh**: Automatic token renewal for long sessions

### Security Middleware
```javascript
// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

### Password Security
- **bcrypt hashing** with 12 salt rounds
- **Password validation** with minimum requirements
- **Account lockout** after failed attempts (optional)

---

## 📊 Performance Optimization

### Database Optimization
- **Indexing**: Optimized MongoDB indexes for common queries
- **Aggregation**: Efficient data aggregation for statistics
- **Connection Pooling**: MongoDB connection optimization
- **Query Optimization**: Optimized database queries

### Caching Strategy
- **Response Caching**: Cache frequently accessed data
- **Session Management**: Efficient session handling
- **Static Asset Caching**: CDN integration ready

### Error Handling
```javascript
// Global Error Handler
app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new Error(message);
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new Error(message);
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
});
```

---

## 🧪 Testing

### Manual Testing with Postman
Create a Postman collection with the following environments:

**Development Environment:**
```json
{
  "baseUrl": "http://localhost:5000",
  "token": "{{jwt_token}}"
}
```

**Production Environment:**
```json
{
  "baseUrl": "https://your-api-domain.com",
  "token": "{{jwt_token}}"
}
```

### Testing Checklist
- [ ] User registration and login
- [ ] JWT token authentication
- [ ] Product CRUD operations
- [ ] Order creation and retrieval
- [ ] Review system functionality
- [ ] Error handling scenarios

---

## 🚀 Deployment Guide

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_super_secure_jwt_secret_for_production
CLIENT_URL=https://your-frontend-domain.com
```

### Deployment Platforms

#### 1. **Render (Recommended)**
```bash
# Connect GitHub repository
# Set environment variables in dashboard
# Deploy automatically on push
```

#### 2. **Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### 3. **Heroku**
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongo_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

#### 4. **DigitalOcean App Platform**
```yaml
# app.yaml
name: rana-shop-api
services:
- name: api
  source_dir: /
  github:
    repo: your-username/your-repo
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: your_mongo_uri
    type: SECRET
  - key: JWT_SECRET
    value: your_jwt_secret
    type: SECRET
```

---

## 📈 Monitoring & Analytics

### Health Check Endpoint
```http
GET /api/health

Response:
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

### Logging
```javascript
// Custom logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  next();
});
```

---

## 🔧 Development Tools

### Useful Development Commands
```bash
# Check MongoDB connection
mongosh "your_mongo_uri"

# View server logs
npm run dev | bunyan  # if using bunyan

# Database backup
mongodump --uri="your_mongo_uri"

# Database restore
mongorestore --uri="your_mongo_uri" dump/
```

### Debugging
```javascript
// Debug mode
DEBUG=app:* npm run dev

// MongoDB debug
mongoose.set('debug', true);
```

---

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Make changes** following coding standards
4. **Write tests** for new functionality
5. **Commit changes**
   ```bash
   git commit -m "feat: add new feature"
   ```
6. **Push branch**
   ```bash
   git push origin feature/new-feature
   ```
7. **Create Pull Request**

### Coding Standards
- Use **ES6+** features
- Follow **RESTful** API conventions
- Write **clear, descriptive** commit messages
- Add **JSDoc** comments for functions
- Handle **errors gracefully**
- Validate **all inputs**

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Md Rana Islam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 👨‍💻 Author & Contact

**Md Rana Islam**
- 🌐 **GitHub**: [@ranaIslam01](https://github.com/ranaIslam01)
- 📧 **Email**: [your-email@example.com]
- 🌍 **Portfolio**: [your-portfolio.com]
- 💼 **LinkedIn**: [linkedin.com/in/rana-islam]

---

## 🙏 Acknowledgments

- **Express.js Community** - For the robust web framework
- **MongoDB Team** - For the flexible NoSQL database
- **JWT.io** - For secure authentication standards
- **bcrypt Community** - For password security
- **Open Source Contributors** - For inspiration and tools
- **Node.js Foundation** - For the runtime environment

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🗺️ Roadmap

### Phase 1 - Core Features ✅
- [x] User authentication
- [x] Product management
- [x] Order processing
- [x] Review system

### Phase 2 - Advanced Features 🚧
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Admin dashboard API
- [ ] Inventory management

### Phase 3 - Optimization 📋
- [ ] Redis caching
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Automated testing
- [ ] Performance monitoring

### Phase 4 - Scaling 🚀
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] WebSocket support
- [ ] CDN integration
- [ ] Advanced analytics

---

*🛍️ Built with passion for modern e-commerce by Rana Islam*

# Inventory Management System with ML Integration

A comprehensive MERN stack inventory management system with advanced analytics and AI-powered predictions for demand forecasting and inventory optimization.

## 🚀 Features

### Core Inventory Management
- **Product Management**: Add, edit, delete, and track products with categories and suppliers
- **Customer Management**: Complete customer relationship management
- **Supplier Management**: Supplier information and purchase tracking
- **Sales Management**: Sales recording with automatic inventory updates
- **Purchase Management**: Purchase order tracking with stock updates
- **User Management**: Role-based user authentication and authorization

### 🤖 AI & Analytics Features
- **Sales Analytics**: Real-time sales trends, revenue analysis, and performance metrics
- **Demand Forecasting**: ML-powered demand prediction for individual products
- **Inventory Optimization**: Smart recommendations for stock levels and reordering
- **Sales Prediction**: Advanced sales forecasting with confidence intervals
- **Customer Analytics**: Customer behavior analysis and purchasing patterns
- **Profit Analytics**: Real-time profit margin tracking and analysis

### 📊 Dashboard & Reporting
- **Real-time Dashboard**: Live inventory metrics and KPIs
- **Interactive Reports**: Comprehensive analytics and reporting interface
- **Low Stock Alerts**: Automated notifications for inventory optimization
- **Visual Analytics**: Charts and graphs for data visualization

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Morgan** for logging
- **Helmet** for security

### Frontend
- **React 19** with modern hooks
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **React Icons** for UI components

### ML & Analytics
- **MongoDB Aggregation Pipeline** for data analytics
- **Custom prediction algorithms** for forecasting
- **Statistical analysis** for demand prediction
- **Trend analysis** for sales forecasting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/inventory_system
JWT_SECRET=your_jwt_secret_key
```

### Frontend Setup
```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

### Start Frontend Server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173` (or next available port)

## 🔗 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `GET /api/products/:id` - Get single product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale
- `GET /api/sales/:id` - Get single sale
- `PATCH /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale

### Purchases
- `GET /api/purchases` - Get all purchases
- `POST /api/purchases` - Create new purchase
- `GET /api/purchases/:id` - Get single purchase
- `PATCH /api/purchases/:id` - Update purchase
- `DELETE /api/purchases/:id` - Delete purchase

### Analytics
- `GET /api/analytics/sales` - Sales analytics
- `GET /api/analytics/inventory` - Inventory analytics
- `GET /api/analytics/customers` - Customer analytics
- `GET /api/analytics/top-products` - Top performing products
- `GET /api/analytics/suppliers` - Supplier analytics
- `GET /api/analytics/profit` - Profit analytics

### Predictions
- `GET /api/predictions/demand-forecast` - Demand forecasting
- `GET /api/predictions/inventory-optimization` - Inventory optimization
- `GET /api/predictions/sales-prediction` - Sales prediction

## 🤖 ML Features

### Demand Forecasting
- Historical sales data analysis
- Moving average predictions
- Seasonal trend detection
- Confidence interval calculations
- Reorder point recommendations

### Inventory Optimization
- Low stock item identification
- Priority-based recommendations
- Sales velocity analysis
- Safety stock calculations
- Automated reorder suggestions

### Sales Prediction
- Growth rate analysis
- Trend detection
- Seasonal factor application
- Revenue forecasting
- Order volume predictions

## 📊 Data Models

### Product
```javascript
{
  productName: String,
  categoryId: ObjectId,
  supplierId: ObjectId,
  description: String,
  price: Number,
  costPrice: Number,
  quantity: Number,
  status: String // active/inactive
}
```

### Sale
```javascript
{
  customerId: ObjectId,
  productId: ObjectId,
  quantity: Number,
  unitPrice: Number,
  totalAmount: Number,
  saleDate: Date,
  invoiceNo: String,
  status: String // Pending/Completed/Cancelled
}
```

### Purchase
```javascript
{
  supplierId: ObjectId,
  productId: ObjectId,
  quantity: Number,
  unitCost: Number,
  totalCost: Number,
  purchaseDate: Date,
  refNo: String,
  status: String // Pending/Received/Cancelled
}
```

## 🔧 Configuration

### Environment Variables
- `PORT`: Backend server port (default: 5000)
- `MONGO_URL`: MongoDB connection string
- `JWT_SECRET`: JWT secret key for authentication

### Database Setup
1. Ensure MongoDB is running
2. Create a database named `inventory_system`
3. The application will automatically create collections

## 🎯 Usage

1. **Register/Login**: Create an account or login to existing one
2. **Dashboard**: View real-time inventory metrics and KPIs
3. **Product Management**: Add and manage products with categories
4. **Sales Management**: Record sales and track revenue
5. **Purchase Management**: Manage purchase orders and stock
6. **Analytics**: View comprehensive reports and insights
7. **Predictions**: Get AI-powered forecasts and recommendations

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Secure API endpoints

## 🚀 Future Enhancements

- Real-time notifications
- Advanced ML models integration
- Mobile app development
- Multi-warehouse support
- Advanced reporting features
- API rate limiting
- Audit logging
- Role-based permissions

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and queries, please open an issue in the repository.

---

**Note**: This system is designed to be scalable and can be easily extended with additional features and integrations.

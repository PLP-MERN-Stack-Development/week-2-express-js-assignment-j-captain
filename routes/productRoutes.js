const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');
const app = express();

// Custom error classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}


//MIDDLEWARE IMPLEMENTATION

// Custom logger middleware 
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// JSON parsing middleware 
app.use(express.json());

// Authentication middleware 
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key']; // Use standard header name
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return next(new UnauthorizedError('Invalid or missing API key'));
  }
  next();
};

// Validation middleware
const validateProduct = (req, res, next) => {
  const product = req.body;
  const errors = [];

  if (!product.name) errors.push('Name is required');
  if (!product.price || isNaN(product.price) || product.price <= 0) 
    errors.push('Price must be a positive number');
  if (!product.category) errors.push('Category is required');
  if (product.inStock === undefined || product.inStock === null) 
    errors.push('inStock status is required');

  if (errors.length > 0) {
    return next(new ValidationError(errors.join(', ')));
  }
  
  next();
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


//ERROR HANDLING MIDDLEWARE 
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR: ${err.message}`);
  
  const status = err.statusCode || 500;
  res.status(status).json({
    error: {
      message: err.message,
      type: err.name || 'InternalServerError',
      status
    }
  });
});


// ROUTES IMPLEMENTATION

//Authentication Requirement/Protecting all routes
router.use(authenticate);

// Root route 1
router.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// Root route 2
router.get('/2', (req, res) => {
  res.send('Hello World');
});

// GET /api/products - List all products with filtering and pagination
router.get('/products', asyncHandler(async (req, res) => {
  let query = {};
  
  // Category filtering
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const products = await Product.find(query).skip(skip).limit(limit);
  const total = await Product.countDocuments(query);
  
  res.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    products
  });
}));

// GET /api/products/search - Search products
router.get('/products/search', asyncHandler(async (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (!query) throw new ValidationError('Missing search query');
  
  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  });
  
  res.json(products);
}));

// GET /api/products/stats - Product statistics
router.get('/products/stats', asyncHandler(async (req, res) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        inStock: { 
          $sum: { 
            $cond: [{ $eq: ['$inStock', true] }, 1, 0] 
          } 
        }
      }
    }
  ]);
  
  res.json(stats);
}));

// GET /api/products/:id - Get product by ID
router.get('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findOne({ id: req.params.id });
  if (!product) throw new NotFoundError('Product not found');
  res.json(product);
}));

// POST /api/products - Create new product
router.post('/products', authenticate, validateProduct, asyncHandler(async (req, res) => {
  const newProduct = new Product({
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    category: req.body.category,
    inStock: req.body.inStock !== undefined ? req.body.inStock : true
  });

  const savedProduct = await newProduct.save();
  res.status(201).json(savedProduct);
}));

// PUT /api/products/:id - Update product
router.put('/products/:id', authenticate, validateProduct, asyncHandler(async (req, res) => {
  const updatedProduct = await Product.findOneAndUpdate(
    { id: req.params.id },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        category: req.body.category,
        inStock: req.body.inStock
      }
    },
    { new: true }
  );

  if (!updatedProduct) throw new NotFoundError('Product not found');
  res.json(updatedProduct);
}));

// DELETE /api/products/:id - Delete product
router.delete('/products/:id', authenticate, asyncHandler(async (req, res) => {
  const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
  if (!deletedProduct) throw new NotFoundError('Product not found');
  res.status(200).send();
}));

module.exports = router;
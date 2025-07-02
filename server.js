require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/productDB'; // Local MongoDB without auth

app.use(express.json());
app.use('/api', productRoutes);

// In-memory database with initial products
const initialProducts = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  },
  {
    id: '4',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones',
    price: 199,
    category: 'electronics',
    inStock: true
  },
  {
    id: '5',
    name: 'Blender',
    description: 'High-speed professional blender',
    price: 89,
    category: 'kitchen',
    inStock: true
  },
  {
    id: '6',
    name: 'Desk Lamp',
    description: 'LED adjustable brightness lamp',
    price: 35,
    category: 'home',
    inStock: true
  },
  {
    id: '7',
    name: 'Yoga Mat',
    description: 'Non-slip eco-friendly mat',
    price: 25,
    category: 'fitness',
    inStock: false
  },
  {
    id: '8',
    name: 'Smart Watch',
    description: 'Health tracking and notifications',
    price: 249,
    category: 'electronics',
    inStock: true
  },
  {
    id: '9',
    name: 'Cookware Set',
    description: '10-piece non-stick kitchen set',
    price: 120,
    category: 'kitchen',
    inStock: true
  },
  {
    id: '10',
    name: 'Novel - "The Silent Sky"',
    description: 'Bestselling fiction book',
    price: 14,
    category: 'books',
    inStock: true
  },
  {
    id: '11',
    name: 'Backpack',
    description: 'Water-resistant with laptop compartment',
    price: 45,
    category: 'accessories',
    inStock: false
  },
  {
    id: '12',
    name: 'Plant Pot',
    description: 'Ceramic self-watering planter',
    price: 22,
    category: 'home',
    inStock: true
  },
  {
    id: '13',
    name: 'Gaming Mouse',
    description: 'RGB customizable buttons',
    price: 59,
    category: 'electronics',
    inStock: true
  },
  {
    id: '14',
    name: 'Denim Jacket',
    description: 'Classic blue denim jacket',
    price: 65,
    category: 'clothing',
    inStock: true
  },
  {
    id: '15',
    name: '4K Action Camera',
    description: 'Waterproof adventure camera',
    price: 299,
    category: 'electronics',
    inStock: true
  },
  {
    id: '16',
    name: 'Suitcase',
    description: 'Hard-shell spinner luggage',
    price: 180,
    category: 'travel',
    inStock: true
  },
  {
    id: '17',
    name: 'Sci-Fi Movie Collection',
    description: '10 classic sci-fi films',
    price: 39,
    category: 'movies',
    inStock: false
  },
  {
    id: '18',
    name: 'Standing Desk',
    description: 'Height-adjustable workstation',
    price: 250,
    category: 'furniture',
    inStock: true
  },
  {
    id: '19',
    name: 'Air Fryer',
    description: 'Digital touchscreen air fryer',
    price: 99,
    category: 'kitchen',
    inStock: true
  },
  {
    id: '20',
    name: 'Running Shoes',
    description: 'Lightweight cushioned shoes',
    price: 85,
    category: 'footwear',
    inStock: true
  },
  {
    id: '21',
    name: 'Graphic Tablet',
    description: 'Pressure-sensitive drawing tablet',
    price: 149,
    category: 'computers',
    inStock: true
  },
  {
    id: '22',
    name: 'Leather Wallet',
    description: 'Genuine leather bifold wallet',
    price: 45,
    category: 'accessories',
    inStock: true
  },
  {
    id: '23',
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker',
    price: 79,
    category: 'electronics',
    inStock: false
  },
  {
    id: '24',
    name: 'Dumbbell Set',
    description: 'Adjustable weight set',
    price: 120,
    category: 'fitness',
    inStock: true
  },
  {
    id: '25',
    name: 'Cotton T-Shirt',
    description: 'Organic cotton crew neck',
    price: 22,
    category: 'clothing',
    inStock: true
  },
  {
    id: '26',
    name: 'External SSD',
    description: '1TB portable solid state drive',
    price: 129,
    category: 'computers',
    inStock: true
  },
  {
    id: '27',
    name: 'Cookbook',
    description: '100 vegetarian recipes',
    price: 18,
    category: 'books',
    inStock: true
  },
  {
    id: '28',
    name: 'Puzzle Game',
    description: '3D wooden brain teaser',
    price: 15,
    category: 'toys',
    inStock: true
  },
  {
    id: '29',
    name: 'Sunglasses',
    description: 'UV protection polarized lenses',
    price: 55,
    category: 'accessories',
    inStock: false
  },
  {
    id: '30',
    name: 'Desk Organizer',
    description: 'Multi-compartment storage',
    price: 28,
    category: 'office',
    inStock: true
  }
];

// Connect to MongoDB and seed initial data
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log();//To print an empty space before printing my connection message
  console.log('Captain Your Now connected to MongoDB.🤞🙌 Congraulations 🫅🤴');
  
  // Seed initial data if collection is empty
  const Product = require('./models/Product');
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(initialProducts);
    console.log();
    console.log('Initial products seeded successfully!!! You are Good to go.🤺⛷️🦾');
  }
}).catch(err => console.error('MongoDB connection Unsuccesful 😅🤣.Sorry😒😒'));

app.listen(PORT, () => {
  console.log();
  console.log(`Server is running on http://localhost:${PORT} Hureeeeeeeee!!! 🙌🙌🙌 `);
});
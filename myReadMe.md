**MWANGI JOSPHAT KARANJA PLP MERN STACK WEEK 2 ASSIGNMENT: PRODUCT-APP**
 
**Product-app API - Node.js, Express & MongoDB**  
A RESTful API for managing products with authentication, built with:  
- **Node.js** (My runtime environment for express js)
- **Express**  
- **MongoDB**  (My database) 
- **Postman** (Testing for testing my API endpoints)  


**📝 GitHub Classroom Submission Guide**  
**1. Accept the Assignment**  
- Click the GitHub Classroom invitation link provided by your instructor.  
- A personal repository will be created for you.  

**2. Clone Your Repository**  
 
git clone https://github.com/your-username/product-app.git
cd product-app
 

**3. Add Project Files**  
Ensure your repository includes:  
- **Project Code**:  
  - `server.js`  
  - `routes/` (e.g., `productRoutes.js`)  
  - `models/` (e.g., `Product.js`)  
  - `middleware/` (`in my productRoutes.js`) 
- **Documentation**:  
 
  - `.env` (template for environment variables)  

  
**1. Install Dependencies**  

pnpm add body-parser@^2.2.0 dotenv@^17.0.1 express@^5.1.0 mongoose@^8.16.1 uuid@^11.1.0
 

**2. Set Up Environment Variables**  
1.In the .env`  
2. Update the values:  
   
   MONGODB_URI=mongodb://localhost:27017/productDB
   API_KEY=0d60f1983183374202ad3a380a50c582759ec122889968aeeb1c1a18e04ed9c1 #My secret API key
   PORT=3000
  

**3. Run the Server**  
 
npm run dev  # Development
npm start    # Production
 
**Server URL**: `http://localhost:3000`  



**📡 API Endpoints**  
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| `POST` | `/api/products` | Create a product | ✅ `x-api-key` |
| `GET`  | `/api/products` | List all products | ❌ |
| `GET`  | `/api/products/:id` | Get a product by ID | ❌ |
| `PUT`  | `/api/products/:id` | Update a product | ✅ `x-api-key` |
| `DELETE` | `/api/products/:id` | Delete a product | ✅ `x-api-key` |

---

 **🔐 Authentication**  
- Protected routes require an `x-api-key` header.  
 

**Examples** 
Create Product (POST) 
Request:  
 
{
  "name": "Wireless Mouse",
  "price": 29.99,
  "category": "Electronics",
  "inStock": true
} 

Response:  
 
{
  "_id": "65a1b2c3d4e5f67890123456",
  "name": "Wireless Mouse",
  "price": 29.99,
  "category": "Electronics",
  "inStock": true
}
 

 
 File Structure  
 
product-app/
├── server.js          # Entry point
├── routes/            # API routes
│   └── productRoutes.js
|   |__Middlewares
├── models/            # MongoDB models
│   └── Product.js
|     
│    
├── .env               # Environment template
└── README.md          # Documentation
 
 

 Troubleshooting  
 
 MongoDB Not Connecting - Check if MongoDB is running (`mongod --version`). |
 Missing `x-api-key` - Verify the header in requests. |
 Autograding Failures -  Ensure all required files are pushed to GitHub. |

 
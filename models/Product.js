const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => uuidv4() // Using uuidv4 for ID generation
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    inStock: { type: Boolean, required: true }
});

module.exports = mongoose.model('Product', productSchema);
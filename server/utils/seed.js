const Product = require('../models/ProductModel');

const seedProducts = async () => {
    // Reset the database
    await Product.deleteMany({});
    const demoProducts = [
        {
            name: 'Americano',
            price: 3.99,
            description: 'Rich and bold Americano coffee.',
            category: 'Beverages',
            image: 'https://example.com/classic-coffee.jpg'
        },
        {
            name: 'Espresso Shot',
            price: 2.50,
            description: 'Strong and energizing espresso.',
            category: 'Beverages',
            image: 'https://example.com/espresso.jpg'
        },
        {
            name: 'Caramel Latte',
            price: 4.75,
            description: 'Creamy latte with sweet caramel flavor.',
            category: 'Beverages',
            image: 'https://example.com/caramel-latte.jpg'
        }
    ];

    await Product.insertMany(demoProducts);
    console.log('✅ Products seeded!');
};

module.exports = seedProducts;
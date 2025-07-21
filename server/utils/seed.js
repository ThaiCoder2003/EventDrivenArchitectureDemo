const Product = require('../models/ProductModel');

const seedProducts = async () => {
    // Reset the database
    try {
        const count = await Product.countDocuments();
        if (count > 0) {
            console.log('⚠️ Products already exist. Skipping seeding.');
            return;
        }
        const demoProducts = [
            {
                name: 'Americano',
                price: 3.99,
                description: 'Rich and bold Americano coffee.',
                category: 'Beverages',
                image: 'americano.jpg'
            },
            {
                name: 'Espresso Shot',
                price: 2.50,
                description: 'Strong and energizing espresso.',
                category: 'Beverages',
                image: 'espresso.jpeg'
            },
            {
                name: 'Caramel Latte',
                price: 4.75,
                description: 'Creamy latte with sweet caramel flavor.',
                category: 'Beverages',
                image: 'caramel-latte.jpg'
            }
        ];
    
        await Product.insertMany(demoProducts);
        console.log('✅ Products seeded!');
    } catch (error) {
        console.error('❌ Error seeding products:', error);
    }
};

module.exports = seedProducts;
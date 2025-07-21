import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure this points to your Axios setup
 // your axios instance

const ProductPage = () => {
    const { id } = useParams(); // gets the :id from URL
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch product details from the server
        axios.get(`/product/${id}`, { withCredentials: true })
            .then(res => {
                console.log('Product details fetched successfully');
                setProduct(res.data);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load product details.');
            });
    }, [id]);

    // Function to handle adding product to cart can be added here
    function handleAddToCart() {
        axios.post('/transaction/add-to-cart', {
            productId: id,
            quantity
        }, { withCredentials: true })
            .then(res => {
                console.log('Product added to cart successfully');
                navigate('/cart'); // Redirect to cart after adding
                // Optionally redirect or show success message
            })
            .catch(err => {
                console.error(err);
                setError('Failed to add product to cart.');
            });
    }
    

    if (error) return <div>{error}</div>;
    if (!product) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                    src={`/images/${product.image}`}
                    alt={product.name}
                    className="w-64 h-64 object-cover rounded-md border"
                />
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="mb-2">
                        <span className="font-semibold">Category:</span>{' '}
                        {product.category && product.category.trim() !== '' ? product.category : 'Uncategorized'}
                    </p>
                    <p className="text-xl font-semibold text-green-700 mb-4">
                        ${product.price}
                    </p>
                    <div className="flex items-center gap-4">
                        <label htmlFor="quantity" className="font-medium">Quantity:</label>
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                            className="w-20 px-2 py-1 border rounded"
                        />
                        <button
                            onClick={ handleAddToCart }
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
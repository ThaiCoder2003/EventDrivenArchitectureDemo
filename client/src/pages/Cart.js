import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // your axios instance with token

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch cart data from the server
        axios.get('/transaction/cart', { withCredentials: true })
            .then(res => {
                setCart(res.data);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load cart.');
            });
    }, []);

    function handleCheckout() {
        // API call to handle checkout can be added here
        axios.post('/transaction/purchase', {}, { withCredentials: true })
            .then(res => {
                console.log('Checkout successful');
                // Optionally redirect or clear cart
                setCart({ products: [], total: 0 });
            })
            .catch(err => {
                console.error(err);
                setError('Checkout failed.');
            });
    }

    function handleRemoveFromCart(productId) {
        // API call to remove item from cart
        axios.post('/transaction/remove-from-cart', { productId }, { withCredentials: true })
            .then(res => {
                console.log('Item removed from cart successfully');
                // Update cart state after removal
                setCart(prevCart => ({
                    ...prevCart,
                    products: prevCart.products.filter(item => item.product._id !== productId),
                    total: prevCart.total - res.data.removedPrice // Assuming the response contains the removed price
                }));
            })
            .catch(err => {
                console.error(err);
                setError('Failed to remove item from cart.');
            });
    }

    if (error) return <div>{error}</div>;
    if (!cart) return <div>Loading cart...</div>;

    // Render cart page UI
    return (
        <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 600, fontSize: 18, marginRight: 16 }}>← Back to Shop</Link>
            </div>
            <h2 style={{ margin: '12px 0 12px 0', fontSize: 28, fontWeight: 700, color: '#222', textAlign: 'center' }}>Your Cart</h2>
            {cart.products.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', fontSize: 20 }}>
                    <span role="img" aria-label="empty">🛒</span>
                    <div>Your cart is empty.</div>
                    <Link to="/" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500, marginTop: 16, display: 'inline-block' }}>Browse products</Link>
                </div>
            ) : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5' }}>
                                <th style={{ textAlign: 'left', padding: 12, fontWeight: 600 }}>Product</th>
                                <th style={{ textAlign: 'center', padding: 12, fontWeight: 600 }}>Quantity</th>
                                <th style={{ textAlign: 'right', padding: 12, fontWeight: 600 }}>Price</th>
                                <th style={{ padding: 12 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.products.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: 12 }}>
                                        <div style={{ fontWeight: 500 }}>{item.product.name}</div>
                                        <div style={{ color: '#888', fontSize: 14 }}>{item.product.description}</div>
                                    </td>
                                    <td style={{ textAlign: 'center', padding: 12 }}>{item.quantity}</td>
                                    <td style={{ textAlign: 'right', padding: 12 }}>${(item.product.price * item.quantity).toFixed(2)}</td>
                                    <td style={{ textAlign: 'center', padding: 12 }}>
                                        <button
                                            onClick={() => handleRemoveFromCart(item.product._id)}
                                            style={{
                                                background: '#ff5252',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 4,
                                                padding: '6px 12px',
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                            title="Remove from cart"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24 }}>
                        <div style={{ fontSize: 20, fontWeight: 700 }}>
                            Total: <span style={{ color: '#1976d2' }}>${cart.totalPrice}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            style={{
                                background: '#1976d2',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '12px 32px',
                                fontSize: 18,
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px #1976d220'
                            }}
                        >
                            Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
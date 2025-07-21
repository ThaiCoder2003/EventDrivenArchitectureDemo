import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products from the server
        axios.get('/product', { withCredentials: true })
            .then(res => {
                setProducts(res.data);
            })
            .catch(err => {
                console.error(err);
                alert('Failed to load products.');
            });
    }, []);
    return (
        <div className="p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-center">🛍️ Product List</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
            {products.map(p => (
                <li
                    key={p._id}
                    className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-between transition hover:shadow-xl"
                >
                    <Link to={`/product/${p._id}`} className="flex flex-col items-center w-full h-full">
                        <img
                            src={`/images/${p.image}`}
                            alt={p.name}
                            className="w-40 h-40 object-cover rounded-lg mb-4"
                            onError={(e) => (e.target.style.display = 'none')}
                        />
                        <h3 className="text-xl font-semibold text-center">{p.name}</h3>
                        <p className="text-sm text-gray-500 text-center mb-2">{p.description}</p>
                        <p className="text-md text-emerald-600 font-bold">${p.price}</p>
                    </Link>
                </li>
            ))}
            </ul>
        </div>
    );
};

export default Home;
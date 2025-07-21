import React, { useState } from 'react';
import axios from 'axios';// Make sure this points to your Axios setup
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/user/login', {
                email,
                password
            }, { withCredentials: true });

            console.log('Login successful:', res.data);
            // Redirect to home or profile page after successful login
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #ece9ff 0%, #b7caff 100%)'
        }}>
            <div style={{
                background: '#fff',
                padding: '2.5rem 2rem',
                borderRadius: '16px',
                boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
                minWidth: '340px',
                maxWidth: '90vw'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    color: '#2d3a4b',
                    letterSpacing: '1px'
                }}>Sign In</h2>
                {error && (
                    <div style={{
                        background: '#ffeaea',
                        color: '#d32f2f',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.97rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '0.85rem 1rem',
                            border: '1px solid #cfd8dc',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border 0.2s'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '0.85rem 1rem',
                            border: '1px solid #cfd8dc',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border 0.2s'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '0.9rem 0',
                            background: 'linear-gradient(90deg, #5b7fff 0%, #3a53c5 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '1.08rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(91,127,255,0.08)',
                            transition: 'background 0.2s'
                        }}
                    >
                        Login
                    </button>
                </form>
                <p style={{
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    color: '#6b7a90',
                    fontSize: '0.98rem'
                }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#3a53c5', textDecoration: 'underline' }}>
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
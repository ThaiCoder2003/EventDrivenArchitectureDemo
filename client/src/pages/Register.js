import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/user/register', {
            email,
            password,
            confirmPassword
            }, { withCredentials: true });

            console.log('Success:', res.data);
            // Redirect to login or profile page after successful registration
            navigate('/login');
        } catch (err) {
            console.error('FAIL', err);
            setError(err.response?.data?.error || 'Registration failed');
            // Optionally, you can show an alert or toast notification
            alert('FAIL: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f6fa'
        }}>
            <div style={{
                background: '#fff',
                padding: '2rem 2.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                minWidth: '340px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#222' }}>Register</h2>
                {error && (
                    <div style={{
                        background: '#ffeaea',
                        color: '#d8000c',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '1rem',
                        fontSize: '0.97rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '1rem'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '1rem'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '1rem'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '0.75rem',
                            borderRadius: '6px',
                            background: '#007bff',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            marginTop: '0.5rem'
                        }}
                    >
                        Register
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.97rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
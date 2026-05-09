import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const res = await api.post('/auth/login', { email: formData.email, password: formData.password });
                login(res.data);
            } else {
                await api.post('/auth/register', formData);
                setIsLogin(true); // switch to login after successful register
                setFormData({ ...formData, password: '' }); // keep email, clear password
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : 'Invalid credentials or server error');
            setError(errorMessage);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleChange} />
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleChange} />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" className="form-input" required value={formData.password} onChange={handleChange} />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                                <option value="MEMBER">Member</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    )}
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center mt-4 text-muted">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }} 
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiFolder, FiCheckSquare, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <nav className="navbar">
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--primary)' }}>Team</span>Task
            </div>
            <div className="nav-links">
                <Link to="/" className={`nav-link flex items-center gap-2 ${location.pathname === '/' ? 'active' : ''}`}>
                    <FiHome /> Dashboard
                </Link>
                <Link to="/projects" className={`nav-link flex items-center gap-2 ${location.pathname.startsWith('/projects') ? 'active' : ''}`}>
                    <FiFolder /> Projects
                </Link>
                <Link to="/tasks" className={`nav-link flex items-center gap-2 ${location.pathname.startsWith('/tasks') ? 'active' : ''}`}>
                    <FiCheckSquare /> Tasks
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.name}</span>
                    <span className={`badge ${user.role === 'ADMIN' ? 'badge-progress' : 'badge-todo'}`}>{user.role}</span>
                </div>
                <button className="btn btn-secondary flex items-center gap-2" onClick={handleLogout} title="Logout">
                    <FiLogOut />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

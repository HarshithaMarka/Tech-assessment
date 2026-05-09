import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({
                        id: localStorage.getItem('userId'),
                        email: decoded.sub,
                        role: localStorage.getItem('userRole'),
                        name: localStorage.getItem('userName'),
                    });
                } else {
                    logout();
                }
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userName', userData.name);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

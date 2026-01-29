import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            return (storedUser && token) ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error('Auth parse error:', error);
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Just verify token/user sync if needed, otherwise initialization is enough
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { data, token } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data || response.data.data));

            setUser(data || response.data.data);
            return { success: true, user: data || response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { data, token } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data || response.data.data));

            setUser(data || response.data.data);
            return { success: true, user: data || response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (userData) => {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isFarmer: user?.role === 'farmer'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

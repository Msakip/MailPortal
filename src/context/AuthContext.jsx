import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check localStorage for existing auth
        const storedAuth = localStorage.getItem('mailportal_auth');
        if (storedAuth) {
            const authData = JSON.parse(storedAuth);
            setIsAuthenticated(true);
            setUser(authData.user);
        }
    }, []);

    const login = (email, password) => {
        // Demo mode - accept any credentials
        const userData = { email, name: email.split('@')[0] };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('mailportal_auth', JSON.stringify({ user: userData }));
        return true;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('mailportal_auth');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}


import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    signupUser,
    loginUser,
    logoutUser,
    getCurrentUser
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check existing login session
    const checkAuth = async () => {
        try {
            const response = await getCurrentUser();
            setUser(response.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // Signup
    const signup = async (userData) => {
        const response = await signupUser(userData);
        setUser(response.user);
        return response;
    };

    // Login
    const login = async (userData) => {
        const response = await loginUser(userData);
        setUser(response.user);
        return response;
    };

    // Logout
    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        signup,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};

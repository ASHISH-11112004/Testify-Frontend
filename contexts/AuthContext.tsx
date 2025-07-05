import { createContext, useEffect, useState } from "react";

// User type
type User = {
    user: string | null;
    walletAddress: string | null;
    userId: string | null;
    email: string | null;
};

// Context type
type AuthContextType = {
    user: User | null;
    isLoggedIn: boolean;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
};


export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // Load from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setIsLoggedIn(true);
        }
    }, []);


    const login = (user: User, token: string) => {
        setUser(user);
        setToken(token);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    };


    const logout = () => {
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

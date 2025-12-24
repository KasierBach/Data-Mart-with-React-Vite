import React, { createContext, useContext, useState, useEffect } from "react";
// Importing App-specific types might be circular if not careful. For now, local types.

import { Role } from "../types";
import { API_ENDPOINTS } from "../config/api";

// export type Role = ... (Removed, utilizing shared type)

interface User {
    username: string;
    role: Role;
    name: string;
    email?: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (user: User) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored user ? (Mock persistence or real session)
        // For now, let's just default to null or check localStorage if we want simple persistence
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch { }
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            // Call our new Express API
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (data.success) {
                const loggedUser = data.user;
                setUser(loggedUser);
                localStorage.setItem('user', JSON.stringify(loggedUser));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Login error:", error);
            // Fallback for "Minimal" if server is not running yet?
            // No, strictly rely on server as per plan.
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

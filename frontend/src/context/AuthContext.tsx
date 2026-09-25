import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import type { User } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (payload: {
    name: string;
    email_or_phone: string;
    password: string;
    preferred_language?: string;
    state?: string;
    district?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("krishimitra_token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("krishimitra_token");
      if (storedToken) {
        try {
          const res = await api.getCurrentUser();
          if (res.data?.user) {
            setUser(res.data.user);
            // Sync user preferred language if set
            if (res.data.user.preferred_language) {
              localStorage.setItem("krishimitra_lang", res.data.user.preferred_language);
            }
          }
        } catch (err) {
          // Token expired or invalid
          localStorage.removeItem("krishimitra_token");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await api.login(identifier, password);
    if (res.data) {
      localStorage.setItem("krishimitra_token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.preferred_language) {
        localStorage.setItem("krishimitra_lang", res.data.user.preferred_language);
      }
    }
  };

  const signup = async (payload: {
    name: string;
    email_or_phone: string;
    password: string;
    preferred_language?: string;
    state?: string;
    district?: string;
  }) => {
    const res = await api.signup(payload);
    if (res.data) {
      localStorage.setItem("krishimitra_token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.preferred_language) {
        localStorage.setItem("krishimitra_lang", res.data.user.preferred_language);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("krishimitra_token");
    setToken(null);
    setUser(null);
  };

  const updateUser = async (updatedData: Partial<User>) => {
    const res = await api.updateProfile(updatedData);
    if (res.data?.user) {
      setUser(res.data.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

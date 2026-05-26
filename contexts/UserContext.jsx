import { createContext, useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

export const UserContext = createContext();

export function UserProvider({children}) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = `${process.env.EXPO_PUBLIC_URL_BACKEND}/api/users`;

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('token');

                if (storedToken) {
                    await loadUserFromToken(storedToken);
                } else {
                    setUser(null);
                }
                setIsLoading(false);
            } catch (err) {

                if (err.response?.status === 403 || err.response?.status === 401) {
                    await SecureStore.deleteItemAsync('token');
                    setUser(null);
                    setToken("");
                    return;
                }
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    async function login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { user: loggedUser, token: jwtToken } = response.data;

            setUser(loggedUser);
            setToken(jwtToken);
            await SecureStore.setItemAsync('token', jwtToken);

            return loggedUser;
            } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            throw err;
        }
    }

    async function register(username, firstName, lastName ,email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, { username, firstName, lastName ,email, password });
            const { user: loggedUser, token: jwtToken } = response.data;

            setUser(loggedUser);
            setToken(jwtToken);
            await SecureStore.setItemAsync('token', jwtToken);

            return loggedUser;
            } catch (err) {
            console.error("Register error:", err.response?.data || err.message);
            throw err;
        }
    }

    async function loadUserFromToken (storedToken) {
        try {
            const response = await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${storedToken}` }});

            setUser(response.data);
            setToken(storedToken);
            } catch (err) {
                console.error("Auto login failed:", err);
                await SecureStore.deleteItemAsync('token');
                setUser(null);
                setToken("");
            throw err;
            }
    }

    async function logout() {
        await SecureStore.deleteItemAsync('token');
        setUser(null);
        setToken("");
    }

    async function updateUser(id ,updatedUser) {
        try {
            const response = await axios.put(`${API_URL}/${id}`, updatedUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            return response.data;
            } catch (err) {
            console.error("Update user error:", err.response?.data || err.message);
            throw err;
        }
    }

    async function deleteAccount() {
        if (!user?.id) throw new Error("Utilisateur non connecté");
        try {
            await axios.delete(`${API_URL}/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(null);
            setToken("");
            } catch (err) {
            console.error("Delete account error:", err.response?.data || err.message);
            throw err;
        }
    }

    async function changePassword(currentPassword, newPassword) {
        if (!user?.id) throw new Error("Utilisateur non connecté");
        try {
            await axios.post(
                `${API_URL}/change-password`,
                { userId: user.id, currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            } catch (err) {
            console.error("Change password error:", err.response?.data || err.message);
            throw err;
        }
    }

    async function getUserInfo(userId) {
        try {
            const response = await axios.get(`${API_URL}/${userId}/public`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
            } catch (err) {
            console.error("No user information available:", err.response?.data || err.message);
            throw err;
        }
    }

    return (
        <UserContext.Provider 
        value= {
            {user,
            token,
            isLoading,
            login,
            register,
            logout,
            updateUser,
            deleteAccount,
            changePassword,
            getUserInfo,
        }}>
            {children}
        </UserContext.Provider>
    )
}
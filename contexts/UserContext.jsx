import { createContext, useState, useEffect } from "react";
import { api } from "../api/axiosInstance";
import * as SecureStore from 'expo-secure-store';

export const UserContext = createContext();

export function UserProvider({children}) {

    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('accessToken');

                if (storedToken) {
                    setAccessToken(storedToken);
                    await loadUserFromToken(storedToken);
                } else {
                    setUser(null);
                }
            } catch (err) {

                if (err.response?.status === 403 || err.response?.status === 401) {
                    await SecureStore.deleteItemAsync('accessToken');
                    setUser(null);
                    setAccessToken("");
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
            const response = await api.post(`/users/auth/login`, { email, password });
            const { user: loggedUser, accessToken: accessJwtToken, refreshToken : refreshJwtToken } = response.data;
            setUser(loggedUser);
            setAccessToken(accessJwtToken);
            await SecureStore.setItemAsync('accessToken', accessJwtToken);
            await SecureStore.setItemAsync('refreshToken', refreshJwtToken);

            return loggedUser;
            } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            throw err;
        }
    }

    async function register(username, firstName, lastName ,email, password) {
        try {
            const response = await api.post(`/users/auth/register`, { username, firstName, lastName ,email, password });
            const { user: loggedUser, accessToken: accessJwtToken, refreshToken : refreshJwtToken } = response.data;

            setUser(loggedUser);
            setAccessToken(accessJwtToken);
            await SecureStore.setItemAsync('accessToken', accessJwtToken);
            await SecureStore.setItemAsync('refreshToken', refreshJwtToken);

            return loggedUser;
            } catch (err) {
            console.error("Register error:", err.response?.data || err.message);
            throw err;
        }
    }

    async function loadUserFromToken() {
        try {
            const response = await api.get(`/users/me`);
            setUser(response.data);
        } catch (err) {
            await SecureStore.deleteItemAsync('accessToken');
            setUser(null);
        }
    }

    async function logout() {
        try {
            const refreshToken = await SecureStore.getItemAsync("refreshToken");

            await api.post(`/users/auth/logout`, { refreshToken });
        } catch (err) {
            console.error("Logout error:", err.response?.data || err.message);
        }
        
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        setUser(null);
        setAccessToken("");
    }

    async function updateUser(id ,updatedUser) {
        try {
            const response = await api.put(`/users/${id}`, updatedUser);
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
            await api.delete(`/users/${user.id}`);
            setUser(null);
            setAccessToken("");
            } catch (err) {
            console.error("Delete account error:", err.response?.data || err.message);
            throw err;
        }
    }

    async function changePassword(currentPassword, newPassword) {
        if (!user?.id) throw new Error("Utilisateur non connecté");
        try {
            await api.post(
                `/users/change-password`,
                { userId: user.id, currentPassword, newPassword },
            );
            } catch (err) {
            console.error("Change password error:", err.response?.data || err.message);
            throw err;
        }
    }

    async function getUserInfo(userId) {
        try {
            const response = await api.get(`/users/${userId}/public`);
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
            accessToken,
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
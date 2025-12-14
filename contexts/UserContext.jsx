import { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({children}) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");

    const API_URL = `${process.env.EXPO_PUBLIC_URL_BACKEND}/api/users`;

    async function login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { user: loggedUser, token: jwtToken } = response.data;

            setUser(loggedUser);
            setToken(jwtToken);

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

            return loggedUser;
            } catch (err) {
            console.error("Register error:", err.response?.data || err.message);
            throw err;
        }
    }

    async function logout() {
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

    return (
        <UserContext.Provider 
        value= {
            {user,
            token,
            login,
            register,
            logout,
            updateUser,
            deleteAccount,
            changePassword
        }}>
            {children}
        </UserContext.Provider>
    )
}
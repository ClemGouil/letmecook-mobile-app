import { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({children}) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");

    const API_URL = "http://192.168.1.13:8080/api/users";

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

    return (
        <UserContext.Provider value= {{user, token, login, register, logout}}>
            {children}
        </UserContext.Provider>
    )
}
import { createContext, useState, useEffect} from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser";

export const RecipeContext = createContext();

export function RecipeProvider({ children }) {

  const [publicRecipes, setPublicRecipes] = useState([]);
  const [privateRecipes, setPrivateRecipes] = useState([]);
  const [groupRecipes, setGroupRecipes] = useState([]);

  const { user, token } = useUser();

  useEffect(() => {
    if (user) {
      loadPrivateRecipes(user.id);
    }
  }, [user]);

  const API_URL = "http://192.168.1.82:8080/api";

  async function loadPublicRecipes(userId) {
    try {
      const response = await axios.get(`${API_URL}/recipes/public/${userId}`);
      setPublicRecipes(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des recettes publiques:", err);
    }
  }

  async function loadPrivateRecipes(userId) {
    try {
      const response = await axios.get(`${API_URL}/recipes/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrivateRecipes(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des recettes privées:", err);
    }
  }

  async function loadGroupRecipes(groupId) {
    try {
      const response = await axios.get(`${API_URL}/group-recipes/${groupId}/recipes`);
      setGroupRecipes(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des recettes de groupe:", err);
    }
  }

  return (
    <RecipeContext.Provider
      value={{
        publicRecipes,
        privateRecipes,
        groupRecipes,
        loadPublicRecipes,
        loadPrivateRecipes,
        loadGroupRecipes
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}
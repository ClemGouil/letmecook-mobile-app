import { createContext, useState, useEffect} from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser";

export const RecipeContext = createContext();

export function RecipeProvider({ children }) {

  const [publicRecipes, setPublicRecipes] = useState([]);
  const [privateRecipes, setPrivateRecipes] = useState([]);
  const [groupRecipes, setGroupRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);

  const { user, token } = useUser();

  useEffect(() => {
    if (user) {
      loadPrivateRecipes(user.id);
      loadIngredients();
      loadUnits();
    }
  }, [user]);

  const API_URL = "http://192.168.1.13:8080/api";

  async function loadPublicRecipes(userId) {
    try {
      const response = await axios.get(`${API_URL}/recipes/public/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const response = await axios.get(`${API_URL}/group-recipes/${groupId}/recipes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroupRecipes(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des recettes de groupe:", err);
    }
  }

  async function loadIngredients() {
    try {
      const response = await axios.get(`${API_URL}/ingredients`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setIngredients(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des ingrédients:", err);
    }
  }

  async function loadUnits() {
    try {
      const response = await axios.get(`${API_URL}/units`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setUnits(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des unités:", err);
    }
  }

  async function addRecipe(dto) {
    try {
      const res = await axios.post(`${API_URL}/recipes`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrivateRecipes(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function updateRecipe(id, dto) {
    try {
      const response = await axios.put(`${API_URL}/recipes/${id}`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = response.data;
      setPrivateRecipes(
        prev => prev.map(recipe => (recipe.id === updated.id ? updated : recipe))
      );
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function deleteRecipe(id) {
    try {
      await axios.delete(`${API_URL}/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrivateRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function addIngredientToRecipe(dto) {
    try {
      const response = await axios.post(`${API_URL}/recipe-ingredients`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newIngredient = response.data;

      setPrivateRecipes((prevRecipe) =>
        prevRecipe.map((recipe) => {
          if (recipe.id === dto.recipeId) {
            return {
              ...recipe,
              ingredients: [...recipe.ingredients, newIngredient],
            };
          }
          return recipe;
        })
      );

      return newIngredient;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function addInstructionToRecipe(dto) {
    try {
      const response = await axios.post(`${API_URL}/recipe-instructions`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newInstruction = response.data;

      setPrivateRecipes((prevRecipe) =>
        prevRecipe.map((recipe) => {
          if (recipe.id === dto.recipeId) {
            return {
              ...recipe,
              instructions: [...recipe.instructions, newInstruction],
            };
          }
          return recipe;
        })
      );

      return newInstruction;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function uploadImage(fileUri) {
    try {
      const filename = fileUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: filename,
        type,
      });

      const response = await axios.post(`${API_URL}/images/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.imageUrl;
    } catch (err) {
      console.error("Erreur lors de l'upload de l'image :", err);
      throw err;
    }
  }

  return (
    <RecipeContext.Provider
      value={{
        publicRecipes,
        privateRecipes,
        groupRecipes,
        ingredients,
        units,
        loadPublicRecipes,
        loadPrivateRecipes,
        loadGroupRecipes,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        addIngredientToRecipe,
        addInstructionToRecipe,
        uploadImage,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}
import { createContext, useState, useEffect} from "react";
import { api } from "../api/axiosInstance";
import { useUser } from "../hooks/useUser";

export const RecipeContext = createContext();

export function RecipeProvider({ children }) {

  const [publicRecipes, setPublicRecipes] = useState([]);
  const [privateRecipes, setPrivateRecipes] = useState([]);
  const [groupRecipes, setGroupRecipes] = useState([]);
  const [units, setUnits] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadPrivateRecipes(user.id);
      loadUnits();
    }
  }, [user]);

  async function loadPublicRecipes(userId, query = null, limit = 5, offset = 0, ingredientIds = [], append = false) {
    const safeIngredientIds = ingredientIds?.length ? ingredientIds : undefined;
    try {
      const response = await api.get(`/recipes/public/${userId}`, {
        params: {
          query,
          ingredientIds: safeIngredientIds,
          minMatch: safeIngredientIds ? 1 : undefined,
          limit,
          offset,
        },
      });

      const newData = response.data;

      setPublicRecipes(prev =>
        append ? [...prev, ...newData] : newData
      );
    } catch (err) {
      console.error("Erreur lors du chargement des recettes publiques:", err);
    }
  }

  async function loadPrivateRecipes(userId) {
    try {
      const response = await api.get(`/recipes/user/${userId}`);
      setPrivateRecipes(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des recettes privées:", err);
    }
  }

  async function loadGroupRecipes(groupId) {
    try {
      const response = await api.get(`/group-recipes/${groupId}/recipes`);

      const data = response.data.map(r => ({
      ...r, groupId: groupId})
      );
      setGroupRecipes(data);
    } catch (err) {
      console.error("Erreur lors du chargement des recettes de groupe:", err);
    }
  }

  async function searchIngredients(query, limit = 5) {
    try {
      const response = await api.get(`/ingredients`, {
      params: {
        query,
        limit,
      }
      });
      return response.data;
    } catch (err) {
      console.error("Erreur lors du chargement des ingrédients:", err);
    }
  }

  async function loadUnits() {
    try {
      const response = await api.get(`/units`);
      setUnits(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des unités:", err);
    }
  }

  async function addRecipe(dto) {
    try {
      const res = await api.post(`/recipes`, dto);
      setPrivateRecipes(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function updateRecipe(id, dto) {
    try {
      const response = await api.put(`/recipes/${id}`, dto );
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
      await api.delete(`/recipes/${id}`);
      setPrivateRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function addIngredientToRecipe(dto) {
    try {
      const response = await api.post(`/recipe-ingredients`, dto);

      const newIngredient = response.data;

      setPrivateRecipes((prevRecipe) =>
        prevRecipe.map((recipe) => {
          if (recipe.id === dto.recipeId) {
            return {
              ...recipe,
              ingredients: [...(recipe.ingredients ?? []), newIngredient],
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
      const response = await api.post(`/recipe-instructions`, dto);

      const newInstruction = response.data;

      setPrivateRecipes((prevRecipe) =>
        prevRecipe.map((recipe) => {
          if (recipe.id === dto.recipeId) {
            return {
              ...recipe,
              instructions: [...(recipe.instructions ?? []), newInstruction],
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

  async function deleteAllInstructionsFromRecipe(id) {
    try {
      await api.delete(`/recipe-instructions/deleteAll/${id}`);
      setPrivateRecipes((prevRecipe) =>
        prevRecipe.map((recipe) => {
          if (recipe.id === id) {
            return {
              ...recipe,
              instructions: [],
            };
          }
          return recipe;
        })
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function deleteAllIngredientsFromRecipe(id) {
    try {
      await api.delete(`/recipe-ingredients/deleteAll/${id}`);
      setPrivateRecipes((prevRecipe) =>
        prevRecipe.map((recipe) => {
          if (recipe.id === id) {
            return {
              ...recipe,
              ingredients: [],
            };
          }
          return recipe;
        })
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function shareRecipeWithGroup(groupId, recipeId, userId) {
    try {
      
      const response = await api.post(`/group-recipes/${groupId}/recipes/${recipeId}`, null, {
        params: { userId },
      });

      const newSharedRecipe = response.data;

      loadGroupRecipes(groupId);

      return newSharedRecipe;

    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function unshareRecipeFromGroup(groupId, recipeId, userId) {
    try {
      await api.delete(`/group-recipes/${groupId}/recipes/${recipeId}`, {
          params: { userId },
      });

      loadGroupRecipes(groupId);

    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return (
    <RecipeContext.Provider
      value={{
        publicRecipes,
        privateRecipes,
        groupRecipes,
        units,
        searchIngredients,
        loadPublicRecipes,
        loadPrivateRecipes,
        loadGroupRecipes,
        addRecipe,
        deleteAllIngredientsFromRecipe,
        deleteAllInstructionsFromRecipe,
        updateRecipe,
        deleteRecipe,
        addIngredientToRecipe,
        addInstructionToRecipe,
        shareRecipeWithGroup,
        unshareRecipeFromGroup
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}
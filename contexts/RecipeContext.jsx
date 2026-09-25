import { createContext, useState, useEffect, useCallback} from "react";
import { api } from "../api/axiosInstance";
import { useUser } from "../hooks/useUser";

export const RecipeContext = createContext();

export function RecipeProvider({ children }) {

  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadUnits();
      loadCategories();
    }
  }, [user]);

  const loadPublicRecipes = useCallback( 
    async (userId, query = null, limit = 5, offset = 0, ingredientIds = [], categoryIds = []) => {
      const safeIngredientIds = ingredientIds?.length ? ingredientIds : undefined;
      const safecategoryIds = categoryIds?.length ? categoryIds : undefined;
      try {
        const response = await api.get(`/recipes/public/${userId}`, {
          params: {
            query,
            ingredientIds: safeIngredientIds,
            minMatch: safeIngredientIds ? 1 : undefined,
            categoryIds: safecategoryIds,
            limit,
            offset,
          },
        });
        
        return response.data;
      } catch (err) {
        console.error("Erreur lors du chargement des recettes publiques:", err);
      }
      return [];
    },
    []
  );

  const loadPrivateRecipes = useCallback(
  async (userId, query = null, limit = 10, offset = 0) => {
    try {
      const response = await api.get(`/recipes/user/${userId}`,
        {
          params: {
            query,
            limit,
            offset,
          },
        }
      );

      return response.data;
    } catch (err) {
      console.error(
        "Erreur lors du chargement des recettes privées:",
        err
      );
      return [];
    }
  },
  []
);

  const loadGroupRecipes = useCallback(
    async (groupId, query = null, limit = 10, offset = 0) => {
      try {
        const response = await api.get(`/group-recipes/${groupId}/recipes`,
          {
            params: {
              query,
              limit,
              offset,
            },
          }
        );

        return response.data.map(recipe => ({
          ...recipe,
          groupId,
        }));
      } catch (err) {
        console.error(
          "Erreur lors du chargement des recettes de groupe:",
          err
        );
        return [];
      }
    },
    []
  );

  const getRecipeById = useCallback(
    async (recipeId) => {
      try {
        const response = await api.get(
          `/recipes/${recipeId}`
        );

        return response.data;
      } catch (err) {
        console.error(
          "Erreur lors du chargement de la recette:",
          err
        );

        throw err;
      }
    },
    []
  );

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

  async function loadCategories() {
    try {
      const response = await api.get(`/recipe-categories`);
      setCategories(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des categories:", err);
    }
  }

  async function addRecipe(dto) {
    try {
      const res = await api.post(`/recipes`, dto);
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
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function deleteRecipe(id) {
    try {
      await api.delete(`/recipes/${id}`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function addIngredientToRecipe(dto) {
    try {
      const response = await api.post(`/recipe-ingredients`, dto);

      const newIngredient = response.data;

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

      return newInstruction;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function deleteAllInstructionsFromRecipe(id) {
    try {
      await api.delete(`/recipe-instructions/deleteAll/${id}`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function deleteAllIngredientsFromRecipe(id) {
    try {
      await api.delete(`/recipe-ingredients/deleteAll/${id}`);
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

    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return (
    <RecipeContext.Provider
      value={{
        units,
        categories,
        searchIngredients,
        loadPublicRecipes,
        loadPrivateRecipes,
        loadGroupRecipes,
        getRecipeById,
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
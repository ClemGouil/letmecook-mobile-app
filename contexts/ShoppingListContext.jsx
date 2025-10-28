import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser";

export const ShoppingListContext = createContext();

export function ShoppingListProvider({ children }) {

  const [shoppingLists, setShoppingLists] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, token } = useUser();

  useEffect(() => {
    if (user) {
      loadShoppingLists(user.id, null);
      loadIngredients();
      loadUnits();
    }
  }, [user]);

  const API_URL = "http://192.168.1.13:8080/api";

  async function loadShoppingLists(userId, groupId) {
    try {
      setLoading(true);
      let url = "";
      if (groupId) url = `${API_URL}/shopping-list/group/${groupId}`;
      else url = `${API_URL}/shopping-list/user/${userId}`;

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setShoppingLists(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des listes de courses:", err);
    } finally {
      setLoading(false);
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

  async function addShoppingList(dto) {
    try {
      const response = await axios.post(`${API_URL}/shopping-list`, dto, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setShoppingLists((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la création de la liste de courses:", err);
      throw err;
    }
  }

  async function updateShoppingList(id, dto) {
    try {
      const response = await axios.put(`${API_URL}/shopping-list/${id}`, dto, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const updated = response.data;
      setShoppingLists((prev) =>
        prev.map((list) => (list.id === updated.id ? updated : list))
      );
      return updated;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la liste:", err);
      throw err;
    }
  }

  async function deleteShoppingList(id) {
    try {
      await axios.delete(`${API_URL}/shopping-list/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setShoppingLists((prev) => prev.filter((list) => list.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression de la liste:", err);
      throw err;
    }
  }

  async function addIngredientToShoppingList(dto) {
    try {
      const response = await axios.post(`${API_URL}/shopping-list-ingredients`, dto, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const newIngredient = response.data;

      // Mettre à jour le state local directement
      setShoppingLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id === dto.shoppingListId) {
            return {
              ...list,
              items: [...list.items, newIngredient],
            };
          }
          return list;
        })
      );

      return newIngredient;
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'ingrédient:", err);
      throw err;
    }
  }

  async function updateIngredientToShoppingList(dto) {
    try {
      const response = await axios.post(`${API_URL}/shopping-list-ingredients/update`, dto, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const updatedIngredient = response.data;

      setShoppingLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id === dto.shoppingListId) {
            return {
              ...list,
              items: list.items.map((item) =>
                item.ingredient.id === updatedIngredient.ingredient.id
                  ? { ...item, ...updatedIngredient }
                  : item
              ),
            };
          }
          return list;
        })
      );

      return updatedIngredient;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'ingrédient:", err);
      throw err;
    }
  }

  return (
    <ShoppingListContext.Provider
      value={{
        shoppingLists,
        ingredients,
        units,
        loading,
        loadShoppingLists,
        addShoppingList,
        updateShoppingList,
        deleteShoppingList,
        addIngredientToShoppingList,
        updateIngredientToShoppingList,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}
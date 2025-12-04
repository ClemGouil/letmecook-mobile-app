import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser";
import { useAppContext } from "../hooks/useAppContext";

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {

  const [inventory, setInventory] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);

  const { currentContext } = useAppContext();
  const { user, token } = useUser();

   useEffect(() => {
    if (user && currentContext) {
      const userId = currentContext.type === "user" ? currentContext.id : null;
      const groupId = currentContext.type === "group" ? currentContext.id : null;
      loadInventory(userId, groupId);
      loadIngredients();
      loadUnits();
    }
  }, [user, currentContext]);

  const API_URL = "http://192.168.1.13:8080/api";

  async function loadInventory(userId, groupId) {
    try {
      let url = "";
      if (groupId) {
        url = `${API_URL}/inventories/group/${groupId}`;
      } else if (userId) {
        url = `${API_URL}/inventories/user/${userId}`;
      }
      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setInventory(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement de l'inventaire:", err);
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

  async function addItem(dto) {
    try {
      const response = await axios.post(`${API_URL}/inventory-items`, dto, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      // recharger l'inventaire après ajout
      if (inventory?.id) loadInventory(user.id, inventory.groupId);
      return response.data;
    } catch (err) {
      console.error("Erreur lors de l'ajout d'un item:", err);
      throw err;
    }
  }

  async function updateItem(itemId, dto) {
    try {
      const response = await axios.put(`${API_URL}/inventory-items/${itemId}`, dto, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (inventory?.id) loadInventory(user.id, inventory.groupId);
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'item:", err);
      throw err;
    }
  }

  async function deleteItem(itemId) {
    try {
      await axios.delete(`${API_URL}/inventory-items/${itemId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (inventory?.id) loadInventory(user.id, inventory.groupId);
    } catch (err) {
      console.error("Erreur lors de la suppression de l'item:", err);
      throw err;
    }
  }

  async function feedFromShoppingList(shoppingListId, userId, groupId) {
    try {
      const params = {};
      if (shoppingListId) params.shoppingListId = shoppingListId;
      if (userId) params.userId = userId;
      if (groupId) params.groupId = groupId;

      const response = await axios.post(`${API_URL}/inventories/feed-from-shopping-list`, {}, {
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (inventory?.id) loadInventory(user.id, inventory.groupId);
      return response.data;
    } catch (err) {
      console.error("Erreur lors de l'alimentation de l'inventaire:", err);
      throw err;
    }
  }

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        ingredients,
        units,
        loadInventory,
        addItem,
        updateItem,
        deleteItem,
        feedFromShoppingList,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}
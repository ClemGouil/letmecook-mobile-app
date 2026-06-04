import { createContext, useState, useEffect } from "react";
import { api } from "../api/axiosInstance";
import { useUser } from "../hooks/useUser";
import { useAppContext } from "../hooks/useAppContext";

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {

  const [inventory, setInventory] = useState(null);
  const [units, setUnits] = useState([]);

  const { currentContext } = useAppContext();
  const { user } = useUser();

   useEffect(() => {
    if (user && currentContext) {
      const userId = currentContext.type === "user" ? currentContext.id : null;
      const groupId = currentContext.type === "group" ? currentContext.id : null;
      loadInventory(userId, groupId);
      loadUnits();
    }
  }, [user, currentContext]);

  async function loadInventory(userId, groupId) {
    try {
      let url = "";
      if (groupId) {
        url = `/inventories/group/${groupId}`;
      } else if (userId) {
        url = `/inventories/user/${userId}`;
      }
      const response = await api.get(url);
      setInventory(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement de l'inventaire:", err);
    }
  }

  async function searchIngredients(query, limit = 5) {
    try {
      const response = await api.get(`/ingredients`, {
      params: {
        query,
        limit,
      },
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

  async function addItem(dto) {
    try {
      const response = await api.post(`/inventory-items`, dto);
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
      const response = await api.put(`/inventory-items/${itemId}`, dto);
      if (inventory?.id) loadInventory(user.id, inventory.groupId);
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'item:", err);
      throw err;
    }
  }

  async function deleteItem(itemId) {
    try {
      await api.delete(`/inventory-items/${itemId}`);
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

      const response = await api.post(`/inventories/feed-from-shopping-list`, {}, {
        params,
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
        units,
        loadInventory,
        searchIngredients,
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
import { createContext, useState, useEffect } from "react";
import { api } from "../api/axiosInstance";
import { useUser } from "../hooks/useUser";
import { useAppContext } from "../hooks/useAppContext";

export const MealPlanningContext = createContext();

export function MealPlanningProvider({ children }) {

    const [mealPlannings, setMealPlannings] = useState([]);

    const { currentContext } = useAppContext();
    const { user } = useUser();

    useEffect(() => {
        if (user && currentContext) {
        
        }
    }, [user]);

  async function loadMealPlanning(userId, start, end, groupId) {
    try {
      let url = "";
      let params = {};
      if (groupId) {
        url = `/mealPlanning/group`;
        params = { groupId, start, end };
      } else if (userId) {
        url = `/mealPlanning/user`;
        params = { userId, start, end };
      }
      const response = await api.get(url, {params});
      setMealPlannings(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement du planning:", err);
    }
  }

  async function addMealPlanning(dto) {
    try {
      
      if (currentContext?.type === "user") {
        dto.userId = currentContext.id;
        delete dto.groupId;
      } else if (currentContext?.type === "group") {
        dto.groupId = currentContext.id;
        delete dto.userId;
      }

      const res = await api.post(`/mealPlanning`, dto);
      setMealPlannings(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function deleteMealPlanning(id) {
    try {
      await api.delete(`/mealPlanning/${id}`);
      setMealPlannings(prev => prev.filter(mp => mp.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function deleteForPeriod(userId, start, end) {
    try {
      const params = { start, end };
      await api.delete(`/mealPlanning/deleteAll/user/${userId}`, {
        params
      });
      setMealPlannings((prev) =>
        prev.filter((mp) => mp.date < start || mp.date > end)
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return (
      <MealPlanningContext.Provider
        value={{
            mealPlannings,
            loadMealPlanning,
            addMealPlanning,
            deleteMealPlanning,
            deleteForPeriod,
        }}
      >
        {children}
      </MealPlanningContext.Provider>
    );
}
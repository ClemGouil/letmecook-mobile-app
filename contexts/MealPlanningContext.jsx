import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser";

export const MealPlanningContext = createContext();

export function MealPlanningProvider({ children }) {

    const [mealPlannings, setMealPlannings] = useState([]);

    const { user, token } = useUser();

    useEffect(() => {
        if (user) {
        
        }
    }, [user]);

  const API_URL = "http://192.168.1.13:8080/api";

  async function loadMealPlanning(userId, start, end) {
    try {
      const params = { userId, start, end };
      const response = await axios.get(`${API_URL}/mealPlanning/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }, params
      });
      setMealPlannings(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement du planning:", err);
    }
  }

  async function addMealPlanning(dto) {
    try {
      const res = await axios.post(`${API_URL}/mealPlanning`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMealPlannings(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function deleteMealPlanning(id) {
    try {
      await axios.delete(`${API_URL}/mealPlanning/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMealPlannings(prev => prev.filter(mp => mp.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function deleteForPeriod(userId, start, end) {
    try {
      const params = { start, end };
      await axios.delete(`${API_URL}/mealPlanning/deleteAll/user/${userId}`, {
        headers: { 
            Authorization: `Bearer ${token}` 
        }, params
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
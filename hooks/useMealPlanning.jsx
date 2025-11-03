import { useContext } from "react";
import { MealPlanningContext } from "../contexts/MealPlanningContext";

export function useMealPlanning() {

  const context = useContext(MealPlanningContext);

  if (!context) {
    throw new Error("useMealPlanning must be used within a MealPlanningProvider");
  }
  
  return context;
}
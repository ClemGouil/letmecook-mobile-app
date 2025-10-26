import { useContext } from "react";
import { RecipeContext } from "../contexts/RecipeContext";

export function useRecipe() {

  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  
  return context;
}
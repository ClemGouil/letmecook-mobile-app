import { useContext } from "react";
import { ShoppingListContext } from "../contexts/ShoppingListContext";

export function useShoppingList() {

  const context = useContext(ShoppingListContext);

  if (!context) {
    throw new Error("useShoppingList must be used within a ShoppingListProvider");
  }
  
  return context;
}
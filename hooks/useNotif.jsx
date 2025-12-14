import { useContext } from "react";
import { NotifContext } from "../contexts/NotifContext";

export function useNotif() {

  const context = useContext(NotifContext);

  if (!context) {
    throw new Error("useNotif must be used within a NotifProvider");
  }
  
  return context;
}
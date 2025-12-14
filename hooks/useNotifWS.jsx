import { useContext } from "react";
import { NotifWSContext } from "../contexts/NotifWSContext";

export function useWSNotif() {

  const context = useContext(NotifWSContext);

  if (!context) {
    throw new Error("useWSNotif must be used within a NotifWSProvider");
  }
  
  return context;
}
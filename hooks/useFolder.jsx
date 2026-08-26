import { useContext } from "react";
import { FolderContext } from "../contexts/FolderContext";

export function useFolder() {

  const context = useContext(FolderContext);

  if (!context) {
    throw new Error("useFolder must be used within a FolderProvider");
  }
  
  return context;
}
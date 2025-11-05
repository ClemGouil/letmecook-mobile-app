import { useContext } from "react";
import { ImageContext } from "../contexts/ImageContext";

export function useImage() {

  const context = useContext(ImageContext);

  if (!context) {
    throw new Error("useImage must be used within a imageProvider");
  }
  
  return context;
}
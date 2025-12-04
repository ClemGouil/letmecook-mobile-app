import React, { createContext, useState } from "react";

export const AppContext = createContext(null);

export const ContextProvider = ({ children }) => {
  const [currentContext, setCurrentContext] = useState(null);

  const setContext = (ctx) => setCurrentContext(ctx);
  const clearContext = () => setCurrentContext(null);

  return (
    <AppContext.Provider value={{ currentContext, setContext, clearContext }}>
      {children}
    </AppContext.Provider>
  );
};
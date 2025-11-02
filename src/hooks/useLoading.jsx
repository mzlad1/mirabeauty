import React, { createContext, useContext, useState } from "react";

// Create Loading Context
const LoadingContext = createContext();

// Loading Provider Component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => {
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const withLoading = async (asyncFunction, minLoadingTime = 800) => {
    showLoading();
    const startTime = Date.now();
    
    try {
      const result = await asyncFunction();
      
      // Ensure minimum loading time for better UX
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      return result;
    } finally {
      hideLoading();
    }
  };

  const value = {
    isLoading,
    showLoading,
    hideLoading,
    withLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  
  return context;
};

export default useLoading;
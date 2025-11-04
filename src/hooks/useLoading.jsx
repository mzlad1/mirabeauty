import React, { createContext, useContext, useState, useEffect } from "react";

// Create Loading Context
const LoadingContext = createContext();

// Loading Provider Component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const showLoading = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const hideLoading = () => {
    setProgress(100);
    // Small delay to show 100% before hiding
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  };

  const withLoading = async (asyncFunction, minLoadingTime = 500) => {
    showLoading();
    const startTime = Date.now();

    // Start progress simulation
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 90) {
        currentProgress = 90; // Stop at 90% until actual completion
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, 100);

    try {
      const result = await asyncFunction();

      // Clear progress interval
      clearInterval(progressInterval);

      // Jump to 90% if not there yet
      if (currentProgress < 90) {
        setProgress(90);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Ensure minimum loading time for better UX
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      return result;
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    } finally {
      hideLoading();
    }
  };

  const value = {
    isLoading,
    progress,
    showLoading,
    hideLoading,
    withLoading,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
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

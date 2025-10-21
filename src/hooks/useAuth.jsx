// Custom authentication hook with Firebase
import { useState, useEffect, useContext, createContext } from "react";
import { onAuthStateChange, getCurrentUserData } from "../services/authService";

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log(
        "Auth state changed:",
        user ? "User logged in" : "User logged out"
      );

      if (user) {
        try {
          // Get user data from Firestore
          const userDoc = await getCurrentUserData(user.uid);
          console.log("User data fetched:", userDoc);

          if (userDoc) {
            setCurrentUser(user);
            setUserData(userDoc);
          } else {
            console.error("No user document found in Firestore");
            setCurrentUser(null);
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null);
          setUserData(null);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to refresh user data
  const refreshUserData = async () => {
    if (currentUser) {
      try {
        const userDoc = await getCurrentUserData(currentUser.uid);
        if (userDoc) {
          setUserData(userDoc);
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    setUserData, // For updating user data after profile updates
    refreshUserData, // For manually refreshing user data
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

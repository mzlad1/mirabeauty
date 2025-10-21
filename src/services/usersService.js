import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const USERS_COLLECTION = "users";

// Get all users
export const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, USERS_COLLECTION);
    const usersQuery = query(usersCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(usersQuery);

    const users = [];
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get users by role (customer, staff, admin)
export const getUsersByRole = async (role) => {
  try {
    const usersCollection = collection(db, USERS_COLLECTION);
    const usersQuery = query(
      usersCollection,
      where("role", "==", role),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(usersQuery);

    const users = [];
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return users;
  } catch (error) {
    console.error(`Error fetching ${role} users:`, error);
    throw error;
  }
};

// Get customers
export const getCustomers = async () => {
  return await getUsersByRole("customer");
};

// Get staff
export const getStaff = async () => {
  return await getUsersByRole("staff");
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const userDoc = doc(db, USERS_COLLECTION, userId);
    const snapshot = await getDoc(userDoc);

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Add new user
export const addUser = async (userData) => {
  try {
    const usersCollection = collection(db, USERS_COLLECTION);
    const userDoc = await addDoc(usersCollection, {
      ...userData,
      avatar: userData.avatar || "/assets/default-avatar.jpg",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      active: userData.active !== undefined ? userData.active : true,
      appointmentsCount: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
    });

    return userDoc.id;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const userDoc = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userDoc, {
      ...userData,
      updatedAt: serverTimestamp(),
    });

    return userId;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const userDoc = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userDoc);

    return userId;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Search users
export const searchUsers = async (searchTerm, role = null) => {
  try {
    let usersQuery;
    const usersCollection = collection(db, USERS_COLLECTION);

    if (role) {
      usersQuery = query(
        usersCollection,
        where("role", "==", role),
        orderBy("createdAt", "desc")
      );
    } else {
      usersQuery = query(usersCollection, orderBy("createdAt", "desc"));
    }

    const snapshot = await getDocs(usersQuery);
    const users = [];

    snapshot.forEach((doc) => {
      const userData = doc.data();
      // Simple client-side search since Firestore doesn't support text search
      if (
        userData.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userData.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userData.phone?.includes(searchTerm)
      ) {
        users.push({
          id: doc.id,
          ...userData,
        });
      }
    });

    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

// Admin functions for user management (Firestore only - for backward compatibility)
export const adminAddCustomer = async (customerData) => {
  try {
    return await addUser({
      ...customerData,
      role: "customer",
    });
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

export const adminAddStaff = async (staffData) => {
  try {
    return await addUser({
      ...staffData,
      role: "staff",
    });
  } catch (error) {
    console.error("Error adding staff:", error);
    throw error;
  }
};

export const adminUpdateCustomer = async (customerId, customerData) => {
  try {
    return await updateUser(customerId, customerData);
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const adminUpdateStaff = async (staffId, staffData) => {
  try {
    return await updateUser(staffId, staffData);
  } catch (error) {
    console.error("Error updating staff:", error);
    throw error;
  }
};

export const adminDeleteCustomer = async (customerId) => {
  try {
    return await deleteUser(customerId);
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

export const adminDeleteStaff = async (staffId) => {
  try {
    return await deleteUser(staffId);
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
};

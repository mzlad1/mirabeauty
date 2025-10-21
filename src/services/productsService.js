// Products service for Firestore
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Collection name
const PRODUCTS_COLLECTION = "products";

// Get all products
export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy("name"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting all products:", error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where("category", "==", category),
      orderBy("name")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting products by category:", error);
    throw error;
  }
};

// Get single product by ID
export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      return {
        id: productDoc.id,
        ...productDoc.data(),
      };
    } else {
      throw new Error("المنتج غير موجود");
    }
  } catch (error) {
    console.error("Error getting product by ID:", error);
    throw error;
  }
};

// Add new product (admin only)
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...productData,
    };
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Update product (admin only)
export const updateProduct = async (productId, updateData) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product (admin only)
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Update product stock status
export const updateProductStock = async (productId, inStock) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      inStock,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating product stock:", error);
    throw error;
  }
};

// Search products by name
export const searchProducts = async (searchTerm) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);

    // Client-side filtering for search (Firestore doesn't support full-text search natively)
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const searchLower = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.categoryName.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Get featured products (top rated or in stock)
export const getFeaturedProducts = async (limit = 6) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where("inStock", "==", true),
      orderBy("rating", "desc")
    );
    const snapshot = await getDocs(q);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return products.slice(0, limit);
  } catch (error) {
    console.error("Error getting featured products:", error);
    throw error;
  }
};

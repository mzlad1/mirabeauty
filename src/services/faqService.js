// FAQ service for Firestore
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
const FAQ_COLLECTION = "faqs";

// Get all FAQs
export const getAllFAQs = async () => {
  try {
    const faqsRef = collection(db, FAQ_COLLECTION);
    // Order by faqId instead of id
    const q = query(faqsRef, orderBy("faqId"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting all FAQs:", error);
    throw error;
  }
};

// Get FAQs by category
export const getFAQsByCategory = async (category) => {
  try {
    const faqsRef = collection(db, FAQ_COLLECTION);
    const q = query(
      faqsRef,
      where("category", "==", category),
      orderBy("faqId")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting FAQs by category:", error);
    throw error;
  }
};

// Get single FAQ by ID
export const getFAQById = async (faqId) => {
  try {
    const faqRef = doc(db, FAQ_COLLECTION, faqId);
    const faqDoc = await getDoc(faqRef);

    if (faqDoc.exists()) {
      return {
        id: faqDoc.id,
        ...faqDoc.data(),
      };
    } else {
      throw new Error("السؤال غير موجود");
    }
  } catch (error) {
    console.error("Error getting FAQ by ID:", error);
    throw error;
  }
};

// Search FAQs by question or answer
export const searchFAQs = async (searchTerm) => {
  try {
    const faqsRef = collection(db, FAQ_COLLECTION);
    const snapshot = await getDocs(faqsRef);

    const allFAQs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter FAQs by question or answer (case-insensitive)
    return allFAQs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching FAQs:", error);
    throw error;
  }
};

// Add new FAQ (admin only)
export const addFAQ = async (faqData) => {
  try {
    const faqsRef = collection(db, FAQ_COLLECTION);
    const docRef = await addDoc(faqsRef, {
      ...faqData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...faqData,
    };
  } catch (error) {
    console.error("Error adding FAQ:", error);
    throw error;
  }
};

// Update FAQ (admin only)
export const updateFAQ = async (faqId, updateData) => {
  try {
    const faqRef = doc(db, FAQ_COLLECTION, faqId);
    await updateDoc(faqRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });

    return {
      id: faqId,
      ...updateData,
    };
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw error;
  }
};

// Delete FAQ (admin only)
export const deleteFAQ = async (faqId) => {
  try {
    const faqRef = doc(db, FAQ_COLLECTION, faqId);
    await deleteDoc(faqRef);
    return faqId;
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw error;
  }
};

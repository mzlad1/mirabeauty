// Migration script to add sample products to Firestore
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

// Sample products data (based on your current sample)
const sampleProducts = [
  {
    name: "مجموعة العناية اليومية للبشرة",
    description:
      "مجموعة متكاملة للعناية اليومية بالبشرة تتضمن غسول، تونر، ومرطب طبيعي",
    price: "150 شيكل",
    originalPrice: "180 شيكل",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "skincare",
    categoryName: "العناية بالبشرة",
    brand: "ميرا بيوتي",
    inStock: true,
    rating: 4.8,
    reviewsCount: 125,
    ingredients: [
      "حمض الهيالورونيك",
      "فيتامين C",
      "مستخلص الألوة فيرا",
      "زيت الأرغان الطبيعي",
    ],
    benefits: [
      "تنظيف عميق ولطيف",
      "ترطيب مكثف لمدة 24 ساعة",
      "حماية من العوامل الخارجية",
      "إشراق طبيعي للبشرة",
    ],
    howToUse: "يُستخدم صباحاً ومساءً على بشرة نظيفة ورطبة",
    size: "مجموعة من 3 قطع",
  },
  {
    name: "كريم مضاد للشيخوخة المتطور",
    description: "كريم متطور لمحاربة علامات التقدم في السن وتجديد خلايا البشرة",
    price: "200 شيكل",
    originalPrice: "240 شيكل",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "anti-aging",
    categoryName: "مكافحة الشيخوخة",
    brand: "ميرا بيوتي",
    inStock: true,
    rating: 4.9,
    reviewsCount: 89,
    ingredients: [
      "الريتينول المركز",
      "الكولاجين البحري",
      "الببتيدات النشطة",
      "حمض الهيالورونيك",
    ],
    benefits: [
      "تقليل التجاعيد والخطوط الدقيقة",
      "زيادة مرونة البشرة",
      "تحفيز إنتاج الكولاجين الطبيعي",
      "توحيد لون البشرة",
    ],
    howToUse: "يُطبق مساءً على الوجه والرقبة بعد التنظيف",
    size: "50 مل",
  },
  {
    name: "مجموعة تفتيح البشرة الطبيعية",
    description: "منتجات طبيعية لتفتيح وتوحيد لون البشرة بمكونات آمنة وفعالة",
    price: "180 شيكل",
    originalPrice: "220 شيكل",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "whitening",
    categoryName: "تفتيح البشرة",
    brand: "ميرا بيوتي",
    inStock: true,
    rating: 4.7,
    reviewsCount: 156,
    ingredients: [
      "فيتامين C المستقر",
      "الأربوتين الطبيعي",
      "مستخلص العرقسوس",
      "الجلوتاثيون",
    ],
    benefits: [
      "تفتيح التصبغات والبقع الداكنة",
      "توحيد لون البشرة",
      "إشراق طبيعي ونعومة",
      "حماية من الأشعة فوق البنفسجية",
    ],
    howToUse: "يُستخدم مرتين يومياً مع واقي الشمس",
    size: "مجموعة من 4 قطع",
  },
  {
    name: "سيروم فيتامين C المركز",
    description:
      "سيروم مركز بفيتامين C لإشراق البشرة وحمايتها من علامات التقدم في السن",
    price: "120 شيكل",
    originalPrice: "150 شيكل",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "serums",
    categoryName: "السيروم",
    brand: "ميرا بيوتي",
    inStock: true,
    rating: 4.8,
    reviewsCount: 203,
    ingredients: [
      "فيتامين C 20%",
      "حمض الفيروليك",
      "فيتامين E",
      "الماء المقطر",
    ],
    benefits: [
      "إشراق فوري للبشرة",
      "حماية من الجذور الحرة",
      "تحفيز إنتاج الكولاجين",
      "تقليل البقع الداكنة",
    ],
    howToUse: "يُطبق صباحاً قبل المرطب وواقي الشمس",
    size: "30 مل",
  },
  {
    name: "ماسك الذهب المرطب",
    description: "ماسك فاخر بالذهب 24 قيراط لترطيب وتغذية البشرة الجافة",
    price: "80 شيكل",
    originalPrice: "100 شيكل",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "masks",
    categoryName: "الماسكات",
    brand: "ميرا بيوتي",
    inStock: true,
    rating: 4.6,
    reviewsCount: 78,
    ingredients: [
      "ذهب 24 قيراط",
      "حمض الهيالورونيك",
      "زيت الجوجوبا",
      "مستخلص الكافيار",
    ],
    benefits: [
      "ترطيب عميق ومكثف",
      "نعومة وإشراق فوري",
      "تغذية البشرة الجافة",
      "مظهر شبابي ومشدود",
    ],
    howToUse: "يُطبق مرة أو مرتين أسبوعياً لمدة 15-20 دقيقة",
    size: "5 قطع",
  },
  {
    name: "واقي الشمس الطبيعي SPF 50",
    description: "واقي شمس طبيعي بحماية عالية مناسب لجميع أنواع البشرة",
    price: "65 شيكل",
    originalPrice: "80 شيكل",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "sunscreen",
    categoryName: "واقي الشمس",
    brand: "ميرا بيوتي",
    inStock: true,
    rating: 4.9,
    reviewsCount: 134,
    ingredients: [
      "أكسيد الزنك",
      "أكسيد التيتانيوم",
      "فيتامين E",
      "مستخلص الصبار",
    ],
    benefits: [
      "حماية من الأشعة فوق البنفسجية",
      "لا يترك أثراً أبيض",
      "مقاوم للماء والعرق",
      "مناسب للبشرة الحساسة",
    ],
    howToUse: "يُطبق كمية كافية قبل التعرض للشمس بـ 15 دقيقة",
    size: "75 مل",
  },
];

// Function to migrate products to Firestore
export const migrateProductsToFirestore = async () => {
  try {
    console.log("Starting products migration to Firestore...");

    const productsRef = collection(db, "products");
    const results = [];

    for (const product of sampleProducts) {
      try {
        const docRef = await addDoc(productsRef, {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        results.push({
          id: docRef.id,
          name: product.name,
          status: "success",
        });

        console.log(`✅ Added product: ${product.name} with ID: ${docRef.id}`);
      } catch (error) {
        console.error(`❌ Failed to add product: ${product.name}`, error);
        results.push({
          name: product.name,
          status: "error",
          error: error.message,
        });
      }
    }

    console.log("Products migration completed!");
    console.log("Results:", results);

    return results;
  } catch (error) {
    console.error("Error during products migration:", error);
    throw error;
  }
};

// Call this function in browser console or create a button to run migration
// migrateProductsToFirestore();

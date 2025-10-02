// data/sampleServices.js - Sample Services Data

export const sampleServices = [
  {
    id: 1,
    name: "إزالة الشعر بالليزر",
    description:
      "إزالة الشعر الغير مرغوب فيه باستخدام أحدث تقنيات الليزر الآمنة والفعالة",
    price: "200 شيكل",
    duration: "30-60 دقيقة",
    category: "laser",
    categoryName: "الليزر",
    image:
      "https://images.unsplash.com/photo-1700760933941-3a06a28fbf47?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D  ",
    //use wax.png from public folder for icon
    icon: "https://www.canadiancmc.com/wp-content/uploads/2024/09/Laser-hair-removal.jpg",
    features: [
      "تقنية ليزر متطورة وآمنة",
      "نتائج دائمة ومضمونة",
      "مناسب لجميع أنواع البشرة",
      "بدون ألم أو آثار جانبية",
    ],
    popular: true,
    sessions: "6-8 جلسات",
  },
  {
    id: 2,
    name: "تجديد البشرة",
    description:
      "علاجات متقدمة لتجديد البشرة وإشراقها الطبيعي باستخدام أحدث التقنيات",
    price: "350 شيكل",
    duration: "45-90 دقيقة",
    category: "skincare",
    categoryName: "العناية بالبشرة",
    image:
      "https://images.unsplash.com/photo-1700760933941-3a06a28fbf47?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "https://bioinst.com/wp-content/uploads/2024/09/skin-rejuvenation-with-stem-cells-of-adipose-tissue-AR.jpg",
    features: [
      "تحفيز تجديد الخلايا",
      "تحسين ملمس البشرة",
      "توحيد لون البشرة",
      "تقليل علامات التقدم في السن",
    ],
    popular: true,
    sessions: "4-6 جلسات",
  },
  {
    id: 3,
    name: "نحت الجسم",
    description:
      "تقنيات حديثة لنحت وتشكيل الجسم بدون جراحة باستخدام أجهزة متطورة",
    price: "500 شيكل",
    duration: "60-120 دقيقة",
    category: "body",
    categoryName: "نحت الجسم",
    image:
      "https://images.unsplash.com/photo-1700760933941-3a06a28fbf47?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "https://www.medicaliclinic.com/wp-content/uploads/2023/05/%D8%B4%D9%81%D8%B7-%D8%A7%D9%84%D8%AF%D9%87%D9%88%D9%86-2.jpg",
    features: [
      "تفتيت الدهون الموضعية",
      "شد وتشكيل الجسم",
      "بدون جراحة أو تدخل",
      "نتائج واضحة وسريعة",
    ],
    popular: false,
    sessions: "8-12 جلسة",
  },
  {
    id: 4,
    name: "علاج الوجه المتطور",
    description: "علاجات شاملة للوجه باستخدام أفضل المنتجات والتقنيات العالمية",
    price: "250 شيكل",
    duration: "60 دقيقة",
    category: "facial",
    categoryName: "العناية بالوجه",
    image:
      "https://images.unsplash.com/photo-1700760933941-3a06a28fbf47?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "../../public/assets/wax.png",
    features: [
      "تنظيف عميق للبشرة",
      "ترطيب وتغذية مكثفة",
      "تحفيز الدورة الدموية",
      "إشراق فوري ونعومة",
    ],
    popular: true,
    sessions: "جلسة واحدة",
  },
  {
    id: 5,
    name: "شد الجلد بالترددات",
    description:
      "تقنيات متطورة لشد الجلد واستعادة مرونته باستخدام الترددات الراديوية",
    price: "400 شيكل",
    duration: "90 دقيقة",
    category: "skincare",
    categoryName: "العناية بالبشرة",
    image:
      "https://images.unsplash.com/photo-1700760933941-3a06a28fbf47?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "../../public/assets/wax.png",
    features: [
      "شد الجلد المترهل",
      "تحفيز إنتاج الكولاجين",
      "تحسين مرونة البشرة",
      "بدون ألم أو فترة نقاهة",
    ],
    popular: false,
    sessions: "6-8 جلسات",
  },
  {
    id: 6,
    name: "إزالة التجاعيد",
    description:
      "علاجات فعالة لإزالة التجاعيد وعلامات التقدم في السن من الوجه والرقبة",
    price: "300 شيكل",
    duration: "45 دقيقة",
    category: "facial",
    categoryName: "العناية بالوجه",
    image:
      "https://images.unsplash.com/photo-1700760933941-3a06a28fbf47?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "../../public/assets/wax.png",
    features: [
      "تقليل التجاعيد والخطوط",
      "شد وتنعيم البشرة",
      "تحفيز إنتاج الكولاجين",
      "نتائج طبيعية ومتدرجة",
    ],
    popular: true,
    sessions: "3-5 جلسات",
  },
  {
    id: 7,
    name: "تفتيح الإبط والمناطق الحساسة",
    description:
      "علاج آمن وفعال لتفتيح الإبط والمناطق الحساسة باستخدام تقنيات متطورة",
    price: "180 شيكل",
    duration: "30 دقيقة",
    category: "skincare",
    categoryName: "العناية بالبشرة",
    image:
      "https://images.unsplash.com/photo-1700760933941-3a06a28fbf47?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "../../public/assets/wax.png",
    features: [
      "تفتيح آمن وطبيعي",
      "إزالة التصبغات",
      "ترطيب وتنعيم",
      "مناسب للمناطق الحساسة",
    ],
    popular: false,
    sessions: "4-6 جلسات",
  },
  {
    id: 8,
    name: "علاج حب الشباب وآثاره",
    description:
      "علاج شامل لحب الشباب وآثاره باستخدام أحدث التقنيات والعلاجات المتخصصة",
    price: "280 شيكل",
    duration: "50 دقيقة",
    category: "skincare",
    categoryName: "العناية بالبشرة",
    image:
      "https://images.unsplash.com/photo-1700760933941-3a06a28fbf47?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "../../public/assets/wax.png",
    features: [
      "علاج حب الشباب النشط",
      "إزالة آثار وندبات حب الشباب",
      "تنظيم إفراز الزيوت",
      "تحسين ملمس البشرة",
    ],
    popular: true,
    sessions: "6-10 جلسات",
  },
  {
    id: 9,
    name: "نحت الوجه وشد التجاعيد",
    description: "تقنية متطورة لنحت ملامح الوجه وشد التجاعيد بدون جراحة",
    price: "450 شيكل",
    duration: "75 دقيقة",
    category: "facial",
    categoryName: "العناية بالوجه",
    image:
      "https://images.unsplash.com/photo-1700760933941-3a06a28fbf47?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "../../public/assets/wax.png",
    features: [
      "نحت وتحديد ملامح الوجه",
      "شد التجاعيد والخطوط",
      "رفع الحواجب والخدود",
      "نتائج فورية ومستمرة",
    ],
    popular: false,
    sessions: "3-4 جلسات",
  },
];

// Arabic Fake Data for Luxury Laser Center

export const services = {
  laser: [
    {
      id: 1,
      name: "إزالة الشعر بالليزر - الوجه",
      description: "إزالة شعر الوجه بالليزر بأحدث التقنيات لنتائج دائمة وفعالة",
      duration: "30 دقيقة",
      price: "150 شيكل",
      originalPrice: "200 شيكل",
      popular: true,
      icon: "✨",
    },
    {
      id: 2,
      name: "إزالة الشعر بالليزر - الجسم كامل",
      description: "جلسة شاملة لإزالة الشعر من جميع أنحاء الجسم",
      duration: "90 دقيقة",
      price: "450 شيكل",
      originalPrice: "600 شيكل",
      popular: true,
      icon: "💫",
    },
    {
      id: 3,
      name: "إزالة الشعر بالليزر - الساقين",
      description: "إزالة شعر الساقين بالليزر لنتائج مثالية",
      duration: "45 دقيقة",
      price: "200 شيكل",
      originalPrice: "250 شيكل",
      popular: false,
      icon: "🌟",
    },
    {
      id: 4,
      name: "إزالة الشعر بالليزر - الإبطين",
      description: "جلسة سريعة وفعالة لإزالة شعر الإبطين",
      duration: "15 دقيقة",
      price: "80 شيكل",
      originalPrice: "100 شيكل",
      popular: false,
      icon: "⭐",
    },
  ],
  skincare: [
    {
      id: 5,
      name: "التقشير الكيميائي",
      description: "تقشير عميق للبشرة لإزالة الخلايا الميتة وتجديد البشرة",
      duration: "60 دقيقة",
      price: "300 شيكل",
      originalPrice: "400 شيكل",
      popular: true,
      icon: "🌸",
    },
    {
      id: 6,
      name: "الميكرونيدلينغ",
      description: "علاج متقدم لتجديد البشرة وتقليل التجاعيد والندوب",
      duration: "75 دقيقة",
      price: "400 شيكل",
      originalPrice: "500 شيكل",
      popular: true,
      icon: "🌺",
    },
    {
      id: 7,
      name: "فيسيال الذهب",
      description: "قناع ذهبي فاخر لتغذية البشرة وإشراقها",
      duration: "90 دقيقة",
      price: "500 شيكل",
      originalPrice: "650 شيكل",
      popular: false,
      icon: "👑",
    },
    {
      id: 8,
      name: "علاج حب الشباب",
      description: "علاج متخصص لحب الشباب والالتهابات الجلدية",
      duration: "45 دقيقة",
      price: "250 شيكل",
      originalPrice: "300 شيكل",
      popular: false,
      icon: "🌿",
    },
  ],
  vip: [
    {
      id: 9,
      name: "باقة VIP الشاملة",
      description: "باقة فاخرة تشمل جميع الخدمات مع معاملة VIP حصرية",
      duration: "3 ساعات",
      price: "1200 شيكل",
      originalPrice: "1500 شيكل",
      popular: true,
      icon: "💎",
    },
    {
      id: 10,
      name: "جلسة VIP الذهبية",
      description: "جلسة علاجية فاخرة مع منتجات ذهبية حصرية",
      duration: "2 ساعة",
      price: "800 شيكل",
      originalPrice: "1000 شيكل",
      popular: false,
      icon: "🏆",
    },
    {
      id: 11,
      name: "علاج VIP للوجه",
      description: "علاج متكامل للوجه مع تقنيات متقدمة",
      duration: "90 دقيقة",
      price: "600 شيكل",
      originalPrice: "750 شيكل",
      popular: false,
      icon: "✨",
    },
  ],
};

export const products = [
  {
    id: 1,
    name: "كريم الترطيب الفاخر",
    description: "كريم ترطيب عميق للبشرة مع مكونات طبيعية فاخرة",
    price: "120 شيكل",
    originalPrice: "150 شيكل",
    discount: 20,
    image: "🧴",
    category: "العناية بالبشرة",
  },
  {
    id: 2,
    name: "مصل فيتامين C",
    description: "مصل قوي لفيتامين C لإشراق البشرة ومحاربة الشيخوخة",
    price: "180 شيكل",
    originalPrice: "220 شيكل",
    discount: 18,
    image: "💧",
    category: "المصلات",
  },
  {
    id: 3,
    name: "واقي الشمس الفاخر",
    description: "واقي شمس عالي الحماية مع ملمس فاخر",
    price: "95 شيكل",
    originalPrice: "120 شيكل",
    discount: 21,
    image: "☀️",
    category: "الحماية",
  },
  {
    id: 4,
    name: "قناع الذهب الليلي",
    description: "قناع ليلي فاخر مع جزيئات الذهب لتجديد البشرة",
    price: "250 شيكل",
    originalPrice: "300 شيكل",
    discount: 17,
    image: "🎭",
    category: "الأقنعة",
  },
  {
    id: 5,
    name: "تونر الورد الطبيعي",
    description: "تونر منعش مع خلاصة الورد الطبيعي",
    price: "85 شيكل",
    originalPrice: "110 شيكل",
    discount: 23,
    image: "🌹",
    category: "التونر",
  },
  {
    id: 6,
    name: "كريم العين المضاد للتجاعيد",
    description: "كريم متخصص لمنطقة العين مع مكونات مضادة للتجاعيد",
    price: "160 شيكل",
    originalPrice: "200 شيكل",
    discount: 20,
    image: "👁️",
    category: "العناية بالعين",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "فاطمة أحمد",
    service: "إزالة الشعر بالليزر",
    rating: 5,
    text: "تجربة رائعة جداً! المركز فاخر والخدمة ممتازة. النتائج تجاوزت توقعاتي تماماً.",
    avatar: "👩",
    date: "منذ أسبوع",
  },
  {
    id: 2,
    name: "نورا السعد",
    service: "التقشير الكيميائي",
    rating: 5,
    text: "أفضل مركز في فلسطين! الموظفون محترفون والنتائج مذهلة. أنصح الجميع بزيارتهم.",
    avatar: "👩‍🦰",
    date: "منذ 3 أيام",
  },
  {
    id: 3,
    name: "ريم محمد",
    service: "باقة VIP الشاملة",
    rating: 5,
    text: "تجربة VIP لا تُنسى! كل التفاصيل مثالية والنتائج رائعة. سأعود بالتأكيد.",
    avatar: "👩‍💼",
    date: "منذ أسبوعين",
  },
];

export const promotions = [
  {
    id: 1,
    title: "عرض الشتاء الساخن",
    description: "خصم 30% على جميع خدمات الليزر",
    originalPrice: "500 شيكل",
    newPrice: "350 شيكل",
    validUntil: "31 ديسمبر 2024",
    image: "❄️",
  },
  {
    id: 2,
    title: "باقة العناية الذهبية",
    description: "3 جلسات عناية بالبشرة بسعر جلستين",
    originalPrice: "900 شيكل",
    newPrice: "600 شيكل",
    validUntil: "15 يناير 2025",
    image: "🏆",
  },
  {
    id: 3,
    title: "عرض العضوية الذهبية",
    description: "عضوية VIP مجانية مع أول حجز",
    originalPrice: "200 شيكل",
    newPrice: "مجاناً",
    validUntil: "28 فبراير 2025",
    image: "💎",
  },
];

export const faqs = {
  laser: [
    {
      question: "كم عدد الجلسات المطلوبة لإزالة الشعر بالليزر؟",
      answer:
        "عادة ما تحتاجين من 6-8 جلسات للحصول على أفضل النتائج، مع جلسات صيانة دورية.",
    },
    {
      question: "هل إزالة الشعر بالليزر مؤلمة؟",
      answer:
        "قد تشعرين بوخز خفيف، لكننا نستخدم أحدث التقنيات لتقليل الانزعاج إلى الحد الأدنى.",
    },
    {
      question: "ما هي التحضيرات المطلوبة قبل الجلسة؟",
      answer:
        "تجنبي التعرض للشمس لمدة أسبوع، واحرصي على حلاقة الشعر قبل الجلسة بـ 24 ساعة.",
    },
  ],
  skincare: [
    {
      question: "ما هو أفضل وقت للتقشير الكيميائي؟",
      answer:
        "يُنصح بالتقشير في المساء أو في الأيام التي لا تتعرضين فيها للشمس مباشرة.",
    },
    {
      question: "كم مرة يمكن تكرار الميكرونيدلينغ؟",
      answer:
        "يمكن تكرار الميكرونيدلينغ كل 4-6 أسابيع حسب حالة البشرة ونوع العلاج.",
    },
    {
      question: "هل يمكن استخدام منتجات العناية بعد العلاج؟",
      answer: "نعم، سنقدم لكِ قائمة بالمنتجات المناسبة للاستخدام بعد العلاج.",
    },
  ],
  general: [
    {
      question: "ما هي ساعات العمل في المركز؟",
      answer:
        "نعمل من السبت إلى الخميس من 9 صباحاً إلى 10 مساءً، والجمعة من 2 ظهراً إلى 10 مساءً.",
    },
    {
      question: "هل يمكن إلغاء أو تأجيل الحجز؟",
      answer: "نعم، يمكنك إلغاء أو تأجيل الحجز قبل 24 ساعة من موعد الجلسة.",
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نقبل الدفع نقداً، بالبطاقة الائتمانية، والتحويل البنكي، ودفع.",
    },
  ],
};

export const instructions = {
  before: [
    "تجنبي التعرض المباشر للشمس لمدة أسبوع قبل الجلسة",
    "احرصي على حلاقة الشعر قبل الجلسة بـ 24 ساعة",
    "تجنبي استخدام الكريمات المرطبة في يوم الجلسة",
    "أخبرينا عن أي أدوية تتناولينها أو حساسية تعانين منها",
    "تجنبي استخدام منتجات التقشير قبل الجلسة بـ 3 أيام",
  ],
  after: [
    "استخدمي الكريم المرطب المهدئ الذي سنقدمه لكِ",
    "تجنبي التعرض للشمس واستخدمي واقي الشمس",
    "لا تستخدمي منتجات التقشير لمدة أسبوع",
    "تجنبي الحمام الساخن والحمامات البخارية",
    "اشربي الماء بكميات كافية للحفاظ على ترطيب البشرة",
  ],
};

export const userData = {
  name: "سارة أحمد",
  email: "sara.ahmed@example.com",
  phone: "+970501234567",
  memberSince: "يناير 2023",
  totalSessions: 15,
  upcomingSessions: [
    {
      id: 1,
      service: "إزالة الشعر بالليزر - الوجه",
      date: "2024-12-20",
      time: "2:00 م",
      status: "مؤكدة",
      room: "غرفة الليزر 1",
    },
    {
      id: 2,
      service: "التقشير الكيميائي",
      date: "2024-12-25",
      time: "4:00 م",
      status: "مؤكدة",
      room: "غرفة العناية 2",
    },
  ],
  recentSessions: [
    {
      id: 1,
      service: "إزالة الشعر بالليزر - الساقين",
      date: "2024-12-10",
      status: "مكتملة",
      rating: 5,
    },
    {
      id: 2,
      service: "الميكرونيدلينغ",
      date: "2024-12-05",
      status: "مكتملة",
      rating: 5,
    },
    {
      id: 3,
      service: "فيسيال الذهب",
      date: "2024-11-28",
      status: "مكتملة",
      rating: 4,
    },
  ],
  bundles: [
    {
      name: "باقة الليزر الذهبية",
      totalSessions: 6,
      remainingSessions: 3,
      expiresAt: "2025-03-15",
    },
  ],
};

export const adminData = {
  stats: {
    weeklyBookings: 45,
    roomOccupancy: 78,
    topService: "إزالة الشعر بالليزر - الوجه",
    averageRating: 4.8,
  },
  bookings: [
    {
      id: 1,
      customer: "فاطمة أحمد",
      service: "إزالة الشعر بالليزر - الوجه",
      section: "ليزر",
      room: "غرفة الليزر 1",
      staff: "د. نورا",
      date: "2024-12-20",
      time: "2:00 م",
      status: "مؤكدة",
      notes: "بشرة حساسة - استخدام درجة منخفضة",
    },
    {
      id: 2,
      customer: "نورا السعد",
      service: "التقشير الكيميائي",
      section: "عناية بالبشرة",
      room: "غرفة العناية 2",
      staff: "أ. سارة",
      date: "2024-12-20",
      time: "3:30 م",
      status: "مكتملة",
      notes: "نتائج ممتازة - لا توجد آثار جانبية",
    },
  ],
  rooms: [
    {
      id: 1,
      name: "غرفة الليزر 1",
      section: "ليزر",
      status: "نشطة",
      capacity: 1,
    },
    {
      id: 2,
      name: "غرفة الليزر 2",
      section: "ليزر",
      status: "نشطة",
      capacity: 1,
    },
    {
      id: 3,
      name: "غرفة العناية 1",
      section: "عناية بالبشرة",
      status: "نشطة",
      capacity: 1,
    },
    {
      id: 4,
      name: "غرفة العناية 2",
      section: "عناية بالبشرة",
      status: "نشطة",
      capacity: 1,
    },
    { id: 5, name: "غرفة VIP", section: "VIP", status: "نشطة", capacity: 1 },
  ],
  staff: [
    {
      id: 1,
      name: "د. نورا أحمد",
      section: "ليزر",
      avatar: "👩‍⚕️",
      hours: "9 ص - 6 م",
    },
    {
      id: 2,
      name: "أ. سارة محمد",
      section: "عناية بالبشرة",
      avatar: "👩‍🔬",
      hours: "10 ص - 7 م",
    },
    {
      id: 3,
      name: "د. فاطمة علي",
      section: "VIP",
      avatar: "👩‍💼",
      hours: "2 م - 10 م",
    },
  ],
  feedback: [
    {
      id: 1,
      customer: "فاطمة أحمد",
      service: "إزالة الشعر بالليزر",
      rating: 5,
      comment: "تجربة رائعة جداً! المركز فاخر والخدمة ممتازة.",
      status: "موافق عليها",
      date: "2024-12-15",
    },
    {
      id: 2,
      customer: "نورا السعد",
      service: "التقشير الكيميائي",
      rating: 4,
      comment: "خدمة جيدة جداً، النتائج ممتازة.",
      status: "في الانتظار",
      date: "2024-12-18",
    },
  ],
};

export const timeSlots = [
  "9:00 ص",
  "10:00 ص",
  "11:00 ص",
  "12:00 م",
  "2:00 م",
  "3:00 م",
  "4:00 م",
  "5:00 م",
  "6:00 م",
  "7:00 م",
  "8:00 م",
  "9:00 م",
];

export const weekDays = [
  "السبت",
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];

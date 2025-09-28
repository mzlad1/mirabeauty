import React, { useState } from "react";
import "./FAQPage.css";

const FAQPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqData = [
    {
      id: 1,
      category: "general",
      question: "ما هي أوقات العمل في مركز ميرا بيوتي؟",
      answer:
        "نحن نعمل من الأحد إلى الخميس من 9:00 صباحاً إلى 6:00 مساءً، ويوم السبت من 10:00 صباحاً إلى 4:00 مساءً. نحن مغلقون يوم الجمعة.",
    },
    {
      id: 2,
      category: "general",
      question: "أين يقع مركز ميرا بيوتي؟",
      answer:
        "يقع مركزنا في قلب رام الله، شارع ركب، مجمع النخيل التجاري، الطابق الثاني. يمكنكم الوصول إلينا بسهولة عبر وسائل النقل العام أو السيارة الخاصة مع توفر مواقف مجانية.",
    },
    {
      id: 3,
      category: "services",
      question: "كم عدد الجلسات المطلوبة لإزالة الشعر بالليزر؟",
      answer:
        "عادة ما نحتاج إلى 6-8 جلسات للحصول على نتائج مثلى، ولكن هذا يختلف حسب نوع الشعر ولون البشرة والمنطقة المراد إزالة الشعر منها. سيقوم أخصائيونا بتقييم حالتك وتحديد العدد المناسب من الجلسات.",
    },
    {
      id: 4,
      category: "services",
      question: "هل علاجات الليزر آمنة لجميع أنواع البشرة؟",
      answer:
        "نعم، نستخدم أحدث أجهزة الليزر التي تناسب جميع أنواع البشرة والألوان. أجهزتنا معتمدة من FDA وآمنة تماماً عند استخدامها من قبل متخصصين مدربين.",
    },
    {
      id: 5,
      category: "booking",
      question: "كيف يمكنني حجز موعد؟",
      answer:
        "يمكنكم حجز موعد من خلال موقعنا الإلكتروني، أو الاتصال بنا على رقم الهاتف، أو زيارة المركز مباشرة. ننصح بالحجز المسبق لضمان الحصول على الموعد المناسب لكم.",
    },
    {
      id: 6,
      category: "booking",
      question: "هل يمكنني إلغاء أو تعديل موعدي؟",
      answer:
        "نعم، يمكنكم إلغاء أو تعديل موعدكم حتى 24 ساعة قبل الموعد المحدد بدون أي رسوم إضافية. للإلغاء في وقت أقل من 24 ساعة، قد يتم تطبيق رسوم إلغاء.",
    },
    {
      id: 7,
      category: "pricing",
      question: "ما هي أسعار الخدمات؟",
      answer:
        "تختلف أسعار خدماتنا حسب نوع العلاج والمنطقة المراد علاجها. نقدم باقات متنوعة وعروض خاصة. للحصول على تقييم دقيق للأسعار، يرجى زيارة صفحة الخدمات أو الاتصال بنا.",
    },
    {
      id: 8,
      category: "pricing",
      question: "هل تقدمون خصومات أو عروض خاصة؟",
      answer:
        "نعم، نقدم عروض شهرية وخصومات للعملاء الجدد والعروض الموسمية. كما نوفر برنامج نقاط الولاء للعملاء المنتظمين. تابعوا حساباتنا على وسائل التواصل الاجتماعي للاطلاع على أحدث العروض.",
    },
    {
      id: 9,
      category: "preparation",
      question: "كيف أستعد لجلسة الليزر؟",
      answer:
        "يجب تجنب التعرض لأشعة الشمس لمدة أسبوعين قبل الجلسة، وعدم نتف أو إزالة الشعر بالشمع لمدة 4 أسابيع. يُفضل حلق المنطقة قبل يوم من الجلسة. سنرسل لكم تعليمات مفصلة عند حجز الموعد.",
    },
    {
      id: 10,
      category: "preparation",
      question: "ما الذي يجب تجنبه بعد جلسة العلاج؟",
      answer:
        "يجب تجنب التعرض لأشعة الشمس المباشرة لمدة 48 ساعة، وعدم استخدام المقشرات أو المنتجات القاسية. استخدمي مرطب لطيف وواقي الشمس عند الخروج. تجنبي أيضاً الساونا والحمامات الساخنة لمدة 24 ساعة.",
    },
    {
      id: 11,
      category: "safety",
      question: "هل هناك آثار جانبية للعلاجات؟",
      answer:
        "معظم علاجاتنا آمنة مع آثار جانبية طفيفة ومؤقتة مثل احمرار خفيف أو تورم بسيط يختفي خلال ساعات قليلة. سيشرح لكم أخصائيونا جميع الآثار المحتملة ويقدمون تعليمات الرعاية اللاحقة.",
    },
    {
      id: 12,
      category: "safety",
      question: "هل العلاجات مناسبة للحوامل؟",
      answer:
        "لا ننصح بإجراء علاجات الليزر أثناء فترة الحمل والرضاعة كإجراء احترازي، رغم عدم وجود دراسات تثبت ضررها. يمكنكم استئناف العلاجات بعد انتهاء فترة الرضاعة.",
    },
  ];

  const categories = [
    { id: "all", name: "جميع الأسئلة" },
    { id: "general", name: "أسئلة عامة" },
    { id: "services", name: "الخدمات" },
    { id: "booking", name: "الحجز والمواعيد" },
    { id: "pricing", name: "الأسعار والدفع" },
    { id: "preparation", name: "التحضير والرعاية" },
    { id: "safety", name: "الأمان والسلامة" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleQuestion = (questionId) => {
    setActiveQuestion(activeQuestion === questionId ? null : questionId);
  };

  return (
    <div className="faq-page">
      {/* Page Header */}

      {/* FAQ Content */}
      <section className="faq-content section">
        <div className="container">
          {/* Search and Filter */}
          <div className="faq-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="ابحثي عن سؤالك..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-btn ${
                    selectedCategory === category.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="faq-list">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className={`faq-item ${
                    activeQuestion === faq.id ? "active" : ""
                  }`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleQuestion(faq.id)}
                  >
                    <span className="question-text">{faq.question}</span>
                    <span className="question-icon">
                      {activeQuestion === faq.id ? "−" : "+"}
                    </span>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>لم نجد أي نتائج</h3>
                <p>
                  لم نتمكن من العثور على أسئلة تطابق بحثك. جربي كلمات مختلفة أو
                  تصفحي الفئات المختلفة.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Quick Tips */}
      <section className="quick-tips section">
        <div className="container">
          <h2>نصائح سريعة</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">💡</div>
              <h3>نصيحة للحجز</h3>
              <p>
                احجزي موعدك مبكراً للحصول على الوقت المناسب لك، خاصة في نهاية
                الأسبوع والمواسم الخاصة.
              </p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">⏰</div>
              <h3>قبل الجلسة</h3>
              <p>
                تأكدي من قراءة تعليمات التحضير المرسلة إليك عبر الرسائل النصية
                أو البريد الإلكتروني.
              </p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📱</div>
              <h3>تطبيق الجوال</h3>
              <p>
                حملي تطبيقنا للحصول على تذكيرات المواعيد وعروض خاصة وإدارة
                حجوزاتك بسهولة.
              </p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🎁</div>
              <h3>نقاط الولاء</h3>
              <p>
                اجمعي نقاط مع كل زيارة واستبدليها بخصومات وخدمات مجانية في
                زياراتك القادمة.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;

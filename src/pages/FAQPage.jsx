import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FAQPage.css";
import { getAllFAQs, searchFAQs } from "../services/faqService";

const FAQPage = () => {
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch FAQs from Firebase
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedFAQs;
        if (searchTerm) {
          fetchedFAQs = await searchFAQs(searchTerm);
        } else {
          fetchedFAQs = await getAllFAQs();
        }

        setFaqData(fetchedFAQs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setError("حدث خطأ في تحميل الأسئلة الشائعة. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [searchTerm]);

  const categories = [
    { id: "all", name: "جميع الأسئلة" },
    { id: "general", name: "أسئلة عامة" },
    { id: "services", name: "الخدمات" },
    { id: "booking", name: "الحجز والمواعيد" },
    { id: "pricing", name: "الأسعار والدفع" },
    { id: "preparation", name: "التحضير والرعاية" },
    { id: "safety", name: "الأمان والسلامة" },
  ];

  // Group FAQs by category
  const groupedFAQs = categories.reduce((acc, cat) => {
    if (cat.id === "all") return acc;
    acc[cat.id] = faqData.filter((faq) => faq.category === cat.id);
    return acc;
  }, {});

  // Filtered by search
  const filteredGroupedFAQs = Object.fromEntries(
    Object.entries(groupedFAQs).map(([catId, faqs]) => [
      catId,
      faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    ])
  );

  const toggleQuestion = (questionId) => {
    setActiveQuestion(activeQuestion === questionId ? null : questionId);
  };

  return (
    <div className="faq-page">
      {/* Breadcrumb Section */}
      <section className="faq-breadcrumb-section">
        <div className="container">
          <div className="breadcrumb-container">
            <nav className="faq-breadcrumb">
              <button
                onClick={() => navigate("/")}
                className="faq-breadcrumb-link"
              >
                الرئيسية
              </button>
              <span className="faq-breadcrumb-separator">/</span>
              <span className="faq-breadcrumb-current">الأسئلة الشائعة</span>
            </nav>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-content section">
        <div className="container">
          {loading ? (
            <div className="faq-loading">
              <div className="loading-spinner"></div>
              <p>جاري تحميل الأسئلة الشائعة...</p>
            </div>
          ) : error ? (
            <div className="faq-error">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : (
            /* Category List */
            <div className="faq-categories">
              {categories
                .filter((cat) => cat.id !== "all")
                .map((cat) => (
                  <div key={cat.id} className="faq-category-container active">
                    <div className="faq-category-header">
                      <span>{cat.name}</span>
                    </div>
                    {
                      <div className="faq-list">
                        {filteredGroupedFAQs[cat.id] &&
                        filteredGroupedFAQs[cat.id].length > 0 ? (
                          filteredGroupedFAQs[cat.id].map((faq) => (
                            <div
                              key={faq.id}
                              className={`faq-item${
                                activeQuestion === faq.id ? " active" : ""
                              }`}
                            >
                              <button
                                className="faq-question"
                                onClick={() => toggleQuestion(faq.id)}
                              >
                                <span className="question-text">
                                  {faq.question}
                                </span>
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
                              لم نتمكن من العثور على أسئلة تطابق بحثك. جربي
                              كلمات مختلفة أو تصفحي الفئات المختلفة.
                            </p>
                          </div>
                        )}
                      </div>
                    }
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FAQPage;

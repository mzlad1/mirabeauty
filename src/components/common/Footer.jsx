import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-sections">
            {/* Company Info - simplified */}
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-text">
                  <h3>Mira Beauty Clinic</h3>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4>روابط سريعة</h4>
              <ul className="footer-links">
                <li>
                  <button onClick={() => handleNavigation("/")}>
                    الرئيسية
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/services")}>
                    الخدمات
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/products")}>
                    المنتجات
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/book")}>
                    احجز الآن
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/faq")}>
                    الأسئلة الشائعة
                  </button>
                </li>
              </ul>
            </div>


            {/* Contact Info */}
            <div className="footer-section">
              <h4>تواصل معنا</h4>
              <div className="contact-info">
                {/* Pair 1: Phone vs Hours */}
                <div className="contact-item contact-inline">
                  <span className="contact-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.21 2.2z"/>
                    </svg>
                  </span>
                  <div className="contact-details">
                    <strong>الهاتف</strong>
                    <p>+966 11 234 5678</p>
                  </div>
                </div>
                <div className="contact-item contact-inline">
                  <span className="contact-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                    </svg>
                  </span>
                  <div className="contact-details">
                    <strong>العنوان</strong>
                    <p>رام الله، شارع ركب، مجمع النخيل التجاري، الطابق الثاني</p>
                  </div>
                </div>

                {/* Pair 2: Hours */}
                <div className="contact-item contact-inline">
                  <span className="contact-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.41l3.3 1.9-.75 1.3L11 13V7h2v5.41z"/>
                    </svg>
                  </span>
                  <div className="contact-details">
                    <strong>أوقات العمل</strong>
                    <p>الأحد - الخميس: 9:00 ص - 6:00 م | السبت: 10:00 ص - 4:00 م</p>
                  </div>
                </div>
                {/* Email removed as requested */}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} مركز ميرا بيوتي. جميع الحقوق محفوظة.</p>
            </div>
            <div className="footer-legal">
              <a href="#" className="legal-link">
                سياسة الخصوصية
              </a>
              <a href="#" className="legal-link">
                الشروط والأحكام
              </a>
              <a href="#" className="legal-link">
                سياسة الإلغاء
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="floating-actions">
        <a
          href="https://wa.me/966112345678"
          className="floating-btn whatsapp-btn"
          target="_blank"
          rel="noopener noreferrer"
          title="واتساب"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default Footer;

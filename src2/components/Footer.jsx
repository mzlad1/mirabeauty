import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">🌹</div>
              <div className="logo-text">
                <h3>Mira Beauty Clinic</h3>
                <p></p>
              </div>
            </div>
            <p className="footer-description">
              نقدم لكِ أفضل خدمات الليزر والعناية بالبشرة في أجواء فاخرة ومريحة،
              مع أحدث التقنيات وأعلى معايير الجودة.
            </p>
          </div>

          <div className="footer-section">
            <h4>روابط سريعة</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">الرئيسية</Link>
              </li>
              <li>
                <Link to="/services">خدماتنا</Link>
              </li>
              <li>
                <Link to="/booking">احجزي الآن</Link>
              </li>
              <li>
                <Link to="/products">منتجاتنا</Link>
              </li>
              <li>
                <Link to="/faq">الأسئلة الشائعة</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>معلومات التواصل</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <p>فلسطين , الطيرة</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <p>+970 50 123 4567</p>
                  <p>+970 11 234 5678</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <p>info@roselaser.com</p>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>ساعات العمل</h4>
            <div className="working-hours">
              <div className="hours-item">
                <span>السبت - الخميس:</span>
                <span>9:00 ص - 10:00 م</span>
              </div>
              <div className="hours-item">
                <span>الجمعة:</span>
                <span>2:00 م - 10:00 م</span>
              </div>
            </div>

            <div className="social-links">
              <h5>تابعينا</h5>
              <div className="social-icons">
                <a href="#" className="social-link instagram">
                  📷
                </a>
                <a href="#" className="social-link snapchat">
                  👻
                </a>
                <a href="#" className="social-link tiktok">
                  🎵
                </a>
                <a
                  href="https://wa.me/966501234567"
                  className="social-link whatsapp"
                >
                  💬
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Mira Beauty Clinic. جميع الحقوق محفوظة.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">سياسة الخصوصية</Link>
              <Link to="/terms">شروط الاستخدام</Link>
              <Link to="/admin">لوحة التحكم</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

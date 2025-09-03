import React, { useState } from "react";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { userData } from "../../data/arabicData";
import "./Settings.css";

const Settings = () => {
  const [settings, setSettings] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    language: "ar",
    whatsappNotifications: true,
    smsNotifications: true,
    emailNotifications: false,
    whatsappConsent: true,
    preSessionPreferences: "بشرتي حساسة، أفضّل استخدام درجة خفيفة من الليزر",
    promoCode: "",
    bundleBalance: 3,
  });

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert("تم حفظ الإعدادات بنجاح! (هذا عرض تجريبي)");
  };

  return (
    <div className="settings-page">
      <div className="settings-sections">
        {/* Profile Section */}
        <LuxuryCard className="settings-section">
          <h2>الملف الشخصي</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>الاسم الكامل</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="form-input"
                placeholder="أدخل اسمك الكامل"
              />
            </div>
            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="form-input"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
            <div className="form-group">
              <label>رقم الهاتف</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="form-input"
                placeholder="أدخل رقم هاتفك"
              />
            </div>
          </div>
        </LuxuryCard>

        {/* Language Section */}
        <LuxuryCard className="settings-section">
          <h2>اللغة</h2>
          <div className="language-options">
            <label className="language-option">
              <input
                type="radio"
                name="language"
                value="ar"
                checked={settings.language === "ar"}
                onChange={(e) => handleInputChange("language", e.target.value)}
              />
              <span className="language-label">العربية (افتراضي)</span>
            </label>
            <label className="language-option">
              <input
                type="radio"
                name="language"
                value="en"
                checked={settings.language === "en"}
                onChange={(e) => handleInputChange("language", e.target.value)}
              />
              <span className="language-label">English</span>
            </label>
          </div>
        </LuxuryCard>

        {/* Notifications Section */}
        <LuxuryCard className="settings-section">
          <h2>الإشعارات</h2>
          <div className="notification-settings">
            <div className="notification-item">
              <div className="notification-info">
                <h3>إشعارات واتساب</h3>
                <p>تذكيرات الجلسات عبر واتساب (24 ساعة و 3 ساعات قبل الموعد)</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.whatsappNotifications}
                  onChange={(e) =>
                    handleInputChange("whatsappNotifications", e.target.checked)
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h3>رسائل SMS</h3>
                <p>تذكيرات الجلسات عبر الرسائل النصية</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) =>
                    handleInputChange("smsNotifications", e.target.checked)
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h3>البريد الإلكتروني</h3>
                <p>تحديثات وعروض حصرية عبر البريد الإلكتروني</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleInputChange("emailNotifications", e.target.checked)
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </LuxuryCard>

        {/* WhatsApp Consent */}
        <LuxuryCard className="settings-section">
          <h2>موافقة واتساب</h2>
          <div className="consent-section">
            <label className="consent-checkbox">
              <input
                type="checkbox"
                checked={settings.whatsappConsent}
                onChange={(e) =>
                  handleInputChange("whatsappConsent", e.target.checked)
                }
              />
              <span className="consent-text">
                أوافق على تلقي الرسائل والتذكيرات عبر واتساب من مركز Mira Beauty
                Clinic ليزر وسكين
              </span>
            </label>
          </div>
        </LuxuryCard>

        {/* Pre-session Preferences */}
        <LuxuryCard className="settings-section">
          <h2>تفضيلات ما قبل الجلسة</h2>
          <div className="form-group">
            <label>ملاحظات خاصة للجلسات</label>
            <textarea
              value={settings.preSessionPreferences}
              onChange={(e) =>
                handleInputChange("preSessionPreferences", e.target.value)
              }
              className="form-textarea"
              placeholder="اكتبي أي ملاحظات خاصة أو تفضيلات للجلسات..."
              rows="4"
            />
          </div>
        </LuxuryCard>

        {/* Coupons & Loyalty */}
        <LuxuryCard className="settings-section">
          <h2>الكوبونات والعضوية</h2>
          <div className="loyalty-section">
            <div className="form-group">
              <label>كود الخصم</label>
              <div className="promo-input-group">
                <input
                  type="text"
                  value={settings.promoCode}
                  onChange={(e) =>
                    handleInputChange("promoCode", e.target.value)
                  }
                  className="form-input"
                  placeholder="أدخل كود الخصم"
                />
                <Button variant="secondary" size="sm">
                  تطبيق
                </Button>
              </div>
            </div>
            <div className="bundle-info">
              <h3>رصيد الباقة</h3>
              <div className="bundle-balance">
                <span className="balance-number">{settings.bundleBalance}</span>
                <span className="balance-text">جلسة متبقية</span>
              </div>
            </div>
          </div>
        </LuxuryCard>

        {/* Privacy Section */}
        <LuxuryCard className="settings-section">
          <h2>الخصوصية</h2>
          <div className="privacy-actions">
            <Button variant="secondary" size="md">
              تصدير بياناتي
            </Button>
            <Button variant="danger" size="md">
              حذف حسابي
            </Button>
          </div>
          <p className="privacy-note">
            يمكنك تصدير جميع بياناتك أو حذف حسابك نهائياً. سيتم حذف جميع
            المعلومات والجلسات المرتبطة بحسابك.
          </p>
        </LuxuryCard>

        {/* Save Button */}
        <div className="save-section">
          <Button variant="luxury" size="lg" onClick={handleSave}>
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

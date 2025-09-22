import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import "./Settings.css";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    cancellationHours: 24,
    reminder24h: true,
    reminder3h: true,
    whatsappTemplate: "مرحباً {name}، تذكير بموعدك غداً في {time}",
    smsTemplate: "تذكير: موعدك في مركز Mira Beauty Clinic ليزر غداً في {time}",
    emailTemplate: "مرحباً {name}، نذكرك بموعدك القادم...",
    location: "فلسطين , الطيرة",
    mapLink: "https://maps.google.com/...",
    vipPricing: true,
    vipNotes: "أسعار VIP تشمل خدمات إضافية ومعاملة مميزة",
  });

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert("تم حفظ الإعدادات بنجاح! (هذا عرض تجريبي)");
  };

  return (
    <AdminLayout>
      <div className="admin-settings-page">
        <div className="admin-settings-container">
          <div className="admin-settings-header">
            <h1>إعدادات النظام</h1>
            <p>إدارة إعدادات المركز والنظام</p>
          </div>

          <div className="settings-sections">
            <LuxuryCard className="settings-section">
              <h2>سياسة الإلغاء</h2>
              <div className="settings-form-group">
                <label>ساعات الإلغاء المسموحة</label>
                <input
                  type="number"
                  value={settings.cancellationHours}
                  onChange={(e) =>
                    handleInputChange("cancellationHours", e.target.value)
                  }
                  className="settings-form-input"
                  min="1"
                  max="72"
                />
                <p className="form-help">
                  عدد الساعات قبل الموعد التي يمكن للعميلة إلغاء الحجز خلالها
                </p>
              </div>
            </LuxuryCard>

            <LuxuryCard className="settings-section">
              <h2>إعدادات التذكيرات</h2>
              <div className="reminder-settings">
                <div className="reminder-item">
                  <label className="reminder-label">
                    <input
                      type="checkbox"
                      checked={settings.reminder24h}
                      onChange={(e) =>
                        handleInputChange("reminder24h", e.target.checked)
                      }
                    />
                    <span>تذكير قبل 24 ساعة</span>
                  </label>
                </div>
                <div className="reminder-item">
                  <label className="reminder-label">
                    <input
                      type="checkbox"
                      checked={settings.reminder3h}
                      onChange={(e) =>
                        handleInputChange("reminder3h", e.target.checked)
                      }
                    />
                    <span>تذكير قبل 3 ساعات</span>
                  </label>
                </div>
              </div>
            </LuxuryCard>

            <LuxuryCard className="settings-section">
              <h2>قوالب الرسائل</h2>
              <div className="template-settings">
                <div className="admin-form-group">
                  <label>قالب واتساب</label>
                  <textarea
                    value={settings.whatsappTemplate}
                    onChange={(e) =>
                      handleInputChange("whatsappTemplate", e.target.value)
                    }
                    className="admin-form-textarea"
                    rows="3"
                  />
                </div>
                <div className="admin-form-group">
                  <label>قالب SMS</label>
                  <textarea
                    value={settings.smsTemplate}
                    onChange={(e) =>
                      handleInputChange("smsTemplate", e.target.value)
                    }
                    className="admin-form-textarea"
                    rows="3"
                  />
                </div>
                <div className="admin-form-group">
                  <label>قالب البريد الإلكتروني</label>
                  <textarea
                    value={settings.emailTemplate}
                    onChange={(e) =>
                      handleInputChange("emailTemplate", e.target.value)
                    }
                    className="admin-form-textarea"
                    rows="4"
                  />
                </div>
              </div>
            </LuxuryCard>

            <LuxuryCard className="settings-section">
              <h2>معلومات الموقع</h2>
              <div className="location-settings">
                <div className="admin-form-group">
                  <label>العنوان</label>
                  <input
                    type="text"
                    value={settings.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="admin-form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>رابط الخريطة</label>
                  <input
                    type="url"
                    value={settings.mapLink}
                    onChange={(e) =>
                      handleInputChange("mapLink", e.target.value)
                    }
                    className="admin-form-input"
                  />
                </div>
              </div>
            </LuxuryCard>

            <LuxuryCard className="settings-section">
              <h2>إعدادات VIP</h2>
              <div className="vip-settings">
                <div className="admin-form-group">
                  <label className="vip-toggle">
                    <input
                      type="checkbox"
                      checked={settings.vipPricing}
                      onChange={(e) =>
                        handleInputChange("vipPricing", e.target.checked)
                      }
                    />
                    <span>تفعيل أسعار VIP</span>
                  </label>
                </div>
                <div className="admin-form-group">
                  <label>ملاحظات VIP</label>
                  <textarea
                    value={settings.vipNotes}
                    onChange={(e) =>
                      handleInputChange("vipNotes", e.target.value)
                    }
                    className="admin-form-textarea"
                    rows="3"
                  />
                </div>
              </div>
            </LuxuryCard>

            <div className="save-section">
              <Button variant="luxury" size="lg" onClick={handleSave}>
                حفظ الإعدادات
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

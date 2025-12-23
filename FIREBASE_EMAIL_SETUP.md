# إعداد قالب البريد الإلكتروني لإعادة تعيين كلمة المرور في Firebase

## نظرة عامة

تم إنشاء نظام إعادة تعيين كلمة المرور باستخدام Firebase Authentication. يتضمن هذا النظام:

- صفحة إعادة تعيين كلمة المرور (`ResetPasswordPage.jsx`)
- قالب بريد إلكتروني مخصص بتصميم احترافي
- تكامل كامل مع Firebase Authentication

---

## الخطوات لتفعيل قالب البريد الإلكتروني المخصص في Firebase

### 1. الدخول إلى Firebase Console

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك (mirabeauty)
3. من القائمة الجانبية، اختر **Authentication**
4. انقر على تبويب **Templates**

### 2. تخصيص قالب إعادة تعيين كلمة المرور

#### الطريقة الأولى: استخدام محرر Firebase (مُوصى به للبدء السريع)

1. في صفحة Templates، اختر **Password reset**
2. انقر على أيقونة القلم (Edit) لتحرير القالب
3. قم بتخصيص القالب باللغة العربية:

**العنوان (Subject):**

```
إعادة تعيين كلمة المرور - مركز ميرا بيوتي
```

**محتوى البريد (Email body):**

```html
<p dir="rtl" style="text-align: right; font-family: Arial, sans-serif;">
  مرحباً،
</p>

<p dir="rtl" style="text-align: right; font-family: Arial, sans-serif;">
  لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في مركز ميرا بيوتي.
</p>

<p dir="rtl" style="text-align: right; font-family: Arial, sans-serif;">
  لإعادة تعيين كلمة المرور، يرجى النقر على الرابط أدناه:
</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="%LINK%"
     style="background: linear-gradient(135deg, #b8921f 0%, #d4a933 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            display: inline-block;">
    إعادة تعيين كلمة المرور
  </a>
</p>

<p dir="rtl" style="text-align: right; font-family: Arial, sans-serif; color: #666;">
  <strong>ملاحظة:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط.
</p>

<p dir="rtl" style="text-align: right; font-family: Arial, sans-serif; color: #666;">
  إذا لم تطلبي إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.
</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

<p dir="rtl" style="text-align: right; font-family: Arial, sans-serif;">
  مع أطيب التحيات،<br>
  <strong>فريق مركز ميرا بيوتي</strong>
</p>
</p>
```

4. احفظ التغييرات بالنقر على **Save**

#### الطريقة الثانية: استخدام القالب المخصص الكامل (للتخصيص المتقدم)

إذا أردت استخدام قالب HTML الكامل المُصمم في الملف `password-reset-template.html`:

1. **للأسف، Firebase لا يدعم رفع ملفات HTML مخصصة بالكامل**
2. **الحل البديل:** استخدم خدمة بريد إلكتروني خارجية مثل:
   - SendGrid
   - Mailgun
   - AWS SES
3. أو استخدم Firebase Cloud Functions لإرسال بريد مخصص:

```javascript
// في Firebase Cloud Functions
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const fs = require("fs");

exports.sendPasswordResetEmail = functions.auth.user().onCreate((user) => {
  const emailTemplate = fs.readFileSync("password-reset-template.html", "utf8");
  // أرسل البريد باستخدام nodemailer
});
```

### 3. تخصيص اسم المرسل والبريد الإلكتروني

1. في صفحة Templates، مرر إلى أسفل
2. في قسم **From**, قم بتخصيص:
   - **From name:** مركز ميرا بيوتي - Mira Beauty Clinic
   - **From email:** sاستخدم البريد الإلكتروني المرتبط بمشروعك

### 4. اختبار النظام

1. افتح التطبيق واذهب إلى `/reset-password`
2. أدخل بريد إلكتروني مسجل
3. انقر على "إرسال رابط إعادة التعيين"
4. تحقق من صندوق الوارد
5. انقر على الرابط واختبر إعادة تعيين كلمة المرور

---

## ملاحظات مهمة

### الأمان

- الرابط صالح لمدة **ساعة واحدة** فقط (معرّف في Firebase)
- لا يمكن استخدام الرابط أكثر من مرة
- إذا لم يطلب المستخدم إعادة التعيين، لن يحدث شيء

### التخصيص الإضافي

لتعديل مدة صلاحية الرابط:

1. اذهب إلى Firebase Console
2. Authentication > Settings
3. ابحث عن **Email link expiration time**
4. قم بتعديل المدة (الافتراضي: ساعة واحدة)

### الأخطاء الشائعة وحلولها

**خطأ: "User not found"**

- الحل: تأكد من أن البريد الإلكتروني مسجل في Firebase Authentication

**خطأ: "Too many requests"**

- الحل: انتظر قليلاً قبل المحاولة مرة أخرى (Firebase يحد من عدد الطلبات)

**البريد لا يصل:**

- تحقق من مجلد الرسائل غير المرغوب فيها (Spam)
- تأكد من أن Firebase Authentication مُفعّل
- تحقق من إعدادات المصادقة في Firebase Console

---

## الملفات المُنشأة

1. **`ResetPasswordPage.jsx`** - صفحة إعادة تعيين كلمة المرور
2. **`ResetPasswordPage.css`** - أنماط الصفحة
3. **`password-reset-template.html`** - قالب البريد الإلكتروني (للمرجع أو للاستخدام مع خدمات خارجية)
4. تم تحديث **`LoginPage.jsx`** - إضافة رابط "نسيت كلمة المرور؟"
5. تم تحديث **`App.jsx`** - إضافة مسار `/reset-password`

---

## دعم إضافي

إذا واجهت أي مشاكل:

1. راجع [وثائق Firebase Authentication](https://firebase.google.com/docs/auth/web/manage-users)
2. تأكد من تفعيل Email/Password authentication في Firebase Console
3. تحقق من console logs في المتصفح للأخطاء

---

## تحديثات مستقبلية محتملة

1. إضافة خاصية تغيير كلمة المرور من صفحة الملف الشخصي
2. إضافة إشعارات عند تغيير كلمة المرور بنجاح
3. إضافة خاصية المصادقة الثنائية (2FA)
4. إضافة سجل لمحاولات تسجيل الدخول الفاشلة

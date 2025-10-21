# Firebase Setup Guide for MiraBeauty

## Initial Setup Instructions

Since you've migrated from sample data to Firebase, here's how to set up your initial admin and staff users:

### 1. Create Initial Admin User

**Option A: Manual Registration (Recommended for first admin)**

1. Go to your app registration page
2. Temporarily modify the registration to allow admin creation
3. Register with admin email: `admin@mirabeauty.com`
4. After registration, manually update the user document in Firestore to change role to "admin"

**Option B: Firebase Console**

1. Go to Firebase Console > Authentication
2. Add user manually with email: `admin@mirabeauty.com`
3. Set a secure password
4. Go to Firestore Database
5. Create a document in `users` collection with the user's UID as document ID:

```json
{
  "uid": "USER_UID_FROM_AUTH",
  "email": "admin@mirabeauty.com",
  "name": "د. سارة أحمد",
  "phone": "+970501234567",
  "role": "admin",
  "permissions": ["all"],
  "active": true,
  "joinDate": "CURRENT_TIMESTAMP",
  "createdAt": "CURRENT_TIMESTAMP",
  "updatedAt": "CURRENT_TIMESTAMP"
}
```

### 2. Create Staff Users

Once you have an admin account:

1. Login as admin
2. Go to dashboard
3. Use the "Add Staff" functionality (needs to be implemented)
4. Staff will be created with Firebase Auth + Firestore document

### 3. Customer Registration

Customers can now register normally through the registration page. The system will:

- Create Firebase Auth account
- Create Firestore user document with role "customer"
- Redirect to profile page

### 4. Test Users for Development

For testing, you can create these accounts manually:

**Test Admin:**

- Email: `test.admin@mirabeauty.com`
- Password: `admin123`
- Role: admin

**Test Staff:**

- Email: `test.staff@mirabeauty.com`
- Password: `staff123`
- Role: staff

**Test Customer:**

- Email: `test.customer@mirabeauty.com`
- Password: `customer123`
- Role: customer

### 5. Security Rules

Make sure to set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admin can read all users
      allow read: if request.auth != null &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Other collections (appointments, services, etc.)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Next Steps

After setting up users:

1. Migrate appointments data to Firestore
2. Migrate services data to Firestore
3. Migrate products data to Firestore
4. Set up storage for images
5. Implement admin dashboard for user management

# 💅 MiraBeauty Clinic

A comprehensive beauty clinic management system built with React and Firebase. This modern web application streamlines appointment booking, product sales, and client management for beauty clinics and spas.

![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-12.4.0-orange.svg)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple.svg)

## ✨ Features

### 👥 Multi-Role System

- **Customer Portal**: Book appointments, browse products, manage orders
- **Staff Dashboard**: View and manage assigned appointments
- **Admin Panel**: Complete control over services, products, users, and analytics

### 📅 Appointment Management

- Real-time appointment booking with calendar integration
- Drag-and-drop timeline view for admin/staff
- Service selection with duration and pricing
- Staff specialization matching
- Appointment status tracking (pending, confirmed, completed, cancelled)

### 🛍️ E-Commerce Features

- Product catalog with categories and filtering
- Shopping cart functionality
- Order management and tracking
- Product image uploads and management
- Inventory control

### 💬 Customer Engagement

- FAQ system with categories
- Customer feedback and ratings
- User consultations and skin type recommendations
- Service reviews

### 📊 Admin Features

- Comprehensive dashboard with analytics
- User management (customers and staff)
- Service and product CRUD operations
- Order and appointment tracking
- Revenue reports and statistics
- Feedback monitoring

### 🔐 Authentication & Security

- Firebase Authentication
- Role-based access control (Customer, Staff, Admin)
- Protected routes
- Secure profile management

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mirabeauty
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   Update [src/config/firebase.js](src/config/firebase.js) with your Firebase credentials:

   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id",
     measurementId: "your-measurement-id",
   };
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## 🛠️ Technology Stack

### Frontend

- **React 18.2** - UI framework
- **React Router DOM 6.20** - Navigation and routing
- **React Calendar 6.0** - Calendar component for bookings
- **@dnd-kit** - Drag and drop functionality

### Backend & Services

- **Firebase 12.4** - Backend-as-a-Service
  - Authentication
  - Firestore Database
  - Storage
  - Hosting (optional)

### Build Tools

- **Vite 5.0** - Fast build tool and dev server
- **ESLint** - Code linting

## 📁 Project Structure

```
mirabeauty/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── admin/      # Admin-specific components
│   │   ├── auth/       # Authentication forms
│   │   ├── common/     # Shared components
│   │   ├── customer/   # Customer-specific components
│   │   ├── dashboard/  # Dashboard components
│   │   └── profile/    # Profile components
│   ├── config/         # Configuration files
│   │   └── firebase.js # Firebase setup
│   ├── hooks/          # Custom React hooks
│   │   ├── useAuth.jsx
│   │   ├── useLoading.jsx
│   │   └── useModal.jsx
│   ├── pages/          # Page components
│   ├── services/       # API service layers
│   │   ├── appointmentsService.js
│   │   ├── authService.js
│   │   ├── productsService.js
│   │   └── ...
│   ├── styles/         # Global styles
│   │   ├── responsive.css
│   │   ├── rtl.css
│   │   └── variables.css
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Key Components

### Pages

- **HomePage**: Landing page with featured services
- **ServicesPage**: Browse available beauty services
- **ProductsPage**: Product catalog and shopping
- **BookingPage**: Appointment booking interface
- **ProfilePage**: User profile and order history
- **AdminDashboardPage**: Admin analytics and overview
- **StaffDashboardPage**: Staff appointments view

### Services Layer

- `appointmentsService.js` - Appointment CRUD operations
- `productsService.js` - Product management
- `ordersService.js` - Order processing
- `userService.js` - User data management
- `authService.js` - Authentication operations

## 🔑 User Roles

1. **Customer**

   - Browse services and products
   - Book appointments
   - Make purchases
   - View order history
   - Leave feedback

2. **Staff**

   - View assigned appointments
   - Update appointment status
   - Access limited dashboard

3. **Admin**
   - Full system access
   - Manage users, services, and products
   - View analytics and reports
   - Handle all appointments and orders
   - Configure system settings

## 📱 Responsive Design

The application is fully responsive and supports:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

RTL (Right-to-Left) support is also included for Arabic and other RTL languages.

## 📄 License

This project is private and proprietary.

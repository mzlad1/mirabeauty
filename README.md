# MiraBeauty

MiraBeauty is a modern beauty salon and e-commerce web application. It offers a seamless experience for customers, staff, and administrators, featuring online booking, product shopping, user profiles, and dashboards.

## Features

### 1. User Authentication
- Register and login for customers and staff
- Secure authentication with local storage
- Account settings and profile management

### 2. Customer Experience
- **Home Page:** Promotional banners, featured products, and services
- **Booking:** Book appointments for beauty services with date/time selection
- **Product Shopping:** Browse, view details, and add products to cart
- **Cart:** Overlay and dedicated cart page for managing purchases
- **Booking History:** View past and upcoming appointments
- **Testimonials:** Customer reviews and feedback
- **FAQ:** Frequently asked questions

### 3. Staff & Admin Dashboards
- **Admin Dashboard:**
  - View and manage all appointments
  - Customer management
  - Statistics and analytics cards
- **Staff Dashboard:**
  - View assigned appointments
  - Access to customer details

### 4. Product & Service Management
- Product and service cards with details
- Responsive product and service listing pages
- Product details page with add-to-cart functionality

### 5. Common Components
- Header and navigation bar
- Footer with contact and social links
- Loading spinner for async actions
- Responsive promotional banners

### 6. Responsive Design
- Fully responsive layout for desktop, tablet, and mobile
- RTL (Right-to-Left) support for languages like Arabic
- Custom fonts and modern UI

### 7. Utilities & Helpers
- Local storage hooks for persistent state
- Date helpers for formatting and calculations
- Constants for configuration

## Project Structure

- `src/components/` — Reusable UI components (auth, common, customer, dashboard, profile)
- `src/pages/` — Main pages (Home, Booking, Products, Cart, Profile, Admin/Staff Dashboards, FAQ)
- `src/data/` — Sample data for products, services, users, etc.
- `src/hooks/` — Custom React hooks
- `src/utils/` — Utility functions (auth, date helpers, constants)
- `src/styles/` — Global, responsive, RTL, and variable CSS
- `public/` — Static assets (fonts, images)

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```
3. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173)

## Tech Stack
- React (Vite)
- CSS Modules
- Local Storage
- Modern JavaScript (ES6+)

## Customization
- Update sample data in `src/data/`
- Modify styles in `src/styles/`
- Add or edit components in `src/components/`

## Deployment
- Ready for deployment on Vercel (see `vercel.json`)

---

**MiraBeauty** — A complete solution for beauty salons and online beauty product sales.
3. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173)

## Tech Stack
- React (Vite)
- CSS Modules
- Local Storage
- Modern JavaScript (ES6+)

## Customization
- Update sample data in `src/data/`
- Modify styles in `src/styles/`
- Add or edit components in `src/components/`

## Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Lighthouse Performance Score: > 90
- Bundle size: < 250KB (gzipped)

---

This technical documentation provides developers with the necessary information to understand and implement the MiraBeauty system. It includes data models, component architecture, API specifications, and performance requirements.

# MediCare Connect - Frontend Client

The frontend client for the MediCare Connect hospital appointment & healthcare management system.

## Technologies Used
- Next.js (App Router)
- React & TypeScript
- Tailwind CSS & DaisyUI
- Framer Motion (Animations)
- React Hot Toast (Notifications)
- Recharts (Admin Analytics)
- Stripe React (Payments)
- Firebase (Google OAuth)
- Zustand / Context API (State Management)

## Prerequisites
- Node.js (v18+)
- Firebase Project (for Google Auth)
- Stripe Account (for payments)

## Environment Variables
Create a `.env.local` file in the root of the client directory with the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## Installation & Setup
1. Clone the repository and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The client will run on `http://localhost:3000`.

## Features Included
- **Premium UI/UX**: Glassmorphism design system, dark/light theme toggle, fully responsive layout.
- **Role-based Dashboards**: Unique views and features for Patients, Doctors, and Admins.
- **Booking & Payments**: Seamless appointment booking flow with integrated Stripe checkout modal.
- **Admin Analytics**: Interactive charts using Recharts for visualizing platform performance.
- **Dynamic Content**: Server-side pagination, advanced filtering, and sorting for finding doctors.
- **Micro-animations**: Enhanced interactivity with Framer Motion.

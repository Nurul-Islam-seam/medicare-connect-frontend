# MediCare Connect - Patient & Doctor Portal

![MediCare Connect](https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200&h=400)

## Overview
MediCare Connect is a modern, responsive, and highly secure healthcare management platform. The frontend client provides a seamless experience for patients to find doctors, book appointments, and manage their medical records. For doctors, it offers a dedicated dashboard to manage schedules, review patient histories, and handle consultations efficiently.

## Key Features
- **User Authentication:** Secure JWT-based authentication for Patients, Doctors, and Admins.
- **Doctor Discovery:** Advanced search and filtering capabilities to find specialists by expertise, rating, and fee.
- **Appointment Booking:** Real-time appointment scheduling with automated status tracking.
- **Responsive Design:** A beautiful, glassmorphism-inspired UI built with Tailwind CSS, fully responsive across mobile, tablet, and desktop devices.
- **Interactive Dashboards:** Role-specific dashboards tailored for Patients and Doctors.

## Technology Stack
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS (with custom Glassmorphism utilities)
- **Typography:** Google Fonts (Outfit)
- **Icons:** React Icons
- **Notifications:** React Hot Toast
- **Animations:** Framer Motion

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nurul-Islam-seam/medicare-connect-frontend.git
   cd medicare-connect-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://medicare-connect-backend.onrender.com/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
This project is configured for seamless deployment on **Vercel**. Simply connect the repository to Vercel and it will automatically build using `npm run build` and deploy.

## License
MIT License. See `LICENSE` for more information.

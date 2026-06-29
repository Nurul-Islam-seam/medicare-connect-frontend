import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: {
        default: 'MediCare Connect — Hospital Appointment & Healthcare Management',
        template: '%s | MediCare Connect',
    },
    description: 'MediCare Connect is a modern healthcare management platform connecting patients with doctors and hospitals. Book appointments, manage medical records, and receive healthcare services efficiently.',
    keywords: ['healthcare', 'hospital', 'appointment', 'doctor', 'medical', 'booking', 'telemedicine'],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="min-h-screen flex flex-col">
                <AuthProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#1e293b',
                                color: '#f1f5f9',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                fontSize: '14px',
                            },
                            success: {
                                iconTheme: { primary: '#10b981', secondary: '#f1f5f9' },
                            },
                            error: {
                                iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
                            },
                        }}
                    />
                    <Navbar />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}

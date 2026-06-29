import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Find Doctors',
    description: 'Search and book appointments with verified healthcare professionals. Filter by specialization, sort by fee, experience, and rating.',
};

export default function FindDoctorsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

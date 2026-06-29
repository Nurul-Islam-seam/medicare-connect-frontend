import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register',
    description: 'Create your MediCare Connect account as a patient or doctor and start your digital healthcare journey today.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

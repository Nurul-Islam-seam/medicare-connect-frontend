// ========================
// TypeScript interfaces for all data models
// ========================

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    photo: string;
    phone: string;
    gender: string;
    status: 'active' | 'suspended';
    googleId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IDoctor {
    _id: string;
    userId: IUser | string;
    doctorName: string;
    specialization: string;
    qualifications: string[];
    experience: number;
    consultationFee: number;
    hospitalName: string;
    profileImage: string;
    availableDays: string[];
    availableSlots: string[];
    verificationStatus: 'pending' | 'verified' | 'rejected';
    totalRatings: number;
    ratingCount: number;
    averageRating: number;
    createdAt: string;
    updatedAt: string;
}

export interface IAppointment {
    _id: string;
    patientId: IUser | string;
    doctorId: IDoctor | string;
    appointmentDate: string;
    appointmentTime: string;
    appointmentStatus: 'pending' | 'accepted' | 'rejected' | 'completed' | 'canceled';
    symptoms: string;
    paymentStatus: 'unpaid' | 'paid';
    createdAt: string;
    updatedAt: string;
}

export interface IReview {
    _id: string;
    patientId: IUser | string;
    doctorId: IDoctor | string;
    rating: number;
    reviewText: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPayment {
    _id: string;
    appointmentId: IAppointment | string;
    patientId: IUser | string;
    doctorId: IDoctor | string;
    amount: number;
    transactionId: string;
    paymentDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPrescription {
    _id: string;
    doctorId: IDoctor | string;
    patientId: IUser | string;
    appointmentId: IAppointment | string;
    diagnosis: string;
    medications: IMedication[];
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface IMedication {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
}

export interface IPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IStats {
    totalDoctors: number;
    totalPatients: number;
    totalAppointments: number;
    totalReviews: number;
}

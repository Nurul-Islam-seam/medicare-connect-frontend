'use client';
import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeWrapperProps {
    appointmentId: string;
    amount: number;
    clientSecret: string;
    onSuccess: () => void;
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({ appointmentId, amount, clientSecret, onSuccess }) => {
    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm appointmentId={appointmentId} amount={amount} clientSecret={clientSecret} onSuccess={onSuccess} />
        </Elements>
    );
};

export default StripeWrapper;

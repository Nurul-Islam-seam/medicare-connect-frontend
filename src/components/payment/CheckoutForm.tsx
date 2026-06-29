import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface CheckoutFormProps {
    appointmentId: string;
    amount: number;
    clientSecret: string;
    onSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ appointmentId, amount, clientSecret, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                toast.error(error.message || 'Payment failed.');
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Confirm with backend
                await api.post('/payment/confirm', {
                    appointmentId,
                    transactionId: paymentIntent.id,
                    amount,
                });
                toast.success('Payment successful!');
                onSuccess();
            }
        } catch (err) {
            console.error('Payment confirmation error:', err);
            toast.error('An error occurred during payment confirmation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#f1f5f9',
                                '::placeholder': { color: '#94a3b8' },
                                iconColor: '#10b981',
                            },
                            invalid: { color: '#ef4444', iconColor: '#ef4444' },
                        },
                    }}
                />
            </div>
            <button
                type="submit"
                disabled={!stripe || loading}
                className="btn-primary w-full py-3 flex items-center justify-center disabled:opacity-50"
            >
                {loading ? 'Processing...' : `Pay $${amount}`}
            </button>
        </form>
    );
};

export default CheckoutForm;

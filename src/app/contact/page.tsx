'use client';

import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate form submission
        setTimeout(() => {
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1000);
    };

    const contactInfo = [
        { icon: FaMapMarkerAlt, title: 'Address', value: '123 Healthcare Ave, Medical District, NY 10001' },
        { icon: FaPhoneAlt, title: 'Phone', value: '+1 (555) 123-4567' },
        { icon: FaEnvelope, title: 'Email', value: 'support@medicareconnect.com' },
        { icon: FaClock, title: 'Hours', value: 'Mon - Fri: 8AM - 8PM EST' },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-white mb-4">Contact Us</h1>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto">Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-4">
                        {contactInfo.map((item) => (
                            <div key={item.title} className="card-glass p-5 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                                    <p className="text-sm text-slate-400">{item.value}</p>
                                </div>
                            </div>
                        ))}

                        {/* Emergency */}
                        <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <FaPhoneAlt className="text-red-400" />
                                <span className="text-sm font-semibold text-red-400">Emergency Hotline</span>
                            </div>
                            <p className="text-2xl font-bold text-white">911</p>
                            <p className="text-xs text-slate-500 mt-1">Available 24/7 for emergencies</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="card-glass p-6 sm:p-8">
                            <h2 className="text-lg font-semibold text-white mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
                                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="Your name" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="you@example.com" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject</label>
                                    <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="input-field" placeholder="How can we help?" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Message</label>
                                    <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="input-field min-h-[120px] resize-y" placeholder="Your message..." required />
                                </div>
                                <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                                    {loading ? 'Sending...' : <><FaPaperPlane /> Send Message</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

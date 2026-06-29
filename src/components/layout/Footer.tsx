'use client';

import React from 'react';
import Link from 'next/link';
import { FaHeartbeat, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', href: '/' },
        { name: 'Find Doctors', href: '/find-doctors' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
    ];

    const services = [
        { name: 'Cardiology', href: '/find-doctors?specialization=Cardiology' },
        { name: 'Neurology', href: '/find-doctors?specialization=Neurology' },
        { name: 'Orthopedics', href: '/find-doctors?specialization=Orthopedics' },
        { name: 'Pediatrics', href: '/find-doctors?specialization=Pediatrics' },
    ];

    const socialLinks = [
        { icon: FaFacebookF, href: '#', label: 'Facebook' },
        { icon: FaTwitter, href: '#', label: 'Twitter' },
        { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
        { icon: FaInstagram, href: '#', label: 'Instagram' },
    ];

    return (
        <footer className="relative border-t border-white/5 bg-slate-900">
            <div className="page-shell pt-14 pb-8 sm:pt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="mb-4 flex min-w-0 items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                                <FaHeartbeat className="text-white text-base" />
                            </div>
                            <span className="text-balance-safe text-lg font-bold text-white">
                                MediCare Connect
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            Connecting patients with trusted healthcare professionals. Book appointments, manage records, and experience seamless healthcare.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all duration-200"
                                >
                                    <social.icon className="text-sm" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Specializations</h4>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service.name}>
                                    <Link href={service.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-400">123 Healthcare Ave, Medical District, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhoneAlt className="text-emerald-500 flex-shrink-0" />
                                <span className="text-sm text-slate-400">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-emerald-500 flex-shrink-0" />
                                <span className="text-sm text-slate-400">support@medicareconnect.com</span>
                            </li>
                        </ul>

                        {/* Emergency Hotline */}
                        <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <FaPhoneAlt className="text-red-400 text-sm" />
                                <span className="text-sm font-semibold text-red-400">Emergency Hotline</span>
                            </div>
                            <p className="text-lg font-bold text-white">911</p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-center text-sm text-slate-500 sm:text-left">
                        &copy; {currentYear} MediCare Connect. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

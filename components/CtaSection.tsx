
import React from 'react';
import { Page } from '../types';

interface CtaSectionProps {
    navigateTo: (page: Page, anchor?: string | null) => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ navigateTo }) => {
    const handleAnalyzeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        if (targetId) {
            navigateTo('home', targetId);
        }
    };

    return (
        <section className="py-24 bg-gradient-to-r from-sky-600 to-cyan-500">
            <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-extrabold text-white">Start Protecting Yourself Today</h2>
                <p className="mt-4 text-xl text-sky-100">
                    Check suspicious texts, emails, and voicemails in seconds.
                </p>
                <div className="mt-10">
                    <a href="#analyze-section" onClick={handleAnalyzeClick} className="px-8 py-4 bg-white text-sky-600 font-bold text-lg rounded-lg shadow-xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105">
                        Analyze Now
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;

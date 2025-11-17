
import React from 'react';
import { ShieldCheckIcon } from './icons';

const PrivacySection: React.FC = () => {
    return (
        <section className="py-24 bg-slate-900">
            <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
                <ShieldCheckIcon className="text-sky-400 mx-auto mb-6" width={64} height={64} />
                <h2 className="text-4xl font-extrabold text-slate-100">Privacy-First Design</h2>
                <p className="mt-6 text-xl text-slate-300">
                    We process everything in-memory and delete it immediately after analysis. No accounts, no storage, no sharing. Your privacy is our priority.
                </p>
            </div>
        </section>
    );
};

export default PrivacySection;

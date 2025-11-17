
import React from 'react';
import { MessageSquareIcon, MailIcon, MicIcon, PhoneIcon } from './icons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700 hover:border-sky-500 transition-colors">
        <div className="mb-4 text-sky-400">{icon}</div>
        <h3 className="text-xl font-bold text-slate-100">{title}</h3>
        <p className="mt-2 text-slate-300">{children}</p>
    </div>
);


const FeaturesSection: React.FC = () => {
    return (
        <section className="py-24 bg-slate-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-extrabold text-slate-100">Analyze Any Channel in Seconds</h2>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard icon={<MessageSquareIcon width={32} height={32} />} title="SMS & Text Messages">
                        Paste a text message and instantly get a risk score and red-flag highlights.
                    </FeatureCard>
                    <FeatureCard icon={<MailIcon width={32} height={32} />} title="Emails">
                        Analyze emails for phishing patterns, suspicious links, and scam language.
                    </FeatureCard>
                    <FeatureCard icon={<MicIcon width={32} height={32} />} title="Voicemail Audio">
                         Upload an audio file and our AI transcribes it and analyzes it for scam indicators.
                    </FeatureCard>
                    <FeatureCard icon={<PhoneIcon width={32} height={32} />} title="Phone Numbers">
                        Check for suspicious activity associated with a phone number.
                    </FeatureCard>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
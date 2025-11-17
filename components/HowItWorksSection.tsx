
import React from 'react';

const Step: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="relative z-10 text-center bg-slate-950 p-4">
        <span className="block text-7xl font-extrabold text-sky-500 mb-4">{number}</span>
        <h3 className="text-2xl font-bold text-slate-100">{title}</h3>
        <p className="mt-2 text-slate-300">{children}</p>
    </div>
);

const HowItWorksSection: React.FC = () => {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-extrabold text-slate-100">How It Works</h2>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px" aria-hidden="true">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
                            <path d="M0 0.5 H100" strokeDasharray="8 8" strokeWidth="2" stroke="rgb(51 65 85)" />
                        </svg>
                    </div>

                    <Step number="1" title="Choose Your Channel">
                        Select SMS, email, voicemail, or phone number to analyze.
                    </Step>
                    <Step number="2" title="Paste or Upload">
                        Paste the message/email text or upload your voicemail audio.
                    </Step>
                    <Step number="3" title="Get Instant Analysis">
                        Our AI evaluates it and highlights risk, red flags, and suggested next steps.
                    </Step>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
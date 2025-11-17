import React from 'react';
import { MailIcon } from './icons';

const ContactPage: React.FC = () => {
    return (
        <section className="py-24 pt-40 bg-slate-950 min-h-screen">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100">Contact Scam Analyzer</h1>
                    <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
                        If you have questions about Scam Analyzer, reporting scams, or our policies:
                    </p>
                </div>
                
                <div className="mt-12 max-w-lg mx-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <MailIcon className="text-sky-400" width={24} height={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-100">Email</h2>
                            <a href="mailto:scamanalyzer@mailinator.com" className="text-sky-400 hover:text-sky-300 transition-colors">scamanalyzer@mailinator.com</a>
                        </div>
                    </div>
                     <div className="mt-6 flex items-start space-x-4">
                        <div className="flex-shrink-0">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-100">Address</h2>
                            <p className="text-slate-300">No physical address is provided.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;
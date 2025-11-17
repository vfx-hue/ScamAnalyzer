import React, { useState, useRef } from 'react';
import { AnalysisTab, AnalysisResult } from '../types';
import { analyzeContent } from '../services/geminiService';
import { MessageSquareIcon, MailIcon, MicIcon, PhoneIcon } from './icons';
import Loader from './Loader';
import ResultDisplay from './ResultDisplay';
import ErrorDisplay from './ErrorDisplay';

const AnalyzeSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AnalysisTab>('sms');
    const [smsContent, setSmsContent] = useState<string>("Hey, it's your bank. Your account is locked. Please click this link to verify your identity: http://bit.ly/secure-bank-login-xyz");
    const [emailFrom, setEmailFrom] = useState<string>('');
    const [emailHeaders, setEmailHeaders] = useState<string>('');
    const [emailBody, setEmailBody] = useState<string>('');
    const [voicemailFile, setVoicemailFile] = useState<File | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const resultRef = useRef<HTMLDivElement>(null);

    const handleTabClick = (tab: AnalysisTab) => {
        setActiveTab(tab);
        setResult(null);
        setError(null);
    };
    
    const handleAnalyze = async () => {
        let analysisInput: string | File | null = null;
        let inputError: string | null = null;
        
        if (activeTab === 'sms') {
            if (!smsContent.trim()) {
                inputError = 'Please paste some content to analyze.';
            }
            analysisInput = smsContent;
        } else if (activeTab === 'email') {
             if (!emailFrom.trim() && !emailBody.trim()) {
                inputError = 'Please provide at least a "From" address or "Body" content to analyze.';
             }
             analysisInput = `[Email Analysis Request]\n\nFrom Address: ${emailFrom}\n\nHeaders (if provided):\n${emailHeaders || 'Not provided.'}\n\nBody Content:\n${emailBody}`;
        } else if (activeTab === 'voicemail') {
             if (!voicemailFile) {
                inputError = 'Please upload a voicemail file to analyze.';
             }
             analysisInput = voicemailFile;
        } else if (activeTab === 'phone') {
            if (!phoneNumber.trim()) {
                inputError = 'Please enter a phone number to analyze.';
            }
            analysisInput = `[Phone Number Analysis Request]\n\nPhone Number: ${phoneNumber}`;
        }

        if (inputError) {
            setError(inputError);
            if (resultRef.current) {
                resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }
        
        if (!analysisInput) {
            setError('Could not prepare input for analysis.');
            if (resultRef.current) {
                resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }

        setIsLoading(true);
        setResult(null);
        setError(null);
        
        if (resultRef.current) {
           resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        try {
            const analysisResult = await analyzeContent(analysisInput);
            setResult(analysisResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderTabPanel = () => {
        switch(activeTab) {
            case 'sms':
                return (
                    <div>
                        <label htmlFor="sms-input" className="block text-sm font-medium text-slate-300 mb-2">Paste your suspicious text message here:</label>
                        <textarea id="sms-input" rows={8} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 transition-colors" placeholder="e.g., 'Your package has a problem, click here to update: http://...'" value={smsContent} onChange={e => setSmsContent(e.target.value)}></textarea>
                    </div>
                );
            case 'email':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-from" className="block text-sm font-medium text-slate-300 mb-2">From Address:</label>
                            <input id="email-from" type="email" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 transition-colors" placeholder="e.g., suspicious-sender@example.com" value={emailFrom} onChange={e => setEmailFrom(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="email-headers" className="block text-sm font-medium text-slate-300 mb-2">Email Headers (Optional, Recommended)</label>
                            <input id="email-headers" type="text" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 transition-colors" placeholder="Paste full email headers for a more accurate analysis..." value={emailHeaders} onChange={e => setEmailHeaders(e.target.value)} />
                            <p className="mt-2 text-xs text-slate-400">How to find headers: In Gmail, click the three dots ⋮ and 'Show original'. In Outlook, click the three dots …, 'View', then 'View message details'.</p>
                        </div>
                        <div>
                            <label htmlFor="email-body" className="block text-sm font-medium text-slate-300 mb-2">Email Body:</label>
                            <textarea id="email-body" rows={8} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 transition-colors" placeholder="Paste the main email content here..." value={emailBody} onChange={e => setEmailBody(e.target.value)}></textarea>
                        </div>
                    </div>
                );
            case 'voicemail':
                 return (
                    <div>
                        <label htmlFor="voicemail-input" className="block text-sm font-medium text-slate-300 mb-2">Upload a voicemail audio file (.mp3, .wav, .m4a, .ogg):</label>
                        <input id="voicemail-input" type="file" accept=".mp3,.wav,.m4a,.ogg" onChange={e => setVoicemailFile(e.target.files ? e.target.files[0] : null)} className="w-full text-slate-300 file:mr-4 file:text-sm cursor-pointer"/>
                        <p className="mt-3 text-sm text-slate-400">The AI will analyze the audio content directly for scam indicators.</p>
                    </div>
                );
            case 'phone':
                return (
                    <div>
                        <label htmlFor="phone-input" className="block text-sm font-medium text-slate-300 mb-2">Enter the suspicious phone number:</label>
                        <input id="phone-input" type="tel" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 transition-colors" placeholder="e.g., +1-800-555-1234" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                        <p className="mt-2 text-sm text-slate-400">Our AI checks the number against public databases for reports of spam or malicious activity. Numbers with no negative history are considered safe.</p>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <section id="analyze-section" className="py-24">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-slate-100">Analyze Now</h2>
                    <p className="mt-4 text-lg text-slate-300">
                        Check a suspicious text, email, or phone number, or upload a voicemail and get instant risk analysis.
                    </p>
                </div>

                <div className="mt-12 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="flex border-b border-slate-700" role="tablist" aria-label="Analysis Type">
                        <button role="tab" aria-selected={activeTab === 'sms'} onClick={() => handleTabClick('sms')} className="flex-1">
                            <span className="flex items-center justify-center space-x-2"><MessageSquareIcon width={20} height={20} /><span>SMS / Text</span></span>
                        </button>
                        <button role="tab" aria-selected={activeTab === 'email'} onClick={() => handleTabClick('email')} className="flex-1">
                            <span className="flex items-center justify-center space-x-2"><MailIcon width={20} height={20} /><span>Email</span></span>
                        </button>
                        <button role="tab" aria-selected={activeTab === 'voicemail'} onClick={() => handleTabClick('voicemail')} className="flex-1">
                            <span className="flex items-center justify-center space-x-2"><MicIcon width={20} height={20} /><span>Voicemail</span></span>
                        </button>
                        <button role="tab" aria-selected={activeTab === 'phone'} onClick={() => handleTabClick('phone')} className="flex-1">
                            <span className="flex items-center justify-center space-x-2"><PhoneIcon width={20} height={20} /><span>Phone Number</span></span>
                        </button>
                    </div>
                    <div className="p-8">
                       {renderTabPanel()}
                       <div className="mt-8 text-center">
                            <button onClick={handleAnalyze} disabled={isLoading} className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold text-lg rounded-lg shadow-xl hover:from-sky-600 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? 'Analyzing...' : 'Analyze'}
                            </button>
                        </div>
                    </div>
                </div>

                <div id="result-container" ref={resultRef} className="mt-12">
                    {isLoading && <Loader />}
                    {!isLoading && result && <ResultDisplay result={result} />}
                    {!isLoading && error && <ErrorDisplay message={error} />}
                </div>
            </div>
        </section>
    );
};

export default AnalyzeSection;
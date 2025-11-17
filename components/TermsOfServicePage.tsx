import React from 'react';

const LegalContentWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="prose text-slate-300 max-w-none">
        {children}
        <style>{`
            .prose h2 {
                margin-top: 2rem;
                margin-bottom: 1rem;
                font-size: 1.5rem;
                line-height: 2rem;
                font-weight: 700;
                color: #f1f5f9; /* slate-100 */
                padding-bottom: 0.5rem;
                border-bottom: 1px solid #334155; /* slate-700 */
            }
            .prose p, .prose ul {
                margin-bottom: 1rem;
                line-height: 1.75;
            }
            .prose ul {
                list-style-position: outside;
                list-style-type: disc;
                padding-left: 1.5rem;
            }
            .prose li {
                margin-bottom: 0.5rem;
            }
        `}</style>
    </div>
);

const TermsOfServicePage: React.FC = () => {
    return (
        <section className="py-24 pt-40 bg-slate-950 min-h-screen">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100">Terms of Service</h1>
                <p className="mt-2 text-slate-400">Last updated: November 17, 2025</p>
                <div className="mt-8">
                    <LegalContentWrapper>
                        <h2>1. Acceptance of Terms</h2>
                        <p>By using Scam Analyzer, you agree to these terms and all applicable laws. If you disagree, do not use our services.</p>
                        
                        <h2>2. Use License</h2>
                        <p>Permission is granted to temporarily use materials on Scam Analyzer for personal, non-commercial purposes. You may not:</p>
                        <ul>
                            <li>Modify or copy materials.</li>
                            <li>Use materials commercially.</li>
                            <li>Remove copyright or proprietary notices.</li>
                            <li>Transfer materials to another server.</li>
                        </ul>
                        
                        <h2>3. Disclaimer</h2>
                        <p>Materials on this site are provided "as is." Scam Analyzer disclaims all warranties, express or implied, including fitness for a purpose or accuracy.</p>
                        
                        <h2>4. Limitations</h2>
                        <p>Scam Analyzer is not liable for any damages arising from use of this website, including data loss or business interruption.</p>
                        
                        <h2>5. Accuracy</h2>
                        <p>We do not guarantee the accuracy, completeness, or currency of website materials. We may update content at any time without notice.</p>
                        
                        <h2>6. Links</h2>
                        <p>We are not responsible for linked websites. Use them at your own risk.</p>
                        
                        <h2>7. Modifications</h2>
                        <p>We may revise these terms at any time without notice. Continued use means you accept the updated terms.</p>
                        
                        <h2>8. Governing Law</h2>
                        <p>These terms are governed by the laws of the United States.</p>
                        
                        <h2>9. User Content</h2>
                        <p>You are responsible for content you post. By posting, you grant Scam Analyzer a license to use, modify, display, and distribute your content.</p>
                        
                        <h2>10. Account Terms</h2>
                        <p>Maintain the security of your account and password. Scam Analyzer is not liable for losses from account misuse.</p>
                    </LegalContentWrapper>
                </div>
            </div>
        </section>
    );
};

export default TermsOfServicePage;
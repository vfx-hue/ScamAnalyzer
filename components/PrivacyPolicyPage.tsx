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


const PrivacyPolicyPage: React.FC = () => {
    return (
        <section className="py-24 pt-40 bg-slate-950 min-h-screen">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100">Privacy Policy</h1>
                <p className="mt-2 text-slate-400">Last updated: November 17, 2025</p>
                <div className="mt-8">
                <LegalContentWrapper>
                    <h2>Introduction</h2>
                    <p>Welcome to Scam Analyzer. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we handle your personal information when you visit our website or interact with our services.</p>
                    <p>This privacy policy applies to all personal information we process when you use or interact with our services, visit our website, or otherwise engage with us.</p>
                    
                    <h2>1. Information We Collect</h2>
                    <p>We may collect, use, store, and transfer different kinds of personal data about you:</p>
                    <ul>
                        <li><strong>Identity Data:</strong> First name, last name, username, or similar identifier.</li>
                        <li><strong>Contact Data:</strong> Email address.</li>
                        <li><strong>Technical Data:</strong> IP address, browser type and version, time zone, operating system, device information, and other technology used to access the website.</li>
                        <li><strong>Usage Data:</strong> Information about how you use our website and services.</li>
                    </ul>
                    
                    <h2>2. How We Use Your Information</h2>
                    <p>We use your personal data only when the law allows. Common uses include:</p>
                    <ul>
                        <li>To provide and maintain our services.</li>
                        <li>To comply with legal obligations.</li>
                        <li>For our legitimate interests (e.g., improving our services), where your rights do not override them.</li>
                    </ul>

                    <h2>3. Data Sharing and Disclosure</h2>
                    <p>We may share your personal data with:</p>
                    <ul>
                        <li>Service providers for IT and system administration.</li>
                        <li>Professional advisers (lawyers, auditors, insurers).</li>
                        <li>Authorities where required by law.</li>
                    </ul>
                    <p>We require all third parties to protect your data according to the law.</p>
                    
                    <h2>4. Data Security</h2>
                    <p>We implement appropriate measures to protect your personal data from loss, misuse, or unauthorized access. Access is restricted to employees, contractors, and third parties with a business need.</p>

                    <h2>5. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access, correct, or delete your personal data.</li>
                        <li>Restrict or object to our processing of your data.</li>
                        <li>Receive a copy of your data or withdraw consent.</li>
                    </ul>
                    
                    <h2>6. Cookies</h2>
                    <p>We use cookies to improve your experience on our website. Cookies help us make the site more efficient and provide insights into website usage.</p>
                    
                    <h2>7. Changes to This Privacy Policy</h2>
                    <p>We may update this policy occasionally. Updates will be posted on this page with the revised date.</p>

                    <h2>8. Contact Us</h2>
                    <p>Email: scamanalyzer@mailinator.com</p>
                    <p>No physical address is provided.</p>
                </LegalContentWrapper>
                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicyPage;
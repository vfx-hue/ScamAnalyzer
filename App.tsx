import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import PrivacySection from './components/PrivacySection';
import AnalyzeSection from './components/AnalyzeSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import ContactPage from './components/ContactPage';
import { Page } from './types';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [targetAnchor, setTargetAnchor] = useState<string | null>(null);

    const navigateTo = (page: Page, anchor: string | null = null) => {
        setCurrentPage(page);
        if (anchor) {
            setTargetAnchor(anchor);
        } else {
             window.scrollTo(0, 0);
        }
    };
    
    useEffect(() => {
        // This effect handles scrolling to an anchor link (#) after navigating to the home page.
        if (currentPage === 'home' && targetAnchor) {
            // A small delay to ensure the home page components are rendered before scrolling.
            setTimeout(() => {
                const element = document.getElementById(targetAnchor.substring(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
                setTargetAnchor(null); // Reset after scrolling
            }, 100);
        } else if (!targetAnchor) {
            window.scrollTo(0, 0);
        }
    }, [currentPage, targetAnchor]);

    const renderPage = () => {
        switch (currentPage) {
            case 'privacy':
                return <PrivacyPolicyPage />;
            case 'terms':
                return <TermsOfServicePage />;
            case 'contact':
                return <ContactPage />;
            case 'home':
            default:
                return (
                    <>
                        <HeroSection navigateTo={navigateTo} />
                        <HowItWorksSection />
                        <AnalyzeSection />
                        <PrivacySection />
                        <CtaSection navigateTo={navigateTo} />
                    </>
                );
        }
    };

    return (
        <>
            <Header navigateTo={navigateTo} />
            <main>{renderPage()}</main>
            <Footer navigateTo={navigateTo} />
        </>
    );
};

export default App;

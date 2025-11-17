
import React from 'react';
import { Page } from '../types';

interface FooterProps {
    navigateTo: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, page: Page) => {
        e.preventDefault();
        navigateTo(page);
    };

    return (
        <footer className="bg-slate-950 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center">
                <div className="flex space-x-6">
                    <a href="#" onClick={(e) => handleNavClick(e, 'privacy')} className="text-slate-400 hover:text-slate-200 transition-colors">Privacy Policy</a>
                    <a href="#" onClick={(e) => handleNavClick(e, 'terms')} className="text-slate-400 hover:text-slate-200 transition-colors">Terms of Service</a>
                    <a href="#" onClick={(e) => handleNavClick(e, 'contact')} className="text-slate-400 hover:text-slate-200 transition-colors">Contact</a>
                </div>
                <div className="mt-6 md:mt-0 text-slate-500">
                    © 2025 Multi-Channel Scam Analyzer
                </div>
            </div>
        </footer>
    );
};

export default Footer;

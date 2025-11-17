import React from 'react';
import { ShieldCheckIcon } from './icons';
import { Page } from '../types';

interface HeaderProps {
    navigateTo: (page: Page, anchor?: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ navigateTo }) => {
    const handleAnalyzeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        if (targetId) {
            navigateTo('home', targetId);
        }
    };

    const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigateTo('home');
    };

    return (
        <header className="absolute top-0 left-0 w-full z-10 py-6">
            <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
                <a href="#" onClick={handleBrandClick} className="flex items-center space-x-2">
                    <ShieldCheckIcon className="text-sky-400" width={28} height={28} />
                    <span className="text-xl font-bold text-slate-100">Scam Analyzer</span>
                </a>
                <a href="#analyze-section" onClick={handleAnalyzeClick} className="px-5 py-2.5 bg-sky-500 text-white font-semibold rounded-lg shadow-lg hover:bg-sky-600 transition-all duration-300 transform hover:scale-105">
                    Analyze Now
                </a>
            </nav>
        </header>
    );
};

export default Header;

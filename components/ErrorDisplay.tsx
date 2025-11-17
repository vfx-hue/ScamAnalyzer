
import React from 'react';
import { ErrorIcon } from './icons';

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div className="bg-slate-900 border border-red-500/30 rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
            <ErrorIcon className="text-red-500 mx-auto mb-4" width={48} height={48} />
            <h3 className="text-xl font-semibold text-red-400">Analysis Failed</h3>
            <p className="text-slate-300 mt-2">{message}</p>
        </div>
    );
};

export default ErrorDisplay;

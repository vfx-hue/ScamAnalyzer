
import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangleIcon, CheckCircleIcon } from './icons';

const ResultDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const { riskScore, summary, redFlags, advice } = result;

    let scoreColorClass = 'text-green-400';
    let scoreBgClass = 'bg-green-500/10';
    let scoreBorderClass = 'border-green-500';
    let riskLabel = 'Low Risk';

    if (riskScore > 40 && riskScore <= 70) {
        scoreColorClass = 'text-yellow-400';
        scoreBgClass = 'bg-yellow-500/10';
        scoreBorderClass = 'border-yellow-500';
        riskLabel = 'Medium Risk';
    } else if (riskScore > 70) {
        scoreColorClass = 'text-red-400';
        scoreBgClass = 'bg-red-500/10';
        scoreBorderClass = 'border-red-500';
        riskLabel = 'High Risk';
    }

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Score */}
                <div className={`md:col-span-1 flex flex-col items-center justify-center text-center p-6 ${scoreBgClass} border ${scoreBorderClass} rounded-2xl`}>
                    <span className={`text-sm font-semibold ${scoreColorClass} uppercase tracking-wider`}>{riskLabel}</span>
                    <span className={`text-7xl font-extrabold ${scoreColorClass} my-2 score-circle`}>{riskScore}</span>
                    <span className={`text-sm ${scoreColorClass} opacity-80`}>Risk Score</span>
                </div>
                {/* Analysis */}
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-slate-100">Analysis</h3>
                    <p className="mt-2 text-lg text-slate-300">{summary}</p>
                    
                    <h4 className="text-xl font-semibold text-slate-100 mt-6 mb-3">Red Flags</h4>
                    <ul className="space-y-2">
                        {redFlags.length > 0 ? (
                            redFlags.map((flag, index) => (
                                <li key={index} className="flex items-center space-x-2 bg-slate-800 p-3 rounded-lg">
                                    <AlertTriangleIcon className="text-red-400 flex-shrink-0" width={16} height={16} />
                                    <span>{flag}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-slate-400">No specific red flags identified.</p>
                        )}
                    </ul>
                </div>
            </div>
            
            {/* Advice */}
            <div className="mt-8 border-t border-slate-700 pt-8">
                <h4 className="text-xl font-semibold text-slate-100 mb-3 flex items-center space-x-2">
                    <CheckCircleIcon className="text-sky-400" width={20} height={20} />
                    <span>Actionable Advice</span>
                </h4>
                <p className="text-slate-300 text-base" dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br>') }} />
            </div>
        </div>
    );
};

export default ResultDisplay;

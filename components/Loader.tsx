
import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center flex-col">
            <div className="loader"></div>
            <p className="mt-4 text-lg text-slate-300">Analyzing...</p>
        </div>
    );
};

export default Loader;

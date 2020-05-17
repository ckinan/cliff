import React from 'react';
import Header from './Header';
import Body from './Body';

const Protected: React.FC = () => {
    return (
        <div>
            <div className="fixed bg-white shadow-md w-full p-2 text-center">
                <Header />
            </div>
            <div className="pt-16">
                <Body />
            </div>
        </div>
    );
};

export default Protected;

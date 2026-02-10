import React from 'react';
import Lottie from 'lottie-react';
// Ideally, you would import your JSON file here.
// import animationData from '../assets/loading-animation.json';

const LoadingScreen = () => {
    return (
        <div className="loading-screen" style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-dark)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
        }}>
            <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Placeholder for Lottie Animation */}
                {/* <Lottie animationData={animationData} loop={true} /> */}
                <div className="glass-card" style={{ padding: '20px' }}>
                    <h2 className="gradient-text">Loading...</h2>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;

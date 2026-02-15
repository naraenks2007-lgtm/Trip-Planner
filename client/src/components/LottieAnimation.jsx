import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

const LottieAnimation = ({
    animationData,
    loop = true,
    autoplay = true,
    style = {},
    width,
    height
}) => {
    const [fetchedData, setFetchedData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (typeof animationData === 'string') {
            fetch(animationData)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch lottie');
                    return res.json();
                })
                .then(data => setFetchedData(data))
                .catch(err => {
                    console.error("Lottie Load Error:", err);
                    setError(true);
                });
        } else {
            setFetchedData(animationData);
        }
    }, [animationData]);

    if (error) return null;
    if (!fetchedData) return null;

    return (
        <div style={{ width: width || '100%', height: height || '100%', ...style }}>
            <Lottie
                animationData={fetchedData}
                loop={loop}
                autoplay={autoplay}
            />
        </div>
    );
};

export default LottieAnimation;

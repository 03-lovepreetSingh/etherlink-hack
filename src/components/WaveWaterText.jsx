'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

const WaterWaveText = ({
    text = "WATER",
    waveCount = 5,
    maxAmplitude = 10,
    fillDuration = 4,
    maxSpeed = 2.5,
    delay = 0 // 1. Add the new 'delay' prop with a default value (in seconds)
}) => {
    const [clipPath, setClipPath] = useState('polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)');
    const animationFrameId = useRef();
    const startTime = useRef(null);

    const waves = useMemo(() => {
        return Array.from({ length: waveCount }).map(() => ({
            x: Math.random() * 100,
            width: 15 + Math.random() * 20,
            amplitude: (maxAmplitude / 2) + Math.random() * (maxAmplitude / 2),
            speed: (maxSpeed / 2) + Math.random() * (maxSpeed / 2),
            frequency: 3 + Math.random() * 5,
        }));
    }, [waveCount, maxAmplitude, maxSpeed]);

    useEffect(() => {
        startTime.current = null;

        const animateWave = (timestamp) => {
            if (startTime.current === null) {
                startTime.current = timestamp;
            }
            
            // 3. Modify the animation loop to handle the delay
            const totalElapsedTime = (timestamp - startTime.current) / 1000;

            // If we are within the delay period, just request the next frame and do nothing.
            if (totalElapsedTime < delay) {
                animationFrameId.current = requestAnimationFrame(animateWave);
                return;
            }

            // Calculate the elapsed time for the animation itself, subtracting the delay.
            const elapsedTime = totalElapsedTime - delay;
            
            const fillProgress = Math.min(elapsedTime / fillDuration, 1.0);

            const points = [];
            const segments = 120;

            for (let i = 0; i <= segments; i++) {
                const xPos = (i / segments) * 100;
                let totalYOffset = 0;

                waves.forEach(wave => {
                    const dx = xPos - wave.x;
                    const gaussian = Math.exp(-(dx * dx) / (2 * wave.width * wave.width));
                    const waveValue = wave.amplitude * gaussian * Math.sin(
                        wave.frequency * (xPos / 100) + elapsedTime * wave.speed
                    );
                    totalYOffset += waveValue;
                });

                const yBaseline = 100 - (fillProgress * 100);
                const yPos = yBaseline - totalYOffset;
                points.push(`${xPos}% ${yPos}%`);
            }

            const polygon = `polygon(${points.join(', ')}, 100% 100%, 0% 100%)`;
            setClipPath(polygon);

            animationFrameId.current = requestAnimationFrame(animateWave);
        };

        animationFrameId.current = requestAnimationFrame(animateWave);

        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    // 2. Add 'delay' to the useEffect dependency array
    }, [waves, fillDuration, delay]); 

    const textStyle = {
        fontSize: 'clamp(2rem, 14vw, 13rem)',
        fontWeight: 900,
        margin: 0,
        padding: 0,
    };

    return (
        <div  style={{ fontFamily: 'var(--font-cypher)' }} className="relative text-center ">
            <h2  style={{ ...textStyle, fontFamily: 'var(--font-cypher)', color: '#252626', WebkitTextStroke: '2px #111' }}>
                {text}
            </h2>

            <div  style={{ fontFamily: 'var(--font-cypher)' }} className="absolute top-0 left-0 w-full h-full text- overflow-hidden">
                <h2
                    style={{
                        ...textStyle,
                        color: '#f7f7f7', 
                        clipPath: clipPath,
                    }}
                    className="absolute top-0 left-0 w-full h-full"
                >
                    {text}
                </h2>
            </div>
        </div>
    );
};

export default WaterWaveText;
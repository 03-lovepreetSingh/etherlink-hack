'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import EndPage from './EndPage';
import ThemeChange from './ThemeChange';
import { useThemeChange } from './ThemeChangeContext';
import DotGridBackground from '../ui/dotGridBackground';

gsap.registerPlugin(ScrollTrigger);

const LastPortal = () => {
    const MaskRef = useRef(null);
    const containerRef = useRef(null);

    const { isThemeDark, setIsThemeDark } = useThemeChange();

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=500', // shorter scroll distance
                scrub: 2,
                onUpdate: (self) => {
                    // Update theme based on scroll progress
                    setIsThemeDark(self.progress < 0.5);
                },
                onComplete: () => {
                    // Final theme change at end of animation
                    setIsThemeDark(false);
                    
                    // Remove mask after animation completes
                    gsap.to(MaskRef.current, {
                        opacity: 0,
                        duration: 2,
                        onComplete: () => {
                            if (MaskRef.current) {
                                MaskRef.current.style.display = 'none';
                            }
                        }
                    });
                }
            },
        });

        // Animate mask from initial size to full viewport coverage
        tl.to(MaskRef.current, {
            maskSize: "300vh", // Increased to ensure full coverage
            ease: "power2.inOut"
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <>
            <main ref={containerRef} className='main2 relative min-h-screen w-full'>
                <motion.div ref={MaskRef}
                    className='mask2 z-20'
                >
                    <ThemeChange />
                     <DotGridBackground
                                        dotSize={0.8}
                                        dotColor="#ffffff65"
                                        dotIntensity={4}
                    />
                </motion.div>

                <div className='body2 absolute top-0 -z-10'>
                    <EndPage />
                </div>

            </main>
        </>
    );
};

export default LastPortal;

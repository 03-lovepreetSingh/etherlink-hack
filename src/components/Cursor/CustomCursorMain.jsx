/* eslint-disable no-unused-vars */
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react'

const CustomCursorMain = () => {

    const numParticles = 30;
    const particleContainerRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
        const particleContainer = particleContainerRef.current;

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.opacity = 0;
            particle.style.zIndex = 50;
            particlesRef.current.push(particle);
            particleContainer.appendChild(particle);
        }

        const handleMouseMove = (event) => {
            particlesRef.current.forEach((particle, index) => {
                const size = 20 - (index / 2);
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;

                if (size < 2) {
                    particle.style.width = "2px";
                    particle.style.height = "2px";
                }

                const delay = index * 0.003;

                gsap.to(particle, {
                    x: event.clientX - particle.clientWidth / 2,
                    y: event.clientY - particle.clientHeight / 2,
                    duration: 0.1,
                    opacity: 1,
                    ease: "power3.out",
                    delay: delay,
                });

                gsap.to(particle, {
                    opacity: 0,
                    delay: delay,
                    duration: 0.5,
                });
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            particlesRef.current.forEach(particle => particle.remove());
        };
    }, []);

    return (
        <div>
            <div ref={particleContainerRef} className=' fixed top-0 left-0 z-[99999] pointer-events-none' id="particle-container"></div>
        </div>
    )
}

export default CustomCursorMain

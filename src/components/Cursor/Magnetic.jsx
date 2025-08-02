import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Magnetic = ({ children, className }) => {
    const magneticRef = useRef(null);

    useEffect(() => {
        const node = magneticRef.current;
        if (!node) return;

        // GSAP animations
        const xTo = gsap.quickTo(node, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(node, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        // Event handlers
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { width, height, left, top } = node.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            xTo(x * 0.4); // A slightly gentler pull
            yTo(y * 0.4);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        // Add event listeners
        node.addEventListener("mousemove", handleMouseMove);
        node.addEventListener("mouseleave", handleMouseLeave);

        // Cleanup
        return () => {
            node.removeEventListener("mousemove", handleMouseMove);
            node.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div ref={magneticRef} className={className}>
            {children}
        </div>
    );
};

export default Magnetic;
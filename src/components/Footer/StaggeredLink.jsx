// StaggeredLink.js
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StaggeredLink = ({ title, href }) => {
    const [isHovered, setHovered] = useState(false);

    const parentVariants = {
        initial: {},
        hover: {
            transition: {
                staggerChildren: 0.01, 
            },
        },
    };

    const reelVariants = {
        initial: { y: 0 },
        hover: { y: '-50%' }, 
    };

    const reelTransition = {
        type: "circOut",
    };

    return (
        <motion.a
            href={href || '#'}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            variants={parentVariants}
            initial="initial"
            animate={isHovered ? "hover" : "initial"}
            className="relative block overflow-hidden text-neutral-700 transition-colors duration-300 hover:text-black whitespace-nowrap"
        >
            {title.split('').map((letter, index) => (
                <span key={index} className="inline-block overflow-hidden h-[1.2em] align-bottom">
                    <motion.span
                        className="inline-block"
                        variants={reelVariants}
                        transition={reelTransition}
                    >
                        {letter === ' ' ? '\u00A0' : letter}
                        <br />
                        {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                </span>
            ))}
        </motion.a>
    );
};

export default StaggeredLink;
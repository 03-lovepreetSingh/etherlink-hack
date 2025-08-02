import React from 'react';
import { motion } from 'framer-motion';

const StaggeredTextButton = ({ text,href, hoverText, className, ...props }) => {
    const textChars = text.split("");
    const hoverChars = (hoverText || text).split("");

    const maxLength = Math.max(textChars.length, hoverChars.length);

    const paddedTextChars = [...textChars, ...Array(maxLength - textChars.length).fill('\u00A0')];
    const paddedHoverChars = [...hoverChars, ...Array(maxLength - hoverChars.length).fill('\u00A0')];

    const containerVariants = {
        hover: {
            transition: {
                staggerChildren: 0.025,
            },
        },
    };

    const letterVariants = {
        rest: {
            y: "0%",
        },
        hover: {
            y: "-250%",
        },
    };

    return (
        <motion.button
            initial="rest"
            whileHover="hover"
            animate="rest"
            className={`relative inline-block cursor-pointer overflow-hidden whitespace-nowrap text-center transition-colors duration-300 ${className}`}
            {...props}
        >
            <motion.div
                variants={containerVariants}
                className="flex"
                aria-hidden="true"
            >
                {paddedTextChars.map((char, index) => (
                    <div key={index} className="relative">
                        <motion.div
                            variants={letterVariants}
                            transition={{ duration: 0.5, ease: [0.6, 0.01, -0.05, 0.9] }}
                            className="relative"
                        >
                            <span className="inline-block">
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                            <span className="text-black absolute left-0 top-[250%] inline-block">
                                {paddedHoverChars[index] === ' ' ? '\u00A0' : paddedHoverChars[index]}
                            </span>
                        </motion.div>
                    </div>
                ))}
            </motion.div>
            <span className="sr-only text-black ">{text}</span>
        </motion.button>
    );
};

export default StaggeredTextButton
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { motion } from "framer-motion";

const DURATION = 0.4;

const FlipLink = ({ children, size, color, font, onClick }) => {
    return (
        <div className="flex items-center justify-center gap-5">
            <motion.a
                initial="initial"
                whileHover="hovered"
                onClick={onClick}
                className={`relative inline-block overflow-hidden whitespace-nowrap ${font} ${color} select-none cursor-pointer ${size}`}
                style={{
                    lineHeight: 1.2,
                }}
            >
                {/* Top Text */}
                <motion.span
                    variants={{
                        initial: { y: 0 },
                        hovered: { y: "-100%" },
                    }}
                    transition={{
                        duration: DURATION,
                        ease: "easeInOut",
                    }}
                    className="block"
                >
                    {children}
                </motion.span>

                {/* Bottom Text */}
                <motion.span
                    variants={{
                        initial: { y: "100%" },
                        hovered: { y: 0 },
                    }}
                    transition={{
                        duration: DURATION,
                        ease: "easeInOut",
                    }}
                    className="block absolute left-0 top-0"
                >
                    {children}
                </motion.span>
            </motion.a>
        </div>
    );
};

export default FlipLink;

"use client";;
import React from 'react';
import gsap from 'gsap';

const Bg = () => {
    const handleMouseEnter = (event) => {
        const square = event.currentTarget;
        gsap.to(square, {
            duration: 0.1,
            backgroundColor: "#9D00FF",
            ease: "power1.inOut",
        });
    };

    const handleMouseLeave = (event) => {
        const square = event.currentTarget;
        gsap.to(square, {
            delay: -0.35,
            duration: 1,
            backgroundColor: "#09090b",
            ease: "power1.inOut",
        });
    };

    return (
        <React.Fragment>
            <div className="h-full w-screen overflow-hidden bg-[#09090b]">
                <div
                    className="grid h-full w-full grid-cols-[repeat(auto-fit,_minmax(50px,_1fr))] grid-rows-[repeat(auto-fit,_minmax(50px,_1fr))] md:grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] md:grid-rows-[repeat(auto-fit,_minmax(100px,_1fr))]"
                >
                    {Array.from({ length: 105 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-full w-full border-[1px] border-[#80808016] square"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        ></div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Bg;

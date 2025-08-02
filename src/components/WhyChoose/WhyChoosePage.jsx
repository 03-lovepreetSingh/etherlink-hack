'use client';

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import MobileWhyChoose from './MobileWhyChoose';
import WhyChoosePc from './WhyChoosePc';

gsap.registerPlugin(ScrollTrigger);

const WhyChoosePage = () => {
    const [isLargeScreen, setIsLargeScreen] = useState(null); // null initially

    useEffect(() => {
        const checkSize = () => {
            setIsLargeScreen(window.matchMedia('(min-width: 768px)').matches);
        };

        checkSize(); // run on mount
        window.addEventListener('resize', checkSize); // update on resize

        return () => window.removeEventListener('resize', checkSize);
    }, []);

    if (isLargeScreen === null) return null;

    if (isLargeScreen) {
        return (
            <WhyChoosePc />
        )
    } else {
        return (
            <MobileWhyChoose />
        )
    }
}

export default WhyChoosePage

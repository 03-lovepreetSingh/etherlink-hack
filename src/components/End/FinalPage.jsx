'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useInView } from 'framer-motion';
import DotGridBackground from '../ui/dotGridBackground';
import DotGrid from './../ui/dotgridreactive';
import StaggeredTextButton from '../StaggeredButton';
import Image from 'next/image';
import TestimonialCarousel from '../testimonial-home';
gsap.registerPlugin(ScrollTrigger);

const StringAnimation2 = () => {
    const string1Ref = useRef(null);
    const defaultPath = "M 100 100 Q 700 100 1350 100";
    const [isMouseOver, setIsMouseOver] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event) => {
            setIsMouseOver(true);
            const svgElement = string1Ref.current.querySelector('svg');
            if (svgElement) {
                const boundingBox = svgElement.getBoundingClientRect();
                const relativeX = event.clientX - boundingBox.left;
                const relativeY = event.clientY - boundingBox.top;

                const newPath = `M 100 100 Q ${relativeX} ${relativeY} 1350 100`;

                gsap.to(svgElement.querySelector('path'), {
                    attr: { d: newPath },
                    duration: 0.6,
                    ease: 'power3.out',
                });
            }
        };

        const handleMouseLeave = () => {
            setIsMouseOver(false);
            gsap.to(string1Ref.current.querySelector('svg path'), {
                attr: { d: defaultPath },
                duration: 3,
                ease: 'elastic.out(0.85, 0.11)',
            });
        };

        const string1Element = string1Ref.current;

        if (string1Element) {
            string1Element.addEventListener('mousemove', handleMouseMove);
            string1Element.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (string1Element) {
                string1Element.removeEventListener('mousemove', handleMouseMove);
                string1Element.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return (
        <div>
            <div ref={string1Ref} id="string1" className='lg:flex items-center justify-center h-[6vh] overflow-visible z-[5] hidden mb-8'>
                <svg id="str1" width="1440" height="200" className='z-[5]'>
                    <path d="M 100 100 Q 700 100 1350 100" stroke={"#dbcaab"} strokeWidth={2} fill="transparent" />
                </svg>
            </div>
        </div>
    )
}

const AnimatedText = ({ text, el: Wrapper = 'p', className, style, stagger = 0.03 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-100px 0px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: stagger } },
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } },
    };

    return (
        <Wrapper className={className} style={style} ref={ref}>
            {text.split(' ').map((word, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    aria-hidden="true" // Hide from screen readers to prevent double reading
                >
                    <motion.span variants={wordVariants} className="inline-block mr-[0.25em]">
                        {word}
                    </motion.span>
                </motion.span>
            ))}
        </Wrapper>
    );
};


const FinalPage = () => {
    const ballRefs = useRef([]);
    const textRef = useRef(null);
    const Notiref1 = useRef(null)
    const Notiref2 = useRef(null)
    const registerSectionRef = useRef(null);

    // This ref is for the container of the "Register Now" section to trigger its animation
    const registerIsInView = useInView(registerSectionRef, { margin: "0px 0px" });

    // GSAP Animations
    useEffect(() => {
        // --- FIX: Create a context for this component's GSAP animations ---
        let ctx = gsap.context(() => {
                    // Floating balls animation
                    ballRefs.current.forEach((ball) => {
                        if (ball) floatBall(ball);
                    });
        
                    // Word-by-word color scroll animation
                    const words = gsap.utils.toArray('.scroll-word');
                    gsap.set(words, { color: '#dbcaab' });
        
                   let tl = gsap.timeline({
                        scrollTrigger: {
                        trigger: textRef.current,
                        start: 'top top', // Start animation when text is more in view
                        end: 'bottom top', // Extended scroll range for smoother transition
                        scrub: 1.5, // Slightly higher scrub value for smoother animation
                       
                        },
                    });

                    // Stagger the word animations more smoothly
                    words.forEach((word, i) => {
                        tl.to(word, { 
                        color: '#09090b', 
                        duration: 1.5, // Slightly longer duration for smoother transition
                        ease: 'power2.out' // Smoother easing
                        }, i * 0.08); // Reduced stagger for smoother flow
                    });

                    // Parallax scroll for the notification-like element with improved smoothness
                    tl.to(textRef.current, {
                        y: `50vh`, // Increased movement for more dramatic effect
                        scrollTrigger: {
                        trigger: Notiref1.current,
                        start: "top center", // More natural start point
                        end: "bottom ", // Extended end point for longer scroll
                        scrub: 2, // Higher scrub value for ultra-smooth movement
                        ease: "none" // Linear movement for consistent speed
                        }
                    });
                });

        // --- FIX: The cleanup function now only reverts animations created within this context ---
        return () => ctx.revert();

    }, []);

    const floatBall = (ball) => {
        gsap.to(ball, {
            x: gsap.utils.random(-40, 40),
            y: gsap.utils.random(-40, 40),
            duration: gsap.utils.random(2, 4),
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });
    };

    const paragraph = "Designed to let you focus on your work and earn crypto.";

    // Framer Motion Variants for the "Register Now" section
    const registerContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3, // This creates the stagger between the string and the text/button group
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const lastref = useRef(null);
    const lastrefisInView = useInView(lastref, { margin: "-100px 0px" });

    return (
        <div className=' w-full bg-[#fffafa] z-10 overflow-hidden relative'>
            {/** Floating Balls */}
            <div ref={(el) => (ballRefs.current[0] = el)}
                className={'h-22 w-22 md:h-35 md:w-35 bg-white shadow-xl absolute z-50 rounded-full flex items-center justify-center top-[130vh] left-[80%]'}
            >
                <div className="bg-[#33333346] h-[128px] w-[128px] rounded-full blur-lg"></div>
                <div className="bg-[#ffffffc5] h-10 w-10 rounded-full blur-md absolute"></div>
            </div>

            <div ref={(el) => (ballRefs.current[1] = el)}
                className={'h-27 w-27 md:h-40 md:w-40 bg-white shadow-xl absolute z-50 rounded-full flex items-center justify-center top-[83vh] left-[80%]'}
            >
                <div className="bg-[#33333346] h-[128px] w-[128px] rounded-full blur-lg"></div>
                <div className="bg-[#ffffffc5] h-10 w-10 rounded-full blur-md absolute"></div>
            </div>

            <div ref={(el) => (ballRefs.current[2] = el)}
                className={'h-27 w-27 md:h-40 md:w-40 bg-white shadow-xl absolute z-50 rounded-full flex items-center justify-center top-[132vh] left-[11%]'}
            >
                <div className="bg-[#33333346] h-[128px] w-[128px] rounded-full blur-lg"></div>
                <div className="bg-[#ffffffc5] h-10 w-10 rounded-full blur-md absolute"></div>
            </div>

            <div ref={(el) => (ballRefs.current[3] = el)}
                className={'h-36 md:h-46 w-36 md:w-46 bg-white shadow-xl absolute z-50 rounded-full flex items-center justify-center top-[65vh] left-[20%]'}
            >
                <div className="bg-[#33333346] h-[128px] w-[128px] rounded-full blur-lg"></div>
                <div className="bg-[#ffffffc5] h-10 w-10 rounded-full blur-md absolute"></div>
            </div>
            
            
            {/** Animated Gradient Text */}
            <motion.div
                ref={textRef}
                className='md:text-[5.6vw] mt-[100vh] lg:mt-0 pb-80 text-[11vw]  max-w-[80vw] md:max-w-[50vw]  md:leading-[1.2] text-center font-medium mx-auto   font-[Poppins] z-20'
                
            >
                {paragraph.split(' ').map((word, i) => (
                    <motion.span
                        key={`word-${i}`}
                        className="scroll-word inline-block mr-[1.2vw] z-20"
                        
                    >
                        {word}
                    </motion.span>
                ))}
            </motion.div>

            <div ref={Notiref1} className='absolute  bg-transparent h-[5vh] w-[90vw] md:w-[80vw]'>

                
            </div>

            

            <div className='w-full flex items-center justify-center mt-[20vh] mb-[20vh] z-50 '>
                <div  className='bg-transparent  w-[95vw] md:w-[80vw] flex items-start justify-center rounded-xl lg:rounded-full border-2 border-[#dbcaab]'>
                    <div ref={Notiref2} className='bg-[#09090b] w-[90vw]  rounded-xl lg:rounded-full rounded-full z-50'>
                        <div className=''>
                            {/* <DotGrid
                                dotSize={0.8}
                                gap={20}
                                baseColor="#ffffff65"
                                activeColor="#9D00FF"
                                proximity={170}
                            /> */}
                            <TestimonialCarousel/>
                            <DotGridBackground
                                dotSize={0.8}
                                dotColor="#ffffff65"
                                dotIntensity={4}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/** "Register Now" Section with Stagger Animation (Framer Motion) */}
            

            {/** Bottom Text Section with Fade-in Animation (Framer Motion) */}
            

            {/* Background DotGrid */}
            <div className='w-full h-full inset-0 absolute z-0'>
                <DotGridBackground
                    dotSize={0.8}
                    dotColor="#eea215"
                    dotIntensity={4}
                />
            </div>
        </div>
    );
};

export default FinalPage;

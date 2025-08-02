'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { motion, anticipate } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DotGridBackground from '@/Components/ui/dotGridBackground';
import DotGrid from '../ui/dotgridreactive';

gsap.registerPlugin(ScrollTrigger)

const data = {
    Link1: "",
    Link2: "",
    Link3: "",
    Link4: "",
    Link5: "",
};

export default function Page2() {
    const [active, setActive] = useState('Link1');
    const textref = useRef(null);
    const Screenref = useRef(null);

    useEffect(() => {
        gsap.to(Screenref.current, {
            rotateX: 0,
            scrollTrigger: {
                trigger: textref.current,
                start: "top -540%",
                end: "bottom -580%",
                scrub: 1,
            }
        })
    }, [])

    return (
        <div className="md:min-h-screen  bg-[#09090b] text-white relative p-30 mb-[20vh] flex flex-col items-center">

            <div className='w-full h-full inset-0 absolute z-0'>
                <DotGridBackground
                    dotSize={0.8}
                    dotColor="#ffffff65"
                    dotIntensity={4}
                />
            </div>

            {/* <div className='absolute top-0 inset-0 left-0 h-full'>
                <Bg />
            </div> */}

            <div ref={textref} className='min-h-[30vh] z-20 md:mt-0 mt-[20vh]'>
                <h1 className='md:text-[6vw] text-[12vw] capitalize text-center font-semibold font-[Inter]'>Where your Code Creates Value</h1>
                <p className='font-medium text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, quasi.</p>
            </div>
            <div style={{ perspective: "1000px" }} className='rounded-xl min-h-[60vh] md:min-h-screen w-full flex flex-col items-center md:gap-15 md:p-10 p-5 gap-5 z-20'>
                <div className="flex gap-1 md:gap-6 bg-[#2b2b2b] rounded-full border-0 p-[2.6px] z-20">
                    {['Link1', 'Link2', 'Link3', 'Link4', 'Link5'].map((role) => (
                        <button
                            key={role}
                            style={{ transformStyle: "preserve-3d" }}
                            onClick={() => setActive(role)}
                            className='p-1'
                        >
                            {active === role && (
                                <motion.div
                                    layoutId="clickedbutton"
                                    transition={{ type: "spring", bounce: 0.3, anticipate, duration: 0.6 }}
                                    className="absolute inset-0 z-0 bg-black rounded-full "
                                />
                            )}
                            <span className={clsx(
                                'md:px-6 py-2 px-3 rounded-full md:text-md font-normal capitalize transition-all relative cursor-pointer',
                                active === role ? 'bg-transparent' : 'text-neutral-400 hover:text-white'
                            )}>
                                {role}
                            </span>
                        </button>
                    ))}
                </div>

                <div ref={Screenref} className='bg-[#09090b] rotate-x-37'>
                    <div className="bg-white/8 h-[51vh] md:h-[95vh] w-[80vw] rounded-xl flex items-center justify-center z-20">
                        <div className='bg-black h-[50vh] md:h-[92vh] w-[78.5vw] rounded-lg'>
                            <video src="#"></video>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

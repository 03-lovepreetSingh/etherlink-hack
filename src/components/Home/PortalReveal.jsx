"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Page2 from "./Page2";
import Page1 from "./GradientSemiCircle";
import Particles from "./particle";
import { useThemeChange } from "../End/ThemeChangeContext";
gsap.registerPlugin(ScrollTrigger);

const MaskedPage = () => {
  const MaskRef = useRef(null);
  const containerRef = useRef(null);
  const containerRef2 = useRef(null);
  const Sphere = useRef(null);
  const contentRef = useRef(null);
  const particlesRef = useRef(null);
  const Textref1 = useRef(null);
  const Textref2 = useRef(null);

  const { isThemeDark, setIsThemeDark, isLoaded, setIsLoaded } =
    useThemeChange();

  useEffect(() => {
    // const loadTl = gsap.timeline();

    // loadTl.fromTo(Sphere.current, {
    //     y: 500,
    //     opacity: 0,
    //     scale: 0.5
    // }, {
    //     y: 0,
    //     opacity: 1,
    //     scale: 1,
    //     duration: 1.2,
    //     ease: "power3.out"
    // });

    // loadTl.fromTo(contentRef.current, {
    //     y: -200,
    //     opacity: 0
    // }, {
    //     y: 0,
    //     opacity: 1,
    //     duration: 1,
    //     ease: "power3.out"
    // }, "-=0.8");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=500", // adjust based on how much scroll you want
        scrub: 2,
        pin: true,
      },
    });

    tl.to(
      MaskRef.current,
      {
        maskSize: "1000vh",
        duration: 1,
        ease: "power1.inOut",
      },
      "1"
    );

    tl.to(
      Sphere.current,
      {
        scale: 1.5,
        y: -300,
        opacity: 0,
      },
      "1"
    );

    // tl.to(containerRef2.current, {
    //     opacity: 0,
    // }, "l2")

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <main
        ref={containerRef}
        className="main relative min-h-screen h-full w-full"
      >
        <motion.div ref={MaskRef} className="mask z-10 select-none">
          <Page2 />
        </motion.div>

        <div className="body fixed top-0 -z-10">
          <div
            style={{ perspective: "1000px" }}
            ref={containerRef2}
            className="relative w-full h-screen flex items-center justify-center overflow-hidden"
          >
            <motion.div
              ref={Sphere}
              id="SPHERE"
              // initial={{ y: 500, opacity: 0, scale: 0.5 }}
              // animate={{ y: 0, opacity: 1, scale: 1 }}
              // transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-full z-50 h-screen flex items-end justify-center pointer-events-none"
            >
              <div className="absolute top-[57%] w-[1034px] h-[1000px] rounded-full bg-[#4F46E5] border-2 border-[#4F46E5] z-10 blur-2xl " />
              <div className="absolute top-[48%] w-[1000px] h-[1000px] rounded-full bg-[#A78BFA] border-2 border-[#A78BFA] z-[5] blur-2xl" />
              <div className="absolute top-[65%] w-[1050px] h-[1000px] rounded-full bg-[#09090b] z-30 blur-[60px]" />
              <div className="absolute top-[48%] w-[1020px] h-[1020px] rounded-full bg-[#A78BFA]" />
              <div className="absolute top-[48%] w-[1010px] h-[1000px] rounded-full z-50 bg-transparent border-8 border-[#A78BFA]/50 blur-[1px]" />
              <div className="absolute top-[84%] w-[1300px] h-[800px] rounded-full bg-black z-20 blur-[100px]"></div>
            </motion.div>
            <div className="absolute bg-[#4f46e5]/60 h-20 w-80 z-50 bottom-33 blur-[80px]"></div>
            <div className="h-[25vh] rounded-full w-[66vw] bottom-60 absolute bg-[#4f46e5]/40 blur-[110px] pointer-events-none"></div>
            <div className="h-[30vh] rounded-full w-[50vw] bottom-30 left-50 absolute bg-[#4f46e5]/40 blur-[110px] pointer-events-none"></div>

            <div className="bg-gradient-to-b from-0% via-black/50 to-black/100 h-[40vh] w-full absolute bottom-0 z-50 pointer-events-none"></div>
            <div className="bg-black blur-[35px] absolute bottom-80 w-56 h-8 z-50 pointer-events-none"></div>

            <div className="bg-[#C776F6] h-[15vh] w-[57vw] absolute -top-27 left-57 rotate-[11.06deg] blur-[120px] pointer-events-none"></div>

            <div
              ref={particlesRef}
              className="z-5 absolute inset-0 left-10 w-screen h-screen"
            >
              <Particles />
            </div>

            <div
              ref={Textref1}
              className="absolute flex flex-col gap-5 items-start p-5 md:left-[48vw] md:max-w-[44vw] z-50 top-50 opacity-0 left-[5vw] max-w-[90vw]"
            >
              <h1 className="md:text-[4.4vw] text-[12vw] text-transparent bg-clip-text bg-gradient-to-r from-[#C1C1DF] from-55% to-[#333352] to-95% font-[Lato] font-semibold text-nowrap">
                What is openwave?
              </h1>
              <p className="md:text-[1.1vw] text-[4vw] text-[#ffffff] font-[inter]">
                openwave is a blockchain platform that connects open-source
                software development with decentralized finance (DeFi), creating
                a trustless bounty system for code contributions and help solve
                real life problems by allowing connectivity and seamless
                transactions between developers all over the globe.
              </p>
            </div>

            <div
              ref={Textref2}
              className="absolute left-[10vw] md:max-w-[44vw] flex flex-col gap-6 z-50 top-50 opacity-0"
            >
              <p className="md:text-[1.4vw] text-[4vw] text-[#ffffff] font-[inter]">
                We are thrilled to welcome you to a global community where
                open-source meets the power of decentralized finance. Whether
                you&apos;re here to fund innovation or earn crypto for your
                code, you&apos;re stepping into a transparent, trustless
                ecosystem where real contributions are rewarded.
              </p>
              <p className="md:text-[1.6vw] text-[4.6vw] text-[#ffffff] font-[inter]">
                Let&apos;s build the future of software—together.
              </p>
            </div>

            <motion.div
              ref={contentRef}
              // initial={{ y: -200, opacity: 0 }}
              // animate={{ y: 0, opacity: 1 }}
              // transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="flex mt-6 flex-col gap-5 text-white absolute top-54 md:top-35 z-50 items-center justify-center pointer-events-none"
            >
              <div className="backdrop-blur bg-white/10 rounded-full px-4 py-2">
                Trusted. Transparent. Blockchain-Powered.
              </div>
              <div className="md:text-[96px] text-[50px] max-w-[70vw] text-center leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#C1C1DF] from-55% to-[#333352] to-95% font-[Lato] font-semibold">
                Earn Crypto by Solving <br /> Open Source
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MaskedPage;

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";

gsap.registerPlugin(ScrollTrigger, Physics2DPlugin);

const WORDS = [
  "ALL-IN-ONE TOOL",
  "SINGLE PLATFORM",
  "PERFECT ORGANISED",
  "AUTOMATIC PROCESSES",
];

const GravityText = () => {
  const wordRefs = useRef([]);
  const triggerRef = useRef(null);

  // Break each word into span
  const generateWords = () => {
    return WORDS.map((line, lineIndex) => (
      <div key={lineIndex} className="flex gap-2 flex-wrap justify-center">
        {line.split(" ").map((word, wordIndex) => (
          <span
            key={wordIndex}
            ref={(el) => {
              if (!wordRefs.current[lineIndex])
                wordRefs.current[lineIndex] = [];
              wordRefs.current[lineIndex][wordIndex] = el;
            }}
            className="inline-block text-[#FFEE00] text-[2.5vw] md:text-xs font-light"
          >
            {word}
          </span>
        ))}
      </div>
    ));
  };

  useEffect(() => {
    const flatRefs = wordRefs.current.flat();

    // Reset position
    gsap.set(flatRefs, { y: 0, rotation: 0, opacity: 1 });

    ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "bottom center",
      end: "+=200",
      onEnter: () => {
        flatRefs.forEach((el) => {
          const angle = gsap.utils.random(-180, 180);
          const velocity = gsap.utils.random(300, 500);
          const gravity = gsap.utils.random(400, 700);

          gsap.to(el, {
            duration: 2,
            physics2D: {
              angle,
              velocity,
              gravity,
            },
            rotation: gsap.utils.random(-360, 360),
            ease: "power2.out",
          });
        });
      },
      onLeaveBack: () => {
        gsap.to(flatRefs, {
          duration: 1.5,
          y: 0,
          rotation: 0,
          ease: "power3.out",
          stagger: 0.05,
        });
      },
    });
  }, []);

  return (
    <div
      ref={triggerRef}
      className="absolute z-50 top-15 w-full flex flex-col gap-5 items-center"
    >
      <div className="w-full flex flex-col items-center gap-2">
        {generateWords()}
      </div>
      <div className="flex items-center justify-center w-full mt-10">
        <h1 className="text-center font-semibold text-[8vw] leading-10 md:leading-32 max-w-[50vw] text-[white] w-full">
          Why choose openwave
        </h1>
      </div>
    </div>
  );
};

export default GravityText;

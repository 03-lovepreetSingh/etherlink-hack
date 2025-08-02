"use Client";
import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import gsap from "gsap";
import Image from "next/image";
import DotGridBackground from "../ui/dotGridBackground";
import DotGrid from "../ui/dotgridreactive";

const PurpleSphere = ({
  // Default left position
  width = "200px", // Default width
  height = "200px", // Default height
  style = {}, // Allows for additional custom inline styles
  sphereRef,
}) => {
  // Combine dynamic positioning/sizing with any custom styles
  const svgStyle = {
    width: width,
    height: height,
    ...style, // Merge any additional styles passed via the 'style' prop
  };

  return (
    // Apply the dynamic style object to the SVG element
    <div className="z-40">
      <svg
        ref={sphereRef}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={svgStyle}
      >
        <defs>
          {/* Radial gradient for the sphere's main color and depth */}
          <radialGradient
            id="purpleSphereGradient"
            cx="30%"
            cy="30%"
            r="70%"
            fx="30%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#e0b0ff" />{" "}
            {/* Lighter purple for highlight area */}
            <stop offset="50%" stopColor="#8a2be2" /> {/* Medium purple */}
            <stop offset="100%" stopColor="#5a0090" />{" "}
            {/* Darker purple for edges */}
          </radialGradient>

          {/* Radial gradient for the specular highlight */}
          <radialGradient
            id="sphereHighlight"
            cx="35%"
            cy="25%"
            r="30%"
            fx="35%"
            fy="25%"
          >
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>

          {/* Filter for the shadow blur */}
          <filter id="shadowBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
            <feOffset dx="0" dy="5" result="offsetblur" />
            <feMerge>
              <feMergeNode in="offsetblur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shadow - a blurred ellipse positioned below the sphere */}
        <ellipse
          cx="100"
          cy="180"
          rx="60"
          ry="10"
          fill="rgba(0, 0, 0, 0.2)"
          filter="url(#shadowBlur)"
        />

        {/* Sphere body */}
        <circle cx="100" cy="100" r="80" fill="url(#purpleSphereGradient)" />

        {/* Specular Highlight */}
        <circle cx="90" cy="80" r="50" fill="url(#sphereHighlight)" />

        {/* Small, sharp highlight for extra shine */}
        <circle cx="75" cy="70" r="10" fill="rgba(255, 255, 255, 0.9)" />
      </svg>
    </div>
  );
};

const InfiniteScroller = () => {
  const scrollerRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;

    const clone = scroller.innerHTML;
    scroller.innerHTML += clone; // Duplicate content for seamless scroll

    const totalWidth = scroller.scrollWidth / 2;

    tweenRef.current = gsap.to(scroller, {
      x: `-${totalWidth}px`,
      ease: "none",
      duration: 90,
      repeat: -1,
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    tweenRef.current?.pause();
  };

  const handleMouseLeave = () => {
    tweenRef.current?.resume();
  };

  return (
    <div className="absolute z-20 top-[60vh] left-0 w-full overflow-hidden">
      <ul
        ref={scrollerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex z-[999] gap-20 w-max text-nowrap text-[#09090b] will-change-transform"
      >
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <li
              key={i}
              className="md:text-[6vw] text-[15vw] font-semibold flex items-center justify-center gap-5"
            >
              <p>openwave is Built Different</p>
              <PurpleSphere width="120px" height="110px" />
            </li>
          ))}
      </ul>
    </div>
  );
};

const ThemeChange = () => {
  const ballRefs = useRef([]);

  useEffect(() => {
    ballRefs.current.forEach((ball) => {
      floatBall(ball);
    });
  }, []);

  const floatBall = (ball) => {
    const duration = gsap.utils.random(1, 3, 0.1);
    const deltaX = gsap.utils.random(-40, 40);
    const deltaY = gsap.utils.random(-40, 40);

    gsap.to(ball, {
      x: deltaX,
      y: deltaY,
      duration: duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  };

  return (
    <div className="bg-[#fffafa] w-full min-h-[169vh] overflow-x-hidden z-10 overflow-y-visible relative">
      <div
        ref={(el) => (ballRefs.current[0] = el)}
        className={
          "h-30 w-30 bg-white shadow-xl absolute z-50 rounded-full flex items-center justify-center top-[140vh] left-[80%]"
        }
      >
        <div className="bg-[#33333346] h-[128px] w-[128px] rounded-full blur-lg"></div>
        <div className="bg-[#ffffffc5] h-10 w-10 rounded-full blur-md absolute"></div>
      </div>

      <div
        ref={(el) => (ballRefs.current[1] = el)}
        className={
          "h-40 w-40 bg-white shadow-xl absolute z-50 rounded-full flex items-center justify-center top-[51vh] left-[43%]"
        }
      >
        <div className="bg-[#33333346] h-[128px] w-[128px] rounded-full blur-lg"></div>
        <div className="bg-[#ffffffc5] h-10 w-10 rounded-full blur-md absolute"></div>
      </div>

      <div
        ref={(el) => (ballRefs.current[2] = el)}
        className={
          "h-30 w-30 bg-white shadow-xl absolute z-50 rounded-full flex items-center justify-center top-[142vh] left-[11%]"
        }
      >
        <div className="bg-[#33333346] h-[128px] w-[128px] rounded-full blur-lg"></div>
        <div className="bg-[#ffffffc5] h-10 w-10 rounded-full blur-md absolute"></div>
      </div>

      <div
        ref={(el) => (ballRefs.current[3] = el)}
        className={
          "h-35 w-35 bg-white shadow-xl absolute z-50 rounded-full flex items-center justify-center top-[110vh] left-[47%]"
        }
      >
        <div className="bg-[#33333346] h-[128px] w-[128px] rounded-full blur-lg"></div>
        <div className="bg-[#ffffffc5] h-10 w-10 rounded-full blur-md absolute"></div>
      </div>

      <InfiniteScroller />

      <div className="w-full h-full inset-0 absolute z-0">
        <DotGridBackground dotSize={0.8} dotColor="#eea215" dotIntensity={4} />
      </div>
    </div>
  );
};

export default ThemeChange;

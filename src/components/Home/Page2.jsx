"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DotGridBackground from "../ui/dotGridBackground";
import { Safari } from "../magicui/safari";

gsap.registerPlugin(ScrollTrigger);

// Sample data for the carousel
const sampleVids = [
  {
    id: 1,
    image: "https://placehold.co/1000x660/1a1a1a/ffffff?text=Slide+1",
    src: "/videos/MAINTAINER_WALLT.mp4",
  },
  {
    id: 2,
    image: "https://placehold.co/1000x660/2a2a2a/ffffff?text=Slide+2",
    src: "/videos/ADD_PROJECT_MAINTAINER.mp4",
  },
  {
    id: 3,
    image: "https://placehold.co/1000x660/3a3a3a/ffffff?text=Slide+3",
    src: "/videos/ADD_ISSUE_MAINTAINER.mp4",
  },
  {
    id: 4,
    image: "https://placehold.co/1000x660/4a4a4a/ffffff?text=Slide+4",
    src: "/videos/CONTRIBUTER_REQUEST_MAINTAINER.mp4",
  },
  {
    id: 5,
    image: "https://placehold.co/1000x660/5a5a5a/ffffff?text=Slide+5",
    src: "/videos/MERGE_ISSUE_MAINTAINER.mp4",
  },
];

const sampleVidscONTRI = [
  {
    id: 1,
    image: "https://placehold.co/1000x660/1a1a1a/ffffff?text=Slide+1",
    src: "/videos/FORM_FILLING_CONTRIBUTER.mp4",
  },
  {
    id: 2,
    image: "https://placehold.co/1000x660/2a2a2a/ffffff?text=Slide+2",
    src: "/videos/GET_ASSIGN_CONTRIBUTER.mp4",
  },
  {
    id: 3,
    image: "https://placehold.co/1000x660/3a3a3a/ffffff?text=Slide+3",
    src: "/videos/WITHDRAWAL_CONTRIBUTR.mp4",
  },
];

export default function Page2() {
  const [activeIndex, setActiveIndex] = useState(0);
  const textref = useRef(null);
  const Screenref = useRef(null);
  const [maintainer, setforMaintianer] = useState(false);

  // State to hold responsive transform settings
  const [transformSettings, setTransformSettings] = useState({
    xOffset: 350,
    yOffset: 40,
    scaleFactor: 0.85,
    rotationAngle: 10,
  });

  // --- GSAP scroll animation ---
  useEffect(() => {
    const startOffset = window.innerHeight * 1.8;
    const endOffset = window.innerHeight * 2.4;

    gsap.to(Screenref.current, {
      rotateX: 0,
      scrollTrigger: {
        trigger: textref.current,
        start: `top -${startOffset}px`,
        end: `bottom -${endOffset}px`,
        scrub: 1,
      },
    });
  }, []);

  // Enhanced responsive transform settings
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 480) {
        // Extra small mobile
        setTransformSettings({
          xOffset: Math.min(width * 0.45, 180),
          yOffset: 20,
          scaleFactor: 0.65,
          rotationAngle: 8,
        });
      } else if (width < 640) {
        // Small mobile
        setTransformSettings({
          xOffset: Math.min(width * 0.5, 250),
          yOffset: 25,
          scaleFactor: 0.7,
          rotationAngle: 10,
        });
      } else if (width < 768) {
        // Large mobile
        setTransformSettings({
          xOffset: Math.min(width * 0.45, 280),
          yOffset: 30,
          scaleFactor: 0.75,
          rotationAngle: 12,
        });
      } else if (width < 1024) {
        // Tablet
        setTransformSettings({
          xOffset: Math.min(width * 0.35, 320),
          yOffset: 35,
          scaleFactor: 0.8,
          rotationAngle: 12,
        });
      } else if (width < 1280) {
        // Small desktop
        setTransformSettings({
          xOffset: 350,
          yOffset: 40,
          scaleFactor: 0.85,
          rotationAngle: 10,
        });
      } else {
        // Large desktop
        setTransformSettings({
          xOffset: 400,
          yOffset: 45,
          scaleFactor: 0.88,
          rotationAngle: 8,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const changeSlide = (direction) => {
    setActiveIndex(
      (prev) => (prev + direction + sampleVids.length) % sampleVids.length
    );
  };

  // Enhanced transform calculation with better centering
  const getCardTransform = (index, activeIndex, totalItems) => {
    let relativeIndex = index - activeIndex;

    // Handle wrap-around for seamless loop
    if (relativeIndex > totalItems / 2) {
      relativeIndex -= totalItems;
    } else if (relativeIndex < -totalItems / 2) {
      relativeIndex += totalItems;
    }

    // Hide cards that are not the main 3
    if (Math.abs(relativeIndex) > 1) {
      return {
        x: 0,
        y: 0,
        scale: 0.3,
        rotate: 0,
        opacity: 0,
        zIndex: 0,
      };
    }

    const { xOffset, yOffset, scaleFactor, rotationAngle } = transformSettings;

    switch (relativeIndex) {
      case 0: // Center card - perfectly centered
        return {
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          opacity: 1,
          zIndex: 3,
        };
      case -1: // Left card
        return {
          x: -xOffset,
          y: yOffset,
          scale: scaleFactor,
          rotate: -rotationAngle,
          opacity: 0.7,
          zIndex: 2,
        };
      case 1: // Right card
        return {
          x: xOffset,
          y: yOffset,
          scale: scaleFactor,
          rotate: rotationAngle,
          opacity: 0.7,
          zIndex: 2,
        };
      default:
        return {
          x: 0,
          y: 0,
          scale: 0.3,
          rotate: 0,
          opacity: 0,
          zIndex: 0,
        };
    }
  };

  // Enhanced drag handler
  const handleDragEnd = (event, info) => {
    const dragThreshold = 30; // Reduced threshold for better responsiveness
    const offset = info.offset.x;

    if (offset < -dragThreshold) {
      changeSlide(1);
    } else if (offset > dragThreshold) {
      changeSlide(-1);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background */}

      {/* Content Container */}
      <div
        id="how-it-works"
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
      >
        {/* Header Section */}
        <div
          id={`how-it-works`}
          ref={textref}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl capitalize font-semibold font-[bethany] leading-tight mb-4 sm:mb-6">
            Where Your Code Creates Value
          </h1>
          <p className="font-medium text-sm sm:text-base lg:text-[16px] max-w-5xl mx-auto leading-relaxed px-4">
            Your code has value. openwave connects you to a curated marketplace
            of paid bounties on GitHub issues from top projects.
            <br className="hidden sm:block" />
            Browse challenges, submit your code, and get rewarded for your
            expertise. It's time to monetize your skills and help build better
            software.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center">
          {/* Tab buttons */}
          <div className="flex gap-1 bg-[#2b2b2b] rounded-full border-0 mb-8 sm:mb-12">
            <button
              onClick={() => setforMaintianer(true)}
              className={`relative font-bold py-2 px-4 sm:py-3 sm:px-6 text-sm sm:text-base transition-colors duration-300 ${
                maintainer
                  ? "bg-white text-black rounded-full"
                  : "text-neutral-400"
              }`}
            >
              For Maintainers
            </button>
            <button
              onClick={() => setforMaintianer(false)}
              className={`relative font-bold py-2 px-4 sm:py-3 sm:px-6 text-sm sm:text-base transition-colors duration-300 ${
                !maintainer
                  ? "bg-white text-black rounded-full"
                  : "text-neutral-400"
              }`}
            >
              For Contributors
            </button>
          </div>

          {/* Video Carousel Container */}
          <div className="w-full max-w-7xl mx-auto">
            <div
              ref={Screenref}
              className="relative w-full flex items-center justify-center"
              style={{
                height: "clamp(300px, 50vw, 600px)", // Responsive height
                minHeight: "300px",
              }}
            >
              {maintainer ? (
                <>
                  {sampleVids.map((video, index) => {
                    const transform = getCardTransform(
                      index,
                      activeIndex,
                      sampleVids.length
                    );
                    const isDraggable = index === activeIndex;

                    return (
                      <motion.div
                        key={video.id}
                        className="absolute"
                        style={{
                          width: "clamp(320px, 60vw, 700px)", // Responsive width
                          height: "clamp(200px, 37vw, 440px)", // Responsive height maintaining aspect ratio
                          maxWidth: "90vw", // Prevent overflow on very small screens
                        }}
                        animate={transform}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 25,
                          duration: 0.6,
                        }}
                        drag={isDraggable ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.1}
                        onDragEnd={handleDragEnd}
                        style={{
                          cursor: isDraggable ? "grab" : "default",
                          ...transform,
                        }}
                        whileDrag={{ cursor: "grabbing" }}
                      >
                        <div
                          style={{ pointerEvents: "none" }}
                          className="w-full h-full"
                        >
                          <Safari
                            url={video.image}
                            videoSrc={video.src}
                            className="w-full h-full"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              ) : (
                <>
                  {sampleVidscONTRI.map((video, index) => {
                    const transform = getCardTransform(
                      index,
                      activeIndex,
                      sampleVidscONTRI.length
                    );
                    const isDraggable = index === activeIndex;

                    return (
                      <motion.div
                        key={video.id}
                        className="absolute"
                        style={{
                          width: "clamp(320px, 60vw, 700px)", // Responsive width
                          height: "clamp(200px, 37vw, 440px)", // Responsive height maintaining aspect ratio
                          maxWidth: "90vw", // Prevent overflow on very small screens
                        }}
                        animate={transform}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 25,
                          duration: 0.6,
                        }}
                        drag={isDraggable ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.1}
                        onDragEnd={handleDragEnd}
                        style={{
                          cursor: isDraggable ? "grab" : "default",
                          ...transform,
                        }}
                        whileDrag={{ cursor: "grabbing" }}
                      >
                        <div
                          style={{ pointerEvents: "none" }}
                          className="w-full h-full"
                        >
                          <video
                            width="640"
                            height="400"
                            muted
                            playsInline
                            preload="auto"
                          >
                            <source src={video.src} type="video/mp4" />
                          </video>
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Arrow navigation */}
            <div className="flex justify-center items-center gap-6 sm:gap-8 mt-8 sm:mt-12">
              <button
                onClick={() => changeSlide(-1)}
                className="p-2 sm:p-3 rounded-full hover:bg-white/10 transition-colors duration-200 group"
                aria-label="Previous slide"
              >
                <Icon
                  className="text-white group-hover:text-neutral-300 transition-colors"
                  icon="ep:arrow-left-bold"
                  width="24"
                  height="24"
                />
              </button>

              {/* Slide indicators */}
              <div className="flex gap-2">
                {maintainer ? (
                  <>
                    {sampleVids.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-200 ${
                          index === activeIndex
                            ? "bg-white"
                            : "bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </>
                ) : (
                  <>
                    {sampleVidscONTRI.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-200 ${
                          index === activeIndex
                            ? "bg-white"
                            : "bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </>
                )}
              </div>

              <button
                onClick={() => changeSlide(1)}
                className="p-2 sm:p-3 rounded-full hover:bg-white/10 transition-colors duration-200 group"
                aria-label="Next slide"
              >
                <Icon
                  className="text-white group-hover:text-neutral-300 transition-colors"
                  icon="ep:arrow-right-bold"
                  width="24"
                  height="24"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

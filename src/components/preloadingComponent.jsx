"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import WaterWaveText from "./WaveWaterText";
import OdometerLoaderGSAP from "./loadingOdometer";
import { useThemeChange } from "./End/ThemeChangeContext";

const PreloadingElem = () => {
  const { isLoaded } = useThemeChange();

  const preloaderRef = useRef(null);
  const waterWaveRef = useRef(null);
  const odometerRef = useRef(null);

  useEffect(() => {
    if (
      gsap &&
      preloaderRef.current &&
      waterWaveRef.current &&
      odometerRef.current
    ) {
      if (isLoaded) {
        const tl = gsap.timeline({
          onComplete: () => {
            if (preloaderRef.current) {
              preloaderRef.current.style.display = "none";
            }
          },
        });

        tl.to(odometerRef.current, {
          duration: 0.5,
          opacity: 0,
          ease: "power2.in",
        })

          .to(
            waterWaveRef.current,
            {
              duration: 1.2,
              scale: 3,
              ease: "power3.inOut",
            },
            "-=0.5"
          )

          .to(
            preloaderRef.current,
            {
              duration: 1,
              opacity: 0,
              ease: "expo.inOut",
            },
            "-=1"
          );
      }
    }
  }, [isLoaded]);

  return (
    <div
      ref={preloaderRef}
      className="z-[9999999] flex flex-col min-w-screen w-full min-h-screen items-center py-[20vh] bg-[#111] fixed top-0 left-0"
    >
      <div ref={waterWaveRef}>
        <WaterWaveText
          key={0}
          text={"openwave"}
          waveCount={10}
          maxAmplitude={10}
          fillDuration={10}
          maxSpeed={6}
          delay={1}
        />
      </div>
      <div
        ref={odometerRef}
        className="mt-[-9vh] w-full h-full flex items-center justify-center"
      >
        <OdometerLoaderGSAP
          stoppagePoints={[]}
          pauseDuration={0.2}
          duration={8.3}
          delay={0}
          className={"font-semibold text-[1vw] scale-x-110 text-[#e6e6e6]"}
        />
      </div>
    </div>
  );
};

export default PreloadingElem;

"use client";

import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Icon } from "@iconify/react";
import DotGridBackground from "../ui/dotGridBackground";
import DotGrid from "../ui/dotgridreactive";

import { Card } from "../ui/card";
import { BorderBeam } from "../magicui/border-beam";

gsap.registerPlugin(ScrollTrigger);

const PurpleSphere = forwardRef(
  (
    {
      // Wrap component in forwardRef
      top = "50px",
      left = "50px",
      width = "200px",
      height = "200px",
      style = {},
    },
    ref
  ) => {
    // Combine dynamic positioning/sizing with any custom styles
    const svgStyle = {
      // position: 'absolute', // Essential for 'top' and 'left' to work
      // top: top,
      // left: left,
      width: width,
      height: height,
      ...style, // Merge any additional styles passed via the 'style' prop
    };

    return (
      // Apply the dynamic style object to the SVG element
      <div ref={ref} className="z-50 absolute top-60">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 200 200"
          className="l19k0qws"
          style={svgStyle}
        >
          <g filter="url(#DarkOrb_svg__a)">
            <circle
              cx="115.91"
              cy="135.003"
              r="93.184"
              fill="black"
              fillOpacity="1"
              style={{ fill: "black", fillOpacity: 1 }}
            ></circle>
          </g>
          <circle
            cx="100.002"
            cy="100.002"
            r="100.002"
            fill="url(#DarkOrb_svg__b)"
            fillOpacity="0.5"
            data-figma-bg-blur-radius="21.357"
          ></circle>
          <mask
            id="DarkOrb_svg__d"
            width="202"
            height="201"
            x="-1"
            y="0"
            maskUnits="userSpaceOnUse"
            style={{ maskType: "alpha" }}
          >
            <circle
              cx="100"
              cy="100.002"
              r="100.002"
              fill="url(#DarkOrb_svg__c)"
            ></circle>
          </mask>
          <g mask="url(#DarkOrb_svg__d)">
            <g filter="url(#DarkOrb_svg__e)">
              <circle
                cx="71.363"
                cy="73.638"
                r="44.092"
                fill="white"
                style={{ fill: "white", fillOpacity: 1 }}
              ></circle>
            </g>
            <g filter="url(#DarkOrb_svg__f)">
              <path
                fill="white"
                fillRule="evenodd"
                d="M74.4342 200.458C129.664 200.458 174.436 155.686 174.436 100.456C174.436 74.7892 164.767 51.3806 148.871 33.6748C175.279 51.6752 192.619 81.9956 192.619 116.366C192.619 171.595 147.846 216.368 92.6165 216.368C63.054 216.368 36.4875 203.54 18.1797 183.147C34.207 194.072 53.5748 200.458 74.4342 200.458Z"
                clipRule="evenodd"
                style={{ fill: "white", fillOpacity: 1 }}
              ></path>
            </g>
          </g>
          <defs>
            <filter
              id="DarkOrb_svg__a"
              width="291.824"
              height="291.824"
              x="-30.002"
              y="-10.91"
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                result="effect1_foregroundBlur_1016_7067"
                stdDeviation="26.364"
              ></feGaussianBlur>
            </filter>
            <filter
              id="DarkOrb_svg__e"
              width="157.276"
              height="157.276"
              x="-7.275"
              y="-5"
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                result="effect1_foregroundBlur_1016_7067"
                stdDeviation="17.273"
              ></feGaussianBlur>
            </filter>
            <filter
              id="DarkOrb_svg__f"
              width="243.532"
              height="251.786"
              x="-16.366"
              y="-0.871"
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                result="effect1_foregroundBlur_1016_7067"
                stdDeviation="17.273"
              ></feGaussianBlur>
            </filter>
            <linearGradient
              id="DarkOrb_svg__b"
              x1="77.489"
              x2="229.811"
              y1="58.897"
              y2="183.752"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                stopColor="#EAEAEA"
                style={{
                  stopColor: "color(display-p3 0.9180 0.9180 0.9180)",
                  stopOpacity: 1,
                }}
              ></stop>
              <stop
                offset="1"
                stopColor="#969696"
                style={{
                  stopColor: "color(display-p3 0.5879 0.5879 0.5879)",
                  stopOpacity: 1,
                }}
              ></stop>
            </linearGradient>
            <linearGradient
              id="DarkOrb_svg__c"
              x1="77.487"
              x2="229.809"
              y1="58.897"
              y2="183.752"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                stopColor="#EAEAEA"
                style={{
                  stopColor: "color(display-p3 0.9180 0.9180 0.9180)",
                  stopOpacity: 1,
                }}
              ></stop>
              <stop
                offset="1"
                stopColor="#C4C4C4"
                style={{
                  stopColor: "color(display-p3 0.7675 0.7675 0.7675)",
                  stopOpacity: 1,
                }}
              ></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }
);

PurpleSphere.displayName = "PurpleSphere";

const WhyChoosePc = () => {
  const Container = useRef(null);
  const Container2 = useRef(null);
  const Sphere = useRef(null);
  const Grid = useRef(null);
  const Grid2 = useRef(null);
  const Text = useRef(null);

  const Text1 = useRef(null);
  const Text2 = useRef(null);
  const Text3 = useRef(null);

  const TriggerRef = useRef(null);
  const [popperOrigin, setPopperOrigin] = useState(null);

  const GE1 = useRef(null);
  const GE2 = useRef(null);
  const GE3 = useRef(null);
  const GE4 = useRef(null);
  const GE5 = useRef(null);
  const GE6 = useRef(null);
  const GE7 = useRef(null);

  useEffect(() => {
    gsap.to(Sphere.current, {
      y: -500,
      ease: "expo.out",
      duration: 0.5,
      scrollTrigger: {
        trigger: Container.current,
        start: "top 20%",
        end: "45% 50%",
        scrub: 1,
      },
    });

    gsap.to(Grid.current, {
      y: -160,
      rotateX: 0,
      ease: "expo.out",
      duration: 0.5,
      scrollTrigger: {
        trigger: Container.current,
        start: "top 20%",
        end: "45% 50%",
        scrub: 1,
      },
    });

    gsap.to(Grid2.current, {
      y: -160,
      rotateX: 0,
      ease: "expo.out",
      duration: 0.5,
      scrollTrigger: {
        trigger: Container2.current,
        start: "top 20%",
        end: "45% 50%",
        scrub: 1,
      },
    });

    gsap.to(Text.current, {
      y: -100,
      duration: 0.1,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: Container.current,
        start: "top 20%",
        end: "40% 50%",
        scrub: 1,
      },
    });

    gsap.to(".grid-fade-wrapper", {
      opacity: 0,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: Container2.current,
        start: "top 20%",
        end: "bottom -140%",
        scrub: 1,
        pin: true,
      },
    });

    gsap.to(".grid-fade-wrapper", {
      opacity: 0,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: Container.current,
        start: "top 20%",
        end: "bottom top",
        scrub: 1,
        pin: true,
      },
    });

    ScrollTrigger.refresh();
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: Container2.current,
        start: "top 20%",
        end: "+=1800",
        scrub: 1,
        // scroller: document.body
      },
    });

    ScrollTrigger.refresh();

    // Add all animations at the same time (0)
    tl.to(
      GE1.current,
      {
        x: "-312px", // -23vw
        y: "412px", // 42.3vw
        opacity: 1,
        ease: "power4.inOut",
      },
      0
    )

      .to(
        GE2.current,
        {
          x: "162px", // 35vw
          y: "222px", // 28.3vw
          opacity: 1,
          ease: "power4.inOut",
        },
        0
      )

      .to(
        GE3.current,
        {
          x: "-320px", // -22.82vw
          y: "222px", // 28.3vw
          opacity: 1,
          ease: "power4.inOut",
        },
        0
      )

      .to(
        GE4.current,
        {
          x: "329px", // 0vw
          y: "-158px", // 0.5vw
          opacity: 1,
          ease: "power4.inOut",
        },
        0
      )

      .to(
        GE5.current,
        {
          x: "13px", // 0vw
          y: "-159px", // 0.5vw
          opacity: 1,
          ease: "power4.inOut",
        },
        0
      )

      .to(
        GE6.current,
        {
          x: "-161px", // -11vw
          y: "-347px", // -13.5vw
          opacity: 1,
          ease: "power4.inOut",
        },
        0
      )

      .to(
        GE7.current,
        {
          x: "334px", // 23vw
          y: "-347px", // -13.5vw
          opacity: 1,
          ease: "power4.inOut",
        },
        0
      );

    tl.to(
      Grid2.current,
      {
        y: -240,
        scale: 1.75,
        ease: "power4.inOut",
        // duration: 0.08
      },
      0.2
    );

    tl.from(
      Text1.current,
      {
        autoAlpha: 0,
        x: -80,
        ease: "power1.inOut",
      },
      "0.15"
    );

    tl.to(
      Text1.current,
      {
        autoAlpha: 0,
        ease: "power1.inOut",
      },
      "0.65"
    );

    tl.from(
      Text2.current,
      {
        autoAlpha: 0,
        x: 80,
        ease: "power1.inOut",
      },
      "0.82"
    );

    tl.to(
      Text2.current,
      {
        autoAlpha: 0,
        ease: "power1.inOut",
      },
      "1.9"
    );

    tl.from(
      Text3.current,
      {
        autoAlpha: 0,
        x: 80,
        ease: "power1.inOut",

        onComplete: () => {
          const x = window.innerWidth * 0.1;
          const y = window.innerHeight * 0.55;
          setPopperOrigin({ x, y, id: Date.now() });
        },
      },
      "2.2"
    );

    tl.to(
      GE3.current,
      {
        y: -50,
        opacity: 0,
        ease: "power1.inOut",
        duration: 0.1,
      },
      1
    );

    tl.to(
      GE5.current,
      {
        y: 50,
        opacity: 0,
        ease: "power1.inOut",
        duration: 0.1,
      },
      1
    );

    tl.to(
      GE6.current,
      {
        y: 50,
        opacity: 0,
        ease: "power1.inOut",
        duration: 0.1,
      },
      1
    );

    tl.to(
      GE7.current,
      {
        y: 50,
        opacity: 0,
        ease: "power1.inOut",
        duration: 0.1,
      },
      1
    );

    tl.to(
      Grid2.current,
      {
        y: -210,
        scale: 2.3,
        ease: "power4.inOut",
        // duration: 0.08
      },
      0.85
    );

    tl.to(
      GE2.current,
      {
        y: 50,
        opacity: 0,
        ease: "power1.inOut",
        duration: 0.1,
      },
      2.22
    );

    tl.to(
      GE4.current,
      {
        y: 50,
        opacity: 0,
        ease: "power1.inOut",
        duration: 0.1,
      },
      2.22
    );

    tl.to(
      Grid2.current,
      {
        y: -360,
        scale: 3,
        scaleY: 3.5,
        ease: "power4.inOut",
        // duration: 0.08
        // onComplete: () => {
        //     gsap.to(Text3.current, {
        //         autoAlpha: 0,
        //         ease: "power4.inOut",
        //         duration: 0.5,
        //     })
        // }
      },
      2.14
    );

    tl.to(
      Text3.current,
      {
        autoAlpha: 0,
        ease: "power4.inOut",

        onComplete: () => {
          setPopperOrigin(null);
        },
      },
      ">"
    );
  }, []);

  return (
    <div
      id="why-choose-us"
      className="w-full h-[400vh] relative items-center justify-center m-0 p-0 flex"
    >
      <PurpleSphere ref={Sphere} width="350px" height="450px" />

      <h1
        ref={Text1}
        className="text-[3vw] max-w-[40vw] z-50 text-white font-semibold fixed top-[20vh] left-[12vw]"
      >
        lorem Ipsum set imet dur
      </h1>
      <h1
        ref={Text2}
        className="text-[3vw] max-w-[40vw] z-50 text-white font-semibold fixed top-[16vh] right-[18vw]"
      >
        lorem Ipsum set imet dur
      </h1>
      <h1
        ref={Text3}
        className="text-[3vw] max-w-[25vw] z-50 text-white font-semibold fixed top-[27vh] left-[3vw]"
      >
        lorem Ipsum set imet dur
      </h1>

      <div ref={Text} className="absolute z-50 top-15">
        <div className="flex flex-col gap-5">
          <div className="text-[#FFEE00] flex text-[2.5vw] md:text-xs justify-evenly w-screen items-center font-light">
            <p>ALL-IN-ONE TOOL</p>
            <p>SINGLE PLATFORM</p>
            <p>PERFECT ORGANISED</p>
            <p>AUTOMATIC PROCESSES</p>
          </div>

          <div className="flex items-center justify-center w-full">
            <h1 className="text-center mt-10 text-[7vw] leading-10 md:leading-32 max-w-[80vw] text-[white] w-full font-[bethany]">
              Designed for Devs
              <br /> Driven by You.
            </h1>
          </div>
        </div>
      </div>

      <div
        ref={Container}
        style={{ perspective: "1000px" }}
        className="absolute top-23 md:top-63 z-10"
      >
        <div style={{ perspective: "1000px" }} className="grid-fade-wrapper">
          <div
            ref={Grid}
            className="bg-[#0F1013] h-[951px] w-[800px] border-2 border-[#bebebe27] rounded-xl grid gap-1.5 p-1 grid-cols-5 grid-rows-5 rotate-x-[55deg]"
          >
            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md"></div>

            <div className="rounded-md"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md"></div>

            <div className="rounded-md"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>

            <div className="rounded-md"></div>

            <div className="rounded-md border-2 border-[#bebebe27]"></div>
          </div>
        </div>
      </div>

      <div
        ref={Container2}
        style={{ perspective: "1000px" }}
        className="absolute z-10 top-23 md:top-63"
      >
        <div style={{ perspective: "1000px" }} className="grid-fade-wrapper2">
          <div
            ref={Grid2}
            className="bg-transparent h-[951px] w-[800px] rounded-xl grid gap-1.5 p-1 grid-cols-5 grid-rows-5 rotate-x-[55deg]"
          >
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>

            <Card
              ref={GE1}
              className="rounded-md backdrop-blur-md bg-white/10 p-4"
            >
              <div className="text-[10px] text-[#c972ff]  flex">
                Auto-Rewarded Merged PRs
              </div>
              <p className="text-[8px] text-[#f4e2ff]">
                openwave tracks merged pull requests in real-time and
                auto-distributes rewards, removing manual claim steps and
                letting contributors focus on coding.
              </p>
              <BorderBeam
                duration={6}
                delay={3}
                size={400}
                borderWidth={1}
                className="from-[#ff7191] via-blue-500 to-[#e5c297]"
              />
              <BorderBeam
                duration={6}
                size={400}
                className="from-[#fff271] via-violet-500 to-[#6eecff]"
              />
            </Card>

            <Card
              ref={GE2}
              className="rounded-md backdrop-blur-md bg-white/10 p-4"
            >
              <div className="text-[10px] text-[#c972ff]  flex">
                Auto-Rewarded Merged PRs
              </div>
              <p className="text-[8px] text-[#f4e2ff]">
                openwave tracks merged pull requests in real-time and
                auto-distributes rewards, removing manual claim steps and
                letting contributors focus on coding.
              </p>
              <BorderBeam
                duration={6}
                delay={3}
                size={400}
                borderWidth={1}
                className="from-[#ff7191] via-blue-500 to-[#e5c297]"
              />
              <BorderBeam
                duration={6}
                size={400}
                className="from-[#fff271] via-violet-500 to-[#6eecff]"
              />
            </Card>

            <div className=""></div>

            <Card
              ref={GE3}
              className="rounded-md  backdrop-blur-md bg-white/10 p-4"
            >
              <div className="text-[10px] text-[#c972ff]  flex">
                Developer-First Experience
              </div>
              <p className="text-[8px] text-[#f4e2ff]">
                Built for developers, openwave OSNF offers a clean interface,
                simple wallet setup, and automatic tracking—no red tape, just
                fast onboarding and earnings.{" "}
              </p>
              <BorderBeam
                duration={6}
                delay={3}
                size={400}
                borderWidth={1}
                className="from-[#ff7191] via-blue-500 to-[#e5c297]"
              />
              <BorderBeam
                duration={6}
                size={400}
                className="from-[#fff271] via-violet-500 to-[#6eecff]"
              />
            </Card>

            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>

            <Card
              ref={GE4}
              className="rounded-md  backdrop-blur-md bg-white/10 p-4"
            >
              <div className="text-[10px] text-[#c972ff]  flex">
                Real-Time Analytics Dashboard
              </div>
              <p className="text-[8px] text-[#f4e2ff]">
                Track contributions, earnings, and impact live. Detailed
                insights help developers optimize work and boost their presence
                in the open-source world.{" "}
              </p>
              <BorderBeam
                duration={6}
                delay={3}
                size={400}
                borderWidth={1}
                className="from-[#ff7191] via-blue-500 to-[#e5c297]"
              />
              <BorderBeam
                duration={6}
                size={400}
                className="from-[#fff271] via-violet-500 to-[#6eecff]"
              />
            </Card>

            <div className=""></div>
            <div className=""></div>

            <Card
              ref={GE5}
              className="rounded-md  backdrop-blur-md bg-white/10 p-4"
            >
              <div className="text-[10px] text-[#c972ff]  flex">
                <Icon icon="mdi:github" width="24" height="24" />
                Gamified Contributor Profiles
              </div>
              <p className="text-[8px] text-[#f4e2ff]">
                Visualize your progress, rank, and earnings in a profile built
                for engagement. Celebrate milestones and build a public
                open-source resume.{" "}
              </p>
              <BorderBeam
                duration={6}
                delay={3}
                size={400}
                borderWidth={1}
                className="from-[#ff7191] via-blue-500 to-[#e5c297]"
              />
              <BorderBeam
                duration={6}
                size={400}
                className="from-[#fff271] via-violet-500 to-[#6eecff]"
              />
            </Card>

            <Card
              ref={GE6}
              className="rounded-md  backdrop-blur-md bg-white/10 p-4"
            >
              <div className="text-[10px] text-[#c972ff]  flex">
                Decentralized Reward System
              </div>
              <p className="text-[8px] text-[#f4e2ff]">
                openwave directly integrates with GitHub to auto-track
                contributions, PRs, and merges—rewarding developers without
                manual effort. Real-time repo monitoring ensures rewards are
                triggered instantly upon successful merges.
              </p>
              <BorderBeam
                duration={6}
                delay={3}
                size={400}
                borderWidth={1}
                className="from-[#ff7191] via-blue-500 to-[#e5c297]"
              />
              <BorderBeam
                duration={6}
                size={400}
                className="from-[#fff271] via-violet-500 to-[#6eecff]"
              />
            </Card>

            <div className=""></div>
            <div className=""></div>

            <Card
              ref={GE7}
              className="rounded-md  backdrop-blur-md bg-white/10 p-4"
            >
              <div className="text-[10px] text-[#c972ff] pb-1 flex">
                Project-Specific Reward Rules
              </div>
              <p className="text-[8px]  text-[#f4e2ff]">
                Repo maintainers can define custom reward criteria—like tags,
                lines changed, or issue complexity—giving them fine-grained
                control over incentives.{" "}
              </p>
              <BorderBeam
                duration={6}
                delay={3}
                size={400}
                borderWidth={1}
                className="from-[#ff7191] via-blue-500 to-[#e5c297]"
              />
              <BorderBeam
                duration={6}
                size={400}
                className="from-[#fff271] via-violet-500 to-[#6eecff]"
              />
            </Card>

            <div className=""></div>
          </div>
        </div>
      </div>

      <div className="w-full h-full inset-0 absolute z-0">
        <DotGridBackground
          dotSize={0.8}
          dotColor="#ffffff65"
          dotIntensity={4}
        />
      </div>
    </div>
  );
};

export default WhyChoosePc;

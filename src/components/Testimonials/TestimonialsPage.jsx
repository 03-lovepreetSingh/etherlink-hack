import React, { useEffect, useRef } from "react";
import { InfiniteMovingCards } from "./InfiniteCarousal";
import gsap from "gsap";
import DotGridBackground from "../ui/dotGridBackground";
import DotGrid from "../ui/dotgridreactive";

function InfiniteMovingCardsDemo() {
  return (
    <div className="min-h-[28rem] rounded-md flex flex-col antialiased bg-white dark:bg-[#09090b] dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
        pauseOnHover={true}
      />

      <InfiniteMovingCards
        items={testimonials}
        direction="left"
        speed="slow"
        pauseOnHover={true}
      />
    </div>
  );
}

const TestimonialsPage = () => {
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
    <div
      id="customers"
      className="bg-[#09090b] dark w-full min-h-[120vh] block py-20 relative"
    >
      <div className="flex flex-col mt-18 md:mt-[20vh] gap-12 md:gap-16 z-50 md:z-10">
        <div className="text-white w-full text-center flex flex-col items-center gap-3 z-10 pointer-events-none">
          <h1 className="text-white text-3xl md:text-7xl font-bold max-w-[80vw] md:max-w-[75vw] text-center">
            Everywhere you code, we go.
          </h1>
          <p className="text-neutral-400 text-sm md:text-xl font-semibold">
            From basements to boardrooms—teams around the world are vibing with
            us.
          </p>
        </div>
        <InfiniteMovingCardsDemo />
      </div>

      {/* Floating Balls */}

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

export default TestimonialsPage;

const testimonials = [
  {
    quote:
      "openwave has revolutionized how we manage open-source contributions. The bounty system motivates contributors, and we've seen faster issue resolutions than ever before.",
    name: "Aisha Patel",
    title: "Lead Maintainer, DevConnect",
    image: "/testimonials/test0.png",
  },
  {
    quote:
      "As a contributor, openwave has opened new doors. I'm solving real-world issues and getting paid directly in crypto—it's the perfect blend of impact and incentive.",
    name: "Ravi Sharma",
    title: "Open Source Contributor",
    image: "/testimonials/test1.png",
  },
  {
    quote:
      "The transparency and accountability openwave brings to open source is a game-changer. It ensures quality deliverables while rewarding contributors fairly.",
    name: "Jessica Liu",
    title: "Project Manager, ChainSource Labs",
    image: "/testimonials/test2.png",
  },
  {
    quote:
      "Integrating GitHub with smart contracts through openwave was seamless. It's now our go-to platform for community-driven development with verifiable results.",
    name: "Daniel Thompson",
    title: "Founder, CodeDAO",
    image: "/testimonials/test3.png",
  },
  {
    quote:
      "We funded three major bug fixes through openwave and had all resolved within a week. The experience was smooth, secure, and efficient.",
    name: "Meera Nair",
    title: "Tech Lead, BitSage",
    image: "/testimonials/test4.png",
  },
  {
    quote:
      "openwave brings clarity and structure to open-source collaboration. It's more than just bounties—it's a movement toward decentralized innovation.",
    name: "Liam O’Reilly",
    title: "Community Head, Web3United",
    image: "/testimonials/test5.png",
  },
  {
    quote:
      "openwave gave us access to a global talent pool. We’ve had developers from four continents contribute to our codebase—all tracked and paid automatically via smart contracts.",
    name: "Elena Petrova",
    title: "Co-Founder, BlockNet Systems",
    image: "/testimonials/test0.png",
  },
  {
    quote:
      "I joined openwave during a student hackathon and ended up getting my first crypto payout. It’s an incredible way for new developers to gain experience and build a portfolio.",
    name: "Mohammed Faiz",
    title: "Student Developer, GitHub Campus Expert",
    image: "/testimonials/test6.png",
  },
  {
    quote:
      "As an investor, I see openwave as a disruptive force in the future of work. Decentralized project funding and fulfillment is the next big thing, and they’re leading the way.",
    name: "Olivia Grant",
    title: "Angel Investor, Web3 Capital Group",
    image: "/testimonials/test7.png",
  },
];

import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

// Testimonial data inspired by the video
const testimonials = [
  {
    company: "OpenDev Collective",
    quote:
      "openwave has completely changed how I contribute to open source. Now, my efforts are recognized and rewarded without any extra overhead.",
    author: "Aarav Mehta",
    role: "Full Stack Developer - OpenDev Collective",
  },
  {
    company: "ChainCrafters",
    quote:
      "Managing bounties and tracking contributions used to be a pain. openwave streamlined everything for us and helped grow our contributor base.",
    author: "Priya Nair",
    role: "Lead Maintainer - ChainCrafters",
  },
  {
    company: "HackLabs",
    quote:
      "Thanks to openwave, I picked up a bug fix issue, submitted a PR, and got paid in crypto—all within a weekend. It’s the dream for student developers.",
    author: "Jessica L.",
    role: "Student Developer - HackLabs",
  },
  {
    company: "openwave",
    quote:
      "openwave adds a layer of incentive that motivates real contributions. It's helping open source become more sustainable, one bounty at a time.",
    author: "Rahul Sinha",
    role: "Developer Advocate - openwave",
  },
  {
    company: "ZeroDAO",
    quote:
      "We’ve funded dozens of meaningful PRs through openwave. It’s eliminated the noise and given us a trusted way to reward valuable work.",
    author: "Lucas M.",
    role: "Founder - ZeroDAO",
  },
];

// The Carousel Component
export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to go to the next testimonial
  const nextTestimonial = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setIsAnimating(false);
    }, 500); // Duration should match the CSS transition
  };

  // Function to go to the previous testimonial
  const prevTestimonial = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + testimonials.length) % testimonials.length
      );
      setIsAnimating(false);
    }, 500);
  };

  // Automatically cycle through testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [currentIndex]); // Rerun effect when index changes

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className=" text-white rounded-[40px] p-4 md:p-16 relative overflow-hidden min-h-[400px] flex flex-col justify-between">
        {/* Decorative top quote icon */}
        <svg
          className="hidden lg:absolute top-8 left-8 w-8 h-8 text-neutral-700"
          fill="currentColor"
          viewBox="0 0 32 32"
        >
          <path d="M9.996 21.12c-1.239 0-2.235-1.002-2.235-2.242 0-1.236.996-2.238 2.235-2.238 1.235 0 2.23.998 2.23 2.234 0 1.242-1 2.246-2.23 2.246zm12.062 0c-1.238 0-2.234-1.002-2.234-2.242 0-1.236.996-2.238 2.234-2.238 1.234 0 2.229.998 2.229 2.234 0 1.242-.995 2.246-2.229 2.246zM11.124 12.508H4.232l4.483-8.322h6.892L11.124 12.508zM23.186 12.508h-6.892l4.483-8.322h6.892l-4.483 8.322z"></path>
        </svg>

        {/* Testimonial Content */}
        <div
          className={`flex-grow flex items-center justify-center transition-opacity duration-500 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="text-center">
            <p className="text-lg md:text-4xl font-light leading-snug md:leading-tight mb-8">
              {currentTestimonial.quote}
            </p>
            <div className="text-neutral-400">
              <p className="font-semibold lg:text-lg">
                {currentTestimonial.author}
              </p>
              <p className="lg:text-sm">{currentTestimonial.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute right-8 bottom-8 flex mx-auto lg:mx-0 lg:flex-col items-center lg:space-y-2">
          <button
            onClick={prevTestimonial}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={nextTestimonial}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

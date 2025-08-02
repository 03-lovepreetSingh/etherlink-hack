"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import "./infinite-moving-cards.css";

export const EarningScroll = ({
  items,
  direction = "up",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  items: {
    key:string;
    avatarUrl: string;
    amount:string;
    eventName:string;
    personName:string;
    tags?: string[]; // Add optional tags property
  }[];
  direction?: "up" | "down";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "down") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-h-[300px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex flex-col h-max min-h-full shrink-0 flex-nowrap gap-4 px-4",
          start && "animate-scroll-vertical",
        )}
      >
        {items.map((item) => (
        <div 
          key={item.key}
          className="flex items-center justify-between mb-4 p-2 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
              <img 
                alt={item.personName} 
                loading="lazy"
                decoding="async"
                className="object-cover w-full h-full"
                src={item.avatarUrl}
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                {item.personName}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {item.eventName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
              {item.amount} <span className="text-neutral-500 dark:text-neutral-400">USDC</span>
            </span>
          </div>
        </div>
      ))}
      </ul>
    </div>
  );
};

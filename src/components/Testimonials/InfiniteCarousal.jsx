"use client";
import { cn } from "../../lib/utils";
import React, { useEffect, useState } from "react";
import Image from 'next/image';

export const InfiniteMovingCards = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className
}) => {
    const containerRef = React.useRef(null);
    const scrollerRef = React.useRef(null);

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
            if (direction === "left") {
                containerRef.current.style.setProperty("--animation-direction", "forwards");
            } else {
                containerRef.current.style.setProperty("--animation-direction", "reverse");
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
                "scroller relative z-20 max-w-[90VW] overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
                className
            )}>
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex w-max min-w-full shrink-0 flex-nowrap gap-5 py-4",
                    start && "animate-scroll",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}>
                {items.map((item, idx) => (
                    <li
                        className="relative w-[200px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-200 bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] px-5 py-5 md:w-[470px] dark:border-zinc-700 dark:bg-[linear-gradient(180deg,#27272a,#18181b)] z-20"
                        key={item.name}>
                        <blockquote>
                            <div
                                aria-hidden="true"
                                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(50%_+_100px)] w-[calc(30%_+_4px)]"></div>
                            <div className="relative z-20 mt-3 flex flex-row items-center gap-5">
                                <img src={item.image} alt="user Image" width={16} height={16} className="rounded-full border-2 h-15 w-15" />
                                <span className="flex flex-col gap-1">
                                    <span
                                        className="text-sm leading-[1.6] font-normal text-neutral-500 dark:text-neutral-400">
                                        {item.name}
                                    </span>
                                    <span
                                        className="text-sm leading-[1.6] font-normal text-neutral-500 dark:text-neutral-400">
                                        {item.title}
                                    </span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className="relative z-20 text-sm leading-[1.6] font-normal text-neutral-800 dark:text-neutral-100">
                                    {item.quote}
                                </span>
                            </div>
                        </blockquote>
                    </li>
                ))}
            </ul>
        </div>
    );
};

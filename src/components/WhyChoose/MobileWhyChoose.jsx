import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import DotGridBackground from '../ui/dotGridBackground';
import DotGrid from '../ui/dotgridreactive';

gsap.registerPlugin(ScrollTrigger);

const MobileWhyChoose = () => {
    const containerRef = useRef(null);
    const cardRefs = useRef([]);

    const cardData = [
        {
            title: "Lorem Ipsum One",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.",
            color: "bg-gradient-to-br from-purple-500 to-pink-500",
        },
        {
            title: "Lorem Ipsum Two",
            content: "Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.",
            color: "bg-gradient-to-br from-blue-500 to-cyan-500",
        },
        {
            title: "Lorem Ipsum Three",
            content: "Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.",
            color: "bg-gradient-to-br from-green-500 to-teal-500",
        },
        {
            title: "Lorem Ipsum Four",
            content: "Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora.",
            color: "bg-gradient-to-br from-orange-500 to-red-500",
        },
        {
            title: "Lorem Ipsum Five",
            content: "Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor.",
            color: "bg-gradient-to-br from-indigo-500 to-purple-500",
        },
    ];

    const addToRefs = (el) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };

    useEffect(() => {
        if (!containerRef.current || cardRefs.current.length === 0) return;

        const cards = cardRefs.current;
        const numCards = cards.length;
        const stackOffset = 20; // Distance between stacked cards
        const shrinkAmount = 0.05; // How much each card shrinks (5% per level)

        const mainTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${window.innerHeight * (numCards + 1)}`,
                scrub: 1,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1
            }
        });

        // Set initial positions
        cards.forEach((card, index) => {
            gsap.set(card, {
                y: index === 0 ? 0 : '100%',
                opacity: index === 0 ? 1 : 0,
                scale: 1,
                zIndex: index, // Higher z-index for cards that appear later
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transformOrigin: "center center"
            });
        });

        // Animate each card transition
        for (let i = 1; i < numCards; i++) {
            const currentCard = cards[i];

            // Calculate timing for each card
            const startTime = (i - 1) * 1;
            const duration = 1;

            // Animate current card sliding up from below
            mainTl.to(currentCard, {
                y: 0,
                opacity: 1,
                ease: "power2.out",
                duration: duration
            }, startTime);

            // Move and shrink all previous cards
            for (let j = 0; j < i; j++) {
                if (cards[j]) {
                    const stackLevel = i - j; // How many levels back this card is
                    const newScale = 1 - (shrinkAmount * stackLevel);

                    mainTl.to(cards[j], {
                        y: -stackOffset * stackLevel,
                        scale: newScale,
                        ease: "power2.out",
                        duration: duration
                    }, startTime);
                }
            }
        }

        // Final shrinking animation for all cards
        const finalStartTime = (numCards - 1) * 1;

        cards.forEach((card, index) => {
            const finalStackLevel = numCards - index; // Final position in stack
            const finalScale = 1 - (shrinkAmount * finalStackLevel);

            mainTl.to(card, {
                scale: finalScale,
                ease: "power2.out",
                duration: 1
            }, finalStartTime);
        });

        return () => {
            mainTl.kill();
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    return (
        <div className="w-full min-h-[700vh] relative m-0 p-0">
            <div
                ref={containerRef}
                className="lg:hidden z-10 relative h-screen w-full flex items-center justify-center overflow-hidden"
            >
                <div className="relative w-full max-w-sm mx-4 h-[70vh] rounded-2xl shadow-2xl">
                    {cardData.map((card, index) => (
                        <div
                            key={index}
                            ref={addToRefs}
                            className={`${card.color} w-full h-full rounded-2xl p-6 flex flex-col justify-center items-center text-center text-white shadow-xl`}
                        >
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold">{card.title}</h3>
                                <p className="text-lg text-white/90 leading-relaxed">{card.content}</p>
                                <div className="w-16 h-1 bg-white/40 rounded-full mx-auto"></div>
                                <span className="text-sm text-white/70">Card {index + 1} of {cardData.length}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='w-full h-full inset-0 absolute z-0'>
                <DotGridBackground
                    dotSize={0.8}
                    dotColor="#ffffff65"
                    dotIntensity={4}
                />
            </div>
        </div>
    );
};

export default MobileWhyChoose;
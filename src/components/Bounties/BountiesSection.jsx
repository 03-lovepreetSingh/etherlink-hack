import React, { useEffect, useRef, useState } from "react";
import InfiniteMenu from "./InfiniteMenu";
import Image from "next/image";
import { BentoGrid, BentoGridItem } from "./BentoGrid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { FlickeringGrid } from "../ui/flickering-grid";
import DotGridBackground from "../ui/dotGridBackground";
import DotGrid from "../ui/dotgridreactive";
import Link from "next/link";
import Issue from "@/assets/components/issue";
import { useSession } from "next-auth/react";
// const BountiesSection = () => {
//     const items = [
//         {
//             image: 'https://picsum.photos/300/300?neutralscale',
//             link: 'https://google.com/',
//             title: 'Bounty 1',
//             description: 'This is pretty cool, right?'
//         },
//         {
//             image: 'https://picsum.photos/400/400?neutralscale',
//             link: 'https://google.com/',
//             title: 'Bounty 2',
//             description: 'This is pretty cool, right?'
//         },
//         {
//             image: 'https://picsum.photos/500/500?neutralscale',
//             link: 'https://google.com/',
//             title: 'Bounty 3',
//             description: 'This is pretty cool, right?'
//         },
//         {
//             image: 'https://picsum.photos/600/600?neutralscale',
//             link: 'https://google.com/',
//             title: 'Bounty 4',
//             description: 'This is pretty cool, right?'
//         }
//     ];

//     return (
//         <div id='bounties' className='min-h-[150vh] h-full relative flex items-center py-[20vh] pb-[40vh] justify-center'>
//             <div className='z-50 flex flex-col items-center w-full gap-[35vh]'>
//                 <div className='flex flex-col gap-3 w-full items-start px-[10vw]'>
//                     <h1 className='text-[8vw] font-bold leading-0 text-shadow-white text-white'>
//                         Popular
//                     </h1>
//                     <h1 className='text-[8vw] font-bold ml-[12vw] text-shadow-white text-white'>
//                         Bounties
//                     </h1>
//                 </div>

//                 <div className='h-[90vh] w-[90vw] z-50 relative'>
//                     <InfiniteMenu items={items} />
//                 </div>
//             </div>

//             <div className='absolute top-[37vh] left-[16.2vw] rotate-90'>
//                 <img src={"/arrow.png"} height={90} width={120} alt='Arrow Image' />
//             </div>

//             <div className='absolute top-[46vh] right-[11vw] rotate-12'>
//                 <h1 className='text-[4vw] text-white text-nowrap font-semibold font-[Dancing_Script]'>Drag Me</h1>
//             </div>

//             <div className='absolute top-[55.5vh] right-[6.5vw] rotate-280 rotate-y-180'>
//                 <img src={"/arrow.png"} height={70} width={90} alt='Arrow Image' />
//             </div>

//             <div className='w-full h-full inset-0 absolute z-0'>
//                 <DotGrid
//                     dotSize={2.5}
//                     gap={26}
//                     baseColor="#ffffff65"
//                     activeColor="#9D00FF"
//                     proximity={150}
//                     shockRadius={300}
//                     shockStrength={7}
//                     resistance={800}
//                     returnDuration={1.5}
//                 />
//             </div>
//         </div>
//     )
// }

// export default BountiesSection

gsap.registerPlugin(ScrollTrigger);

function BentoGridDemo() {
  const { data: session } = useSession();
  const Headref = useRef(null);
  const imgref = useRef(null);
  const btnref = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [repoData, setRepoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetch("/api/add-projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setRepoData(data.project);
          console.log(data.project, "data.project");
          setIsLoading(true);
        });
    };
    fetchData();
  }, []);

    return (
        <div id='bounties' className='dark h-full relative flex flex-col gap-[10vh]  py-20 lg:py-[20vh] justify-center'>
            <div className='lg:flex block'>
                <div ref={Headref} className=' gap-3 w-full items-start px-[10vw]'>
                    <h1 className='lg:text-7xl pb-5 text-[14vw] font-bold text-shadow-white text-white'>
                        Popular Bounties
                    </h1>
                    <p className="text-neutral-400">
                      Explore high-reward tasks from top open-source projects — solve issues, level up your profile, and earn crypto for your contributions.
                    </p>
                
                 </div>
                 <div ref={btnref} className='w-full pr-[12vw] my-auto flex items-end justify-end'>
                    <button className='text-white text-lg rounded px-5 py-3 border border-neutral-700 bg-background cursor-pointer'>
                        View More
                    </button>
                  </div> 
               
            </div>
             
            

            <div className='w-full h-full z-10 flex flex-col gap-[2vh] lg:gap-[10vh] items-end justify-end'>
                 <div className="px-[10vw] lg:my-10 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                          {isLoading ? (
                            <>
                              {repoData.map((repo) => {
                                if (!repo.image_url?.trim()) return null;
                
                                return (
                                  <div
                                    key={repo.projectName}
                                    className="hover:scale-[1.02] transition-transform duration-200 bg-[#0a0a0a]"
                                  >
                                    <Link href={`/projects/${repo.project_repository}`}>
                                      <Issue
                                        image={repo.image_url || "back_2.png"}
                                        Project={repo.projectName}
                                        activeUser={
                                          session?.user?.username || undefined
                                        }
                                        Fork={repo.forks ? repo.forks : 0}
                                        Stars={repo.stars ? repo.stars : 0}
                                        Contributors={
                                          repo.contributors && repo.contributors.collabs
                                            ? Object.keys(repo.contributors.collabs)
                                                .length
                                            : 0
                                        }
                                        shortDescription={repo.shortdes}
                                        languages={repo.languages}
                                        Tag={repo.Tag ? repo.Tag : "General"}
                                      />
                                    </Link>
                                  </div>
                                );
                              })}
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
               
                
            </div>

            

        </div>
    );
}

export default BentoGridDemo;

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
const items = [
  {
    title: "Bounty",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: <Skeleton />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Bounty",
    description: "Dive into the transformative power of technology.",
    header: <Skeleton />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Bounty",
    description: "Discover the beauty of thoughtful and functional design.",
    header: <Skeleton />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Bounty",
    description:
      "Understand the impact of effective communication in our lives.",
    header: <Skeleton />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Bounty",
    description: "Join the quest for understanding and enlightenment.",
    header: <Skeleton />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Bounty",
    description: "Experience the thrill of bringing ideas to life.",
    header: <Skeleton />,
    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Bounty",
    description: "Embark on exciting journeys and thrilling discoveries.",
    header: <Skeleton />,
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  },
];

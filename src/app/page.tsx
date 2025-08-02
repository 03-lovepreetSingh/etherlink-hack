'use client'
import PricingPage from "@/components/PricingPage/PricingPage"
import SmoothScroll from "./SmoothScroll"
import TestimonialsPage from '@/components/Testimonials/TestimonialsPage';
import WhyChoosePage from '@/components/WhyChoose/WhyChoosePage';
import LastPortal from '@/components/End/LastPortal';
import FinalPage from '@/components/End/FinalPage';
import BountiesSection from '@/components/Bounties/BountiesSection';
import NavBar3 from '@/components/NavBar/NavBar3';
import MaskedPage from "@/components/Home/PortalReveal";
import Footer from "@/components/Footer/Footerpage";
import { ThemeProvider, useThemeChange } from '@/components/End/ThemeChangeContext';
import CustomCursor from '@/components/Cursor/Cursor';
import { CursorProvider } from '@/components/Cursor/CursorContext';
import PreloadingElem from '@/components/preloadingComponent';
import How1 from "@/components/HowItWorks/how1";
import Page2 from "@/components/Home/Page2";
import InfiniteCarousel from "@/components/Home/infiniteCarousel";
import DotGridBackground from '@/components/ui/dotGridBackground';
import { InteractiveHoverButton } from '@/components/Home/interactiveButtons';
import Link from 'next/link';
export default function Home() {
  return (
    <SmoothScroll>
      <ThemeProvider>
        <CursorProvider>
          <HomeElems />
        </CursorProvider>
      </ThemeProvider>
    </SmoothScroll >
  )
}

const HomeElems = () => {
  const { isLoaded } = useThemeChange();

  return (
    <div id="CompleteHomePage" className="bg-[#09090b] w-full min-h-screen overflow-hidden relative">
      <CustomCursor />
      <div className="block gap-20 px-10 lg:px-0  lg:flex max-w-7xl mx-auto  py-20 lg:py-40">
        <div className='w-full h-full inset-0 absolute z-0'>
          <DotGridBackground dotSize={0.8} dotColor="#ffffff65" dotIntensity={4} />
        </div>
        <div className="lg:w-1/2">
          <div className="font-bold mb-5  text-4xl lg:text-7xl">
            Earn Crypto by Solving Github Issues
          </div>
          <div className="lg:text-lg text-sm">
            Be part of the decentralized development revolution. Collaborate on open-source projects hosted on GitHub, complete meaningful tasks, and earn verified crypto payouts directly to your wallet — empowering developers like you to build the future of Web3.
          </div>
          <div className="mt-4">
            <Link className="cursor-pointer" href="/Login">
              <InteractiveHoverButton>Register Now</InteractiveHoverButton>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 my-auto">
          <InfiniteCarousel />
        </div>
        
      </div>
      <NavBar3 />
      <Page2/>
      <BountiesSection />
      <PricingPage />
      <TestimonialsPage />
      <LastPortal />
      <FinalPage />
      <Footer />
    </div>
  )
}

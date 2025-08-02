import React from 'react'
import { PricingTabs } from './PricingTabs'
import DotGridBackground from '../ui/dotGridBackground'
import DotGrid from '../ui/dotgridreactive'

const PricingPage = () => {
    return (
        <div className="bg-[#09090b] dark w-full min-h-[130vh] md:min-h-screen py-[5vh] md:py-[20vh] relative no-visible-scrollbar">
            <div>
                <PricingTabs />
                <div className='w-full h-full inset-0 absolute z-0'>
                    <DotGridBackground
                        dotSize={0.8}
                        dotColor="#ffffff65"
                        dotIntensity={4}
                    />
                </div>
            </div>
        </div>
    )
}

export default PricingPage

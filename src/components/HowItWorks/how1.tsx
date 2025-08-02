"use client"

import { useState } from "react"
import Image from "next/image"
import DotGridBackground from "../ui/dotGridBackground"
export default function How1() {
  const [activeTab, setActiveTab] = useState("maintainers")
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <section className="md:min-h-screen bg-[#09090b] text-white relative p-5 lg:p-30  flex flex-col items-center">
      <div className="max-w-7xl z-50 mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-blue-400 text-sm z-50 font-medium mb-4">How it works</p>
          <h2 className="text-4xl md:text-5xl z-50 lg:text-6xl font-bold mb-8">Earn rewards for open source</h2>

          {/* Toggle Buttons */}
          <div className="inline-flex bg-neutral-800 z-50 rounded-full p-1 mb-16">
            <button
              onClick={() => setActiveTab("contributors")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "contributors" ? "bg-white text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              For Contributors
            </button>
            <button
              onClick={() => setActiveTab("maintainers")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "maintainers" ? "bg-white text-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              For Maintainers
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="relative z-50">
          {/* Mobile Slider */}
          <div className="md:hidden">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {/* Step 01 */}
                <div className="w-full flex-shrink-0 px-4">
                  <div className="bg-neutral-900 rounded-3xl p-8 relative overflow-hidden transform lg:-rotate-12 mx-4">
                    <div className="mb-6">
                      <h3 className="text-6xl font-bold mb-2">
                        01<span className="text-green-400">*</span>
                      </h3>
                      <h4 className="text-2xl font-bold mb-4">Add a Bounty</h4>
                      <p className="text-neutral-400 text-sm leading-relaxed">
                        Easily attach a crypto bounty to any GitHub issue from the GitEarn dashboard or GitEarn Bot.
                      </p>
                    </div>
                    <div className="relative">
                      <Image
                        src="/placeholder.svg?height=300&width=400"
                        alt="GitEarn dashboard showing bounty creation interface"
                        width={400}
                        height={300}
                        className="rounded-lg transform transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 02 */}
                <div className="w-full flex-shrink-0 px-4">
                  <div className="bg-neutral-900 rounded-3xl p-8 relative mx-4">
                    <div className="mb-6">
                      <h3 className="text-6xl font-bold mb-2">
                        02<span className="text-green-400">*</span>
                      </h3>
                      <h4 className="text-2xl font-bold mb-4">Track Submissions</h4>
                      <p className="text-neutral-400 text-sm leading-relaxed">
                        Sit back and track contributor activity in real time. See who's assigned, view submitted pull
                        requests, and follow issue progress — all within GitEarn's dashboard.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 03 */}
                <div className="w-full flex-shrink-0 px-4">
                  <div className="bg-neutral-900 rounded-3xl p-8 relative overflow-hidden transform lg:rotate-12 mx-4">
                    <div className="mb-6">
                      <h3 className="text-6xl font-bold mb-2">
                        03<span className="text-green-400">*</span>
                      </h3>
                      <h4 className="text-2xl font-bold mb-4 italic">Merge & Reward</h4>
                      <p className="text-neutral-400 text-sm leading-relaxed">
                        Once PR is reviewed and merged, approve the bounty to the contributor via dashboard or bot.
                      </p>
                    </div>
                    <div className="relative">
                      <Image
                        src="/placeholder.svg?height=300&width=400"
                        alt="GitEarn dashboard showing merge and reward interface"
                        width={400}
                        height={300}
                        className="rounded-lg transform  transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Dots */}
            <div className="flex justify-center z-50 mt-8 space-x-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index ? "bg-green-400" : "bg-neutral-600"
                  }`}
                />
              ))}
            </div>

            {/* Mobile Navigation Arrows */}
            <div className="flex justify-between items-center mt-6 px-4">
              <button
                onClick={() => setCurrentSlide(currentSlide > 0 ? currentSlide - 1 : 2)}
                className="bg-neutral-800 hover:bg-neutral-700 rounded-full p-3 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentSlide(currentSlide < 2 ? currentSlide + 1 : 0)}
                className="bg-neutral-800 hover:bg-neutral-700 rounded-full p-3 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {/* Step 01 */}
            <div className="bg-neutral-900 mx-3 rounded-3xl p-8 relative overflow-hidden transform lg:-rotate-12">
              <div className="mb-6">
                <h3 className="text-6xl font-bold mb-2">
                  01<span className="text-green-400">*</span>
                </h3>
                <h4 className="text-2xl font-bold mb-4">Add a Bounty</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Easily attach a crypto bounty to any GitHub issue from the GitEarn dashboard or GitEarn Bot.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="GitEarn dashboard showing bounty creation interface"
                  width={400}
                  height={300}
                  className="rounded-lg transform transition-transform duration-300"
                />
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-neutral-900 mx-3 mb-40 rounded-3xl p-8 relative">
              <div className="mb-6">
                <h3 className="text-6xl font-bold mb-2">
                  02<span className="text-green-400">*</span>
                </h3>
                <h4 className="text-2xl font-bold mb-4">Track Submissions</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Sit back and track contributor activity in real time. See who's assigned, view submitted pull
                  requests, and follow issue progress — all within GitEarn's dashboard.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-neutral-900 mx-3 rounded-3xl p-8 relative overflow-hidden transform lg:rotate-12">
              <div className="mb-6">
                <h3 className="text-6xl font-bold mb-2">
                  03<span className="text-green-400">*</span>
                </h3>
                <h4 className="text-2xl font-bold mb-4 italic">Merge & Reward</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Once PR is reviewed and merged, approve the bounty to the contributor via dashboard or bot.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="GitEarn dashboard showing merge and reward interface"
                  width={400}
                  height={300}
                  className="rounded-lg transform  transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full h-full inset-0 absolute z-0'>
                      <DotGridBackground
                          dotSize={0.8}
                          dotColor="#ffffff65"
                          dotIntensity={4}
                      />
        </div>
    </section>
  )
}

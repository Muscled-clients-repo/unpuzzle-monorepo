'use client';

import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0E27]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E27] via-[#151934] to-[#1E2341]"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-[#00AFF0] rounded-full mix-blend-screen filter blur-[128px] opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-0 w-80 h-80 bg-[#FF006E] rounded-full mix-blend-screen filter blur-[128px] opacity-70 animate-pulse [animation-delay:2s]"></div>
        <div className="absolute -bottom-40 left-60 w-80 h-80 bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[128px] opacity-70 animate-pulse [animation-delay:4s]"></div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgba(255,255,255,0.03)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
            backgroundSize: '32px 32px'
          }}
        ></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
          <div>
            {/* Logo */}
            <div className="mb-20">
              <Image src="/assets/logo.svg" alt="Unpuzzle Logo" width={60} height={60} className="brightness-0 invert" />
            </div>

            {/* Main Content */}
            <div className={`space-y-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div>
                <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                  Transform Education<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AFF0] to-[#FF006E]">
                    One Puzzle at a Time
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Join the next generation of educators using AI-powered tools to create 
                  immersive, interactive learning experiences that students love.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-2 gap-4 mt-12">
                <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00AFF0]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00AFF0] to-[#0077BE] rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">50M+ Views</h3>
                    <p className="text-gray-400 text-sm">Educational content created on our platform</p>
                  </div>
                </div>

                <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF006E]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF006E] to-[#C4004C] rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">15K+ Courses</h3>
                    <p className="text-gray-400 text-sm">Created by expert instructors worldwide</p>
                  </div>
                </div>

                <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">AI-Powered</h3>
                    <p className="text-gray-400 text-sm">Smart content creation and analytics</p>
                  </div>
                </div>

                <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">98% Success</h3>
                    <p className="text-gray-400 text-sm">Student completion rate average</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Testimonial */}
          <div className="mt-12">
            <div className="relative">
              <div className="absolute -left-4 -top-4 text-6xl text-white/10">"</div>
              <blockquote className="relative z-10 text-gray-300 text-lg italic">
                Unpuzzle completely changed how I approach online teaching. The interactive 
                puzzles and AI assistance help me create content that truly resonates with my students.
              </blockquote>
              <div className="mt-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00AFF0] to-[#0077BE] rounded-full"></div>
                <div>
                  <p className="text-white font-semibold">Dr. Emily Rodriguez</p>
                  <p className="text-gray-400 text-sm">MIT Computer Science</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Glass morphism card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00AFF0] to-[#0077BE] rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Join as Instructor</h2>
                <p className="text-gray-300">Start creating amazing educational content</p>
              </div>

              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none border-0 bg-transparent",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    formButtonPrimary: "bg-gradient-to-r from-[#00AFF0] to-[#0077BE] hover:from-[#0099d6] hover:to-[#0066a6] transition-all duration-300 shadow-lg hover:shadow-xl py-3 text-base font-semibold transform hover:scale-105",
                    footerActionLink: "text-[#00AFF0] hover:text-white font-medium transition-colors",
                    formFieldInput: "bg-white/10 backdrop-blur border-white/20 text-white placeholder-gray-400 focus:border-[#00AFF0] focus:ring-2 focus:ring-[#00AFF0]/50 rounded-xl px-4 py-3",
                    formFieldLabel: "text-gray-300 font-medium mb-2",
                    identityPreviewText: "text-gray-300",
                    identityPreviewEditButton: "text-[#00AFF0] hover:text-white",
                    formHeaderTitle: "text-2xl font-bold text-white",
                    formHeaderSubtitle: "text-gray-400",
                    socialButtonsBlockButton: "bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 text-white transition-all duration-300",
                    dividerLine: "bg-white/20",
                    dividerText: "text-gray-400 text-sm px-4 bg-transparent",
                    formFieldAction: "text-[#00AFF0] hover:text-white transition-colors",
                    footerAction: "text-gray-400",
                    card__main: "gap-6",
                    formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
                    otpCodeFieldInput: "bg-white/10 backdrop-blur border-white/20 text-white",
                  },
                  layout: {
                    socialButtonsPlacement: "bottom",
                    socialButtonsVariant: "blockButton",
                  }
                }}
                signInUrl="/sign-in"
                forceRedirectUrl="/instructor/video-editor"
              />

              {/* Additional Features */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure Platform</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <svg className="w-5 h-5 text-[#00AFF0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>AI-Powered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Links */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                By signing up, you agree to our{" "}
                <a href="#" className="text-[#00AFF0] hover:text-white transition-colors">Terms</a>
                {" & "}
                <a href="#" className="text-[#00AFF0] hover:text-white transition-colors">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
'use client';

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function SignInPage() {
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
        {/* Left Side - Welcome Back Section */}
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
                  Welcome Back to<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AFF0] to-[#FF006E]">
                    Your Classroom
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Continue your journey of inspiring students through interactive, 
                  puzzle-based learning experiences.
                </p>
              </div>

              {/* Quick Access Cards */}
              <div className="grid grid-cols-1 gap-4 mt-12">
                <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00AFF0]/10 to-transparent rounded-2xl"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#00AFF0] to-[#0077BE] rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Continue Where You Left Off</h3>
                      <p className="text-gray-400 text-sm mt-1">Jump back into your latest course edits</p>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF006E]/10 to-transparent rounded-2xl"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#FF006E] to-[#C4004C] rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">View Your Analytics</h3>
                      <p className="text-gray-400 text-sm mt-1">Track student engagement and progress</p>
                    </div>
                  </div>
                </div>

                <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent rounded-2xl"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Manage Your Students</h3>
                      <p className="text-gray-400 text-sm mt-1">Review submissions and provide feedback</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div>
              <p className="text-4xl font-bold text-white">2.5M+</p>
              <p className="text-gray-400 text-sm mt-1">Active Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">98%</p>
              <p className="text-gray-400 text-sm mt-1">Satisfaction Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">24/7</p>
              <p className="text-gray-400 text-sm mt-1">Support Available</p>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Glass morphism card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00AFF0] to-[#0077BE] rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-300">Sign in to continue to your dashboard</p>
              </div>

              <SignIn 
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
                signUpUrl="/sign-up"
                forceRedirectUrl="/instructor/video-editor"
              />

              {/* Quick Actions */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <button className="text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Forgot Password?
                  </button>
                  <button className="text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Contact Support
                  </button>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>256-bit SSL</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>SOC 2 Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
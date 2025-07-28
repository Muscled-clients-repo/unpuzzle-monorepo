"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useNavigationWithLoading } from "./hooks/useNavigationWithLoading";

export default function Home() {
  const { navigate } = useNavigationWithLoading();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "Interactive Video Editing",
      description: "Create engaging educational content with our powerful video editor",
      icon: "🎬",
      delay: "delay-100",
      gradient: "from-[#00AFF0] to-[#0077BE]"
    },
    {
      title: "Puzzle-Based Learning",
      description: "Transform complex topics into interactive puzzles that enhance understanding",
      icon: "🧩",
      delay: "delay-200",
      gradient: "from-[#FF006E] to-[#C4004C]"
    },
    {
      title: "AI-Powered Insights",
      description: "Get intelligent feedback and analytics to improve your teaching methods",
      icon: "🤖",
      delay: "delay-300",
      gradient: "from-[#8B5CF6] to-[#6D28D9]"
    },
    {
      title: "Collaborative Platform",
      description: "Connect with students and track their learning journey in real-time",
      icon: "👥",
      delay: "delay-400",
      gradient: "from-[#00AFF0] to-[#FF006E]"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Instructors" },
    { value: "50K+", label: "Students Enrolled" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-[#0A0E27] overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E27] via-[#151934] to-[#1E2341]"></div>
          
          {/* Animated gradient orbs matching sign-in/sign-up */}
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

        {/* Hero Content */}
        <div className={`relative z-10 text-center max-w-4xl mx-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image src="/assets/logo.svg" alt="Unpuzzle Logo" width={80} height={80} className="brightness-0 invert" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your Teaching with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AFF0] to-[#FF006E]"> Unpuzzle</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create interactive educational content that engages students and enhances learning through puzzle-based methodology
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/instructor/video-editor')}
              className="px-8 py-4 bg-gradient-to-r from-[#00AFF0] to-[#0077BE] text-white font-semibold rounded-full hover:from-[#0099d6] hover:to-[#0066a6] shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Go to Dashboard
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-full border-2 border-white/20 hover:bg-white/20 hover:border-[#00AFF0] hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Everything You Need to Create Amazing Content
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transform hover:-translate-y-2 transition-all duration-300 ${feature.delay}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 rounded-2xl transition-opacity`}></div>
                <div className="relative">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#00AFF0] to-[#FF006E] relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#151934] to-[#0A0E27]"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of educators who are already creating engaging content with Unpuzzle
          </p>
          <button 
            onClick={() => navigate('/instructor/video-editor')}
            className="px-10 py-5 bg-gradient-to-r from-[#00AFF0] to-[#0077BE] text-white text-lg font-semibold rounded-full hover:from-[#0099d6] hover:to-[#0066a6] shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Continue to Dashboard
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#0A0E27] border-t border-white/10 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">&copy; 2024 Unpuzzle. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-[#00AFF0] transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-[#00AFF0] transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-[#00AFF0] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
}
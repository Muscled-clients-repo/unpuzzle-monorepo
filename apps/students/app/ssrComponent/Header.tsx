'use client'
import Image from "next/image";
import Link from "next/link";
import Tiers from "../tiers/Tiers";
import React, { useState } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <header className="border-b border-gray-200">
      <nav className="flex justify-between items-center container mx-auto px-4 py-4">
        <Link href="/" className="text-gray-800">
          <div className="flex items-center gap-2">
            <Image
              src="/img/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <h1 className="text-2xl font-bold">Unpuzzle</h1>
          </div>
        </Link>
        {/* clerk header */}
        <div className=" ml-auto mr-[17px] flex items-center">

            <SignedOut>
  <div className="flex gap-4">
    {/* Sign In */}
    <SignInButton>
      <button className="bg-white text-[#6c47ff] border border-[#6c47ff] hover:bg-[#f3f0ff] transition-colors duration-200 rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-5 shadow-md">
        Sign In
      </button>
    </SignInButton>

    {/* Sign Up */}
    <SignUpButton>
      <button className="bg-[#6c47ff] text-white hover:bg-[#5a39d9] transition-colors duration-200 rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-5 shadow-md">
        Sign Up
      </button>
    </SignUpButton>
  </div>
</SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>

        </div>

        <button
          className="cursor-pointer btn btn-primary bg-[#3385F0] text-white p-3  font-semibold text-xs rounded-sm"
          onClick={() => setModalOpen(true)}
        >
          Early Adapter $30/mon
        </button>
      </nav>
      <Tiers modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </header>
  );
}

'use client'
import Image from "next/image";
import { NavigationLink } from "../components/content/NavigationLink";
import Tiers from "../tiers/Tiers";
import React, { useState } from "react";

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <header className="border-b border-gray-200">
      <nav className="flex justify-between items-center container mx-auto px-4 py-4">
        <NavigationLink href="/" className="text-gray-800">
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
        </NavigationLink>
        {/* User profile area */}
        <div className=" ml-auto mr-[17px] flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-sm font-medium">IU</span>
          </div>
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

'use client'
import React from "react";
import Modal from './Model';
import FreeTierContent from './FreeTierContent';
import PaidTierContent from './PaidTierContent';

interface TiersProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const Tiers: React.FC<TiersProps> = ({ modalOpen, setModalOpen }) => {
    const [tier, setTier] = React.useState('free');
    const [selectedPlan, setSelectedPlan] = React.useState('paid');
  return (
    <div>
      {/* Removed the Video Model button here */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Left: Form */}
          <div className="flex-1 bg-white p-6 rounded-lg">
            <h2 className="text-[#1D1D1D] font-inter text-3xl font-semibold leading-normal mb-4">Upgrade your plan</h2>
            <p className="text-[#55565B] font-inter text-base font-normal leading-[24px]">Mteger sed urna non enim consectetur volutpat. Aliquam volutpat massa tellus</p>
            <form className="space-y-4 mt-8">
              <div className="mb-5">
                <label className="block text-[#55565B] font-inter text-sm font-bold leading-[24px]">Billed To</label>
                <div className="flex gap-2 mt-1">
                  <div className="flex-1">
                    <label className="block text-[#303030] font-inter text-xs font-[450] leading-[20px] pb-1">First name</label>
                    <input className="border rounded px-3 py-2 w-full" placeholder="First name"  />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[#303030] font-inter text-xs font-[450] leading-[20px] pb-1">Last name</label>
                    <input className="border rounded px-3 py-2 w-full" placeholder="Last name"  />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-[#303030] font-inter text-xs font-[450] leading-[20px] pb-1">Email</label>
                  <input className="border rounded px-3 py-2 w-full" placeholder="Email"/>
                </div>
              </div>
              {selectedPlan === 'paid' && (
                <div>
                  <label className="block text-[#55565B] font-inter text-sm font-bold leading-[24px]">Payment Details</label>
                  <div className="mb-2">
                    <label className="block text-[#303030] font-inter text-xs font-[450] leading-[20px] pb-1">Card Number</label>
                    <input className="border rounded px-3 py-2 w-full" placeholder="Card Number"  />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[#303030] font-inter text-xs font-[450] leading-[20px] pb-1">Expiration date</label>
                      <input className="border rounded px-3 py-2 w-full" placeholder="(MM / YY)" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[#303030] font-inter text-xs font-[450] leading-[20px] pb-1">Security code</label>
                      <input className="border rounded px-3 py-2 w-full" placeholder="Security code" defaultValue="123" />
                    </div>
                  </div>
                </div>
              )}
              <button type="submit" className="cursor-pointer w-full flex h-[44px] p-[14px] justify-center items-center  rounded-[8px] bg-[#1D1D1D] text-white text-sm font-bold leading-normal">Subscribe</button>
            </form>
            <p className="text-xs text-gray-500 mt-4">roin feugiat congue est, et elementum justo finibus vel. Sed eget porta ligula. Donec molestie at diam sed congue.</p>
          </div>
          {/* Right: Pricing Plans */}
          <div className="flex-1 flex flex-col gap-4 bg-[#F4F6F8] rounded-[20px] p-6">
            <h3 className="text-[#1D1D1D] font-inter text-2xl font-semibold leading-normal pb-2">Pricing Plan</h3>
            <div
              className={`mb-2`}
            >
              <FreeTierContent 
                selected={selectedPlan === 'free'}
                onSelect={() => setSelectedPlan('free')}
              />
            </div>
            <div>
              <PaidTierContent 
                selected={selectedPlan === 'paid'}
                onSelect={() => setSelectedPlan('paid')}
              />
            </div>
            {/* Total section below the cards */}
            <div className="mt-4 mb-4 block w-full h-[2px] bg-[#DEE2EA]"></div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[#1D1D1D] font-inter text-4xl font-bold leading-normal">Total</span>
              {selectedPlan === 'paid' ? (
                <span className="text-[#1D1D1D] font-inter text-4xl font-bold leading-normal">$30 / Month</span>
              ) : (
                <span className="text-[#1D1D1D] font-inter text-4xl font-bold leading-normal">Free</span>
              )}
            </div>
            <p className="text-[#55565B] font-inter text-base font-normal leading-normal mt-2">roin feugiat congue est, et elementum justo finibus vel. Sed eget porta ligula. Donec molestie at diam sed congue.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Tiers;

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import LeftArrow from "../assets/icons/Left Arrow.svg";
import CheckMark from "../assets/icons/CheckMark.svg";
import UnCheckMark from "../assets/icons/UnCheckMark.svg";
import PricingPlanCard from "./pricing-plan-card";
import GoBack from "./shared/navigation-back-button";
const plans = [
  {
    heading: "Plus Plan",
    amount: "$100 /per month",
    recommended: true,
    features: [
      { name: "All starter features +", isSelected: false },
      { name: "5 user accounts", isSelected: true },
      { name: "Team collaboration tools", isSelected: true },
      { name: "Custom dashboards", isSelected: true },
      { name: "Multiple data export formats", isSelected: true },
      { name: "Basic custom integrations", isSelected: true },
    ],
  },
  {
    heading: "Starter Plan",
    amount: "$50 /per month",
    recommended: false,
    features: [
      { name: "Basic features", isSelected: true },
      { name: "2 user accounts", isSelected: true },
      { name: "Basic support", isSelected: true },
      { name: "Standard dashboards", isSelected: false },
    ],
  },
  {
    heading: "Enterprise Plan",
    amount: "$200 /per month",
    recommended: false,
    features: [
      { name: "All features of Plus Plan", isSelected: true },
      { name: "Unlimited user accounts", isSelected: true },
      { name: "Premium support", isSelected: true },
      { name: "Advanced analytics", isSelected: true },
      { name: "Priority custom integrations", isSelected: true },
    ],
  },
];

const Pricing = () => {
  // states
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isMonthly, setIsMonthly] = useState(true); // Default to "Monthly"

  const toggleHandler = () => {
    setIsMonthly(!isMonthly);
  };
  // Function to toggle the visibility of the card
  const handleSelectPlanClick = () => {
    setIsCardVisible(true);
  };

  return (
    <>
      <div className=" w-full">
        <Image
          src={LeftArrow}
          alt="Go Back Icon"
          className=" cursor-pointer"
          onClick={() => GoBack()}
        />
      </div>
      <div className="flex justify-center items-center flex-col">
        <div className=" flex flex-col justify-center text-center">
          <div className=" text-[56px]">Plans & Pricing</div>
          <div className=" w-[50%] mx-auto">
            Choose the plan that fits your needs. All plans include essential
            features to get you started, with options to scale as you grow. No
            hidden fees and the flexibility to change anytime.
          </div>
        </div>
        <div>
          <div>
            <div className="flex items-center space-x-4">
              {/* Toggle Switch */}
              <div
                onClick={toggleHandler}
                className={`relative cursor-pointer h-10 rounded-full transition-all w-60 flex items-center bg-gray-300 p-1`}
              >
                {/* Conditionally render the left label (Monthly) */}
                <span
                  className={`absolute left-3 text-sm font-semibold transition-all`}
                >
                  Monthly
                </span>

                {/* Conditionally render the right label (Annual) */}
                <span
                  className={`absolute right-3 text-sm font-semibold transition-all
`}
                >
                  Annual
                </span>

                {/* The absolute button inside */}
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 h-9 bg-white rounded-full transition-all w-[48%] 
            ${isMonthly ? "" : "translate-x-full"}`}
                >
                  {/* Conditionally render the text inside the button */}
                  <span
                    className={`absolute w-full h-full flex items-center justify-center text-sm font-semibold transition-all
             `}
                  >
                    {isMonthly ? "Monthly" : "Annual"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className=" text-[#00AFF0] text-sm text-center">
            -15% off on annual payments
          </div>
        </div>
        <div className=" flex gap-5">
          {plans.map((value, index) => {
            return (
              <div
                className={`card h-[445px] w-[308px] rounded-xl  flex flex-col px-1 pb-1 ${
                  value?.recommended ? "bg-[#00AFF0]" : ""
                }`}
                key={index}
              >
                <div className="text-white text-xs my-2 text-center">
                  {value?.recommended ? "MOST POPULAR PLAN" : ""}
                </div>
                <div className=" bg-[#FFFFFF] rounded-xl flex-1 px-8 py-[30px] border-2 border-[#E4E4E4] relative">
                  <div className=" heading-of-card">
                    <div className=" flex gap-1">
                      <div className=" text-xl font-bold">{value?.heading}</div>
                      {value?.recommended && (
                        <div className=" bg-[#00AFF0] flex justify-around gap-1 items-center rounded-full py-1.5 px-2 text-white text-xs">
                          {" "}
                          <Star className="text-white w-3 h-3" fill="white" />
                          Most populer
                        </div>
                      )}
                    </div>
                    <div className="child-heading text-[#666666]">
                      {value?.amount}
                    </div>
                  </div>
                  {value?.features.map((feature, featureIndex) => {
                    return (
                      <div
                        className=" listing-section-of-card flex items-center"
                        key={featureIndex}
                      >
                        <Image
                          src={feature?.isSelected ? CheckMark : UnCheckMark}
                          className=" h-[20px] w-[20px]"
                          alt="Picture of the author"
                        />
                        {feature?.name}
                      </div>
                    );
                  })}
                  <div
                    className=" w-[70%] left-1/2 transform -translate-x-1/2 rounded-full bg-[#00AFF0] text-white py-3 text-center absolute bottom-8 cursor-pointer"
                    onClick={handleSelectPlanClick}
                  >
                    Select Plan
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <PricingPlanCard
        plans={plans}
        isCardVisible={isCardVisible}
        setIsCardVisible={setIsCardVisible}
      />
    </>
  );
};

export default Pricing;

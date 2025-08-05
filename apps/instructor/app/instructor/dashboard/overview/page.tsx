import Table from "@/app/components/shared/Table";
import { TrendingUp } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className=" px-6 py-9 flex flex-col gap-6">
      <div className=" text-[32px]">Overview</div>
      <div className=" text-[#212636] text-[20px]">
        Complete Website Responsive Design
      </div>
      <div className="puzzle-agent flex justify-around w-full h-[148px] border border-[#DDE7EE] rounded-xl p-6">
        {["Learn Rate", "Execution Rate", "Execution Pace", "Quize Stats"].map(
          (value, index) => {
            return (
              <React.Fragment key={index}>
                <div
                  className={` h-full w-[20%] flex flex-col gap-3 `}
                  key={index}
                >
                  <div>
                    <div className="agen-name text-[#667085] text-[16px]">
                      {value}
                    </div>
                    <div className="puzzle-count text-[32px]">
                      48 m/hr {/* {video[value as keyof Video]} */}
                    </div>
                  </div>

                  <div className=" flex justify-center w-full text-sm mt-auto">
                    <div className={`flex text-[#14AC7A]`}>
                      <TrendingUp />
                      15%
                    </div>
                    <div>higher then average</div>
                  </div>
                </div>
                <div
                  className={`${
                    index !== 3 ? "border-r border-[#DDE7EE]" : ""
                  }`}
                ></div>
              </React.Fragment>
            );
          }
        )}
      </div>
      <div className="least-performing-video grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* card 1 */}
        <div className="least-performing-video p-6 rounded border border-[#EEEEEE] ">
          Least Performing Video
          <div className="text-5xl text-[#FF5630]">22m/hr</div>
          <div>The 2025 UI/UX Crash Course for Beginners</div>
          <div className="states mt-10">
            {["Execution Rat", "Execution Pace", "Quize Stats"].map(
              (value, index) => {
                return (
                  <div className="w-full max-w-lg mx-auto" key={index}>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <span className="text-sm font-semibold text-gray-500">
                          {value}
                        </span>
                        <span className="text-sm font-semibold text-gray-500">
                          20/hr
                        </span>
                      </div>
                      <div className="flex mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-[#00AFF0] h-full rounded-full w-[70%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
          <button className="bg-transparent hover:bg-[#00AFF0] text-[#00AFF0] font-semibold hover:text-white py-2 px-4 border border-[#00AFF0] hover:border-transparent rounded">
            Watch Again
          </button>
        </div>
        {/* card 2 */}
        <div className="least-performing-video p-6 rounded border border-[#EEEEEE] ">
          Least Performing Video
          <div className="text-5xl text-[#15B79F]">48m/hr</div>
          <div>The 2025 UI/UX Crash Course for Beginners</div>
          <div className="states mt-10">
            {["Execution Rat", "Execution Pace", "Quize Stats"].map(
              (value, index) => {
                return (
                  <div className="w-full max-w-lg mx-auto" key={index}>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <span className="text-sm font-semibold text-gray-500">
                          {value}
                        </span>
                        <span className="text-sm font-semibold text-gray-500">
                          20/hr
                        </span>
                      </div>
                      <div className="flex mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-[#00AFF0] h-full rounded-full w-[70%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
          <button className="bg-transparent hover:bg-[#00AFF0] text-[#00AFF0] font-semibold hover:text-white py-2 px-4 border border-[#00AFF0] hover:border-transparent rounded">
            Watch Again
          </button>
        </div>
      </div>
      {/* Skill Learn Rate */}
      <div className="least-performing-video grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Table 1 */}

        <Table
          columns={[
            { title: "Keyword", key: "keyword" },
            { title: "Learn Rate", key: "learnRate" },
          ]}
          data={[
            { id: "1", keyword: "UI Design", learnRate: "48m/hr" },
            { id: "2", keyword: "React Development", learnRate: "35m/hr" },
            { id: "3", keyword: "UX Research", learnRate: "42m/hr" },
          ]}
          heading="Skill Learn Rate"
          routing={false}
        />
        {/* Table 2 */}
        <Table
          columns={[
            { title: "Keyword", key: "keyword" },
            { title: "Learn Rate", key: "learnRate" },
          ]}
          data={[
            { id: "1", keyword: "UI Design", learnRate: "48m/hr" },
            { id: "2", keyword: "React Development", learnRate: "35m/hr" },
            { id: "3", keyword: "UX Research", learnRate: "42m/hr" },
          ]}
          heading="Skill Learn Rate"
          routing={false}
        />
      </div>
    </div>
  );
};

export default page;

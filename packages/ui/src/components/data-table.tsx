"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

interface TableProps {
  columns: { title: string; key: string; link?: boolean }[]; // Column titles and keys
  data: any[]; // Data to populate in the table
  routePrefix?: string; // Optional prefix for dynamic routing (e.g., /courses)
  heading: string;
  routing: boolean;
}

const Table = ({
  columns,
  data,
  routePrefix = "",
  heading = "",
  routing = true,
}: TableProps) => {
  const router = useRouter();
  // functions
  const handleRowClick = (id: string) => {
    const newUrl = `${routePrefix}/${id}`; // Use routePrefix as a prefix for dynamic URLs
    router.push(newUrl);
  };
  useEffect(() => {
    
  }, []);

  return (
    <div className=" rounded-xl border border-[#EEEEEE] p-6">
      <div className=" text-[20px]">{heading}</div>
      <table className="w-full text-left table-auto min-w-max text-slate-800">
        <thead>
          <tr className="text-slate-500 border-b border-slate-300 ">
            {columns.map((column, index) => (
              <th className="p-4" key={index}>
                <p className="text-sm leading-none font-normal">
                  {column.title}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, rowIndex) => (
            // <Link href={`${routePrefix}/${row.id}`}>
            <tr
              key={rowIndex}
              className="hover:bg-[#EAF3FD] hover:text-[#3385F0] cursor-pointer"
              onClick={() => {
                if (routing) handleRowClick(row.id);
              }} // Add onClick handler to the row
            >
              {columns.map((column, colIndex) => (
                <td className="p-4" key={colIndex}>
                  {column.link ? (
                    // If the column should have a link, make it clickable
                    <div className="text-blue-500">{row[column.key]}</div>
                  ) : (
                    <p className="text-sm">{row[column.key]}</p>
                  )}
                </td>
              ))}
            </tr>
            //   </Link>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

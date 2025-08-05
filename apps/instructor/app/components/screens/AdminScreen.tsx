"use client";
import React, { useEffect, useRef } from "react";
import { FaSort, FaSearch } from "react-icons/fa";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import {
  setFilter,
  toggleCheckedItem,
  toggleSelectAll,
  setSortOption,
  setSearchText,
  toggleSortPopup,
  toggleSearch,
  setCurrentPage,
} from "../../redux/features/admin/adminSlice";
import { DataItem } from "../../types/adminscreen.types";

const data: DataItem[] = [
  {
    id: 1,
    name: "Mahtab Alam",
    email: "Muscledclient@gmail.com",
    date: "2024-09-25",
    time: "10:00 AM",
    status: "New",
  },
  {
    id: 2,
    name: "Mahtab Alam",
    email: "Muscledclient@gmail.com",
    date: "2024-09-26",
    time: "2:15 PM",
    status: "Deny",
  },
  {
    id: 3,
    name: "Mahtab Alam",
    email: "Muscledclient@gmail.com",
    date: "2024-09-26",
    time: "2:15 PM",
    status: "Deny",
  },
  {
    id: 4,
    name: "Mahtab Alam",
    email: "Muscledclient@gmail.com",
    date: "2024-09-26",
    time: "2:15 PM",
    status: "Deny",
  },
  {
    id: 5,
    name: "Mahtab Alam",
    email: "Muscledclient@gmail.com",
    date: "2024-09-26",
    time: "2:15 PM",
    status: "Deny",
  },
  {
    id: 6,
    name: "Mahtab Alam",
    email: "Muscledclient@gmail.com",
    date: "2024-09-26",
    time: "2:15 PM",
    status: "Deny",
  },
  {
    id: 7,
    name: "Mahtab Alam",
    email: "Muscledclient@gmail.com",
    date: "2024-09-26",
    time: "2:15 PM",
    status: "Deny",
  },
  {
    id: 8,
    name: "Mahtab Alam",
    email: "Muscledclient@gmail.com",
    date: "2024-09-26",
    time: "2:15 PM",
    status: "Deny",
  },
  {
    id: 9,
    name: "Mahtab Alam",
    email: "Muscledclient@gmail.com",
    date: "2024-09-26",
    time: "2:15 PM",
    status: "Deny",
  },
  {
    id: 10,
    name: "Mahtab Alam",
    email: "Muscledclient@gmail.com",
    date: "2024-09-26",
    time: "2:15 PM",
    status: "Deny",
  },
  {
    id: 11,
    name: "Mahtab Alam",
    email: "Muscledclient@gmail.com",
    date: "2024-09-26",
    time: "2:15 PM",
    status: "Deny",
  },
  {
    id: 12,
    name: "Mahtab Alam",
    email: "Muscledclient@gmail.com",
    date: "2024-09-26",
    time: "2:15 PM",
    status: "Deny",
  },
  // More data...
];

const statusOptions: string[] = ["All", "Approved", "Deny", "New"];
const sortOptions: string[] = ["Name", "Date", "Status"];

const AdminScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {
    filter,
    checkedItems,
    isSelectAll,
    currentPage,
    sortOption,
    searchText,
    isSortPopupOpen,
    isSearchOpen,
  } = useSelector((state: any) => state.admin);

  const rowsPerPage = 10;

  // Refs for detecting outside clicks
  const searchRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort popup if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle Sort Popup
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        if (isSortPopupOpen) {
          dispatch(toggleSortPopup()); // Close sort popup if open
        }
      }

      // Handle Search Popup
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        if (isSearchOpen) {
          dispatch(toggleSearch()); // Close search popup if open
        }
      }
    };

    if (isSortPopupOpen || isSearchOpen) {
      // Add event listener if either popup is open
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // Clean up event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortPopupOpen, isSearchOpen, dispatch, sortRef, searchRef]);

  // Filter and sort the data based on the selected options
  const filteredData: any =
    filter === "All"
      ? data.filter((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        )
      : data.filter(
          (item) =>
            item.status === filter &&
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );

  const sortedData: any = [...filteredData].sort((a, b) => {
    if (sortOption === "Name") return a.name.localeCompare(b.name);
    if (sortOption === "Date") {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    }
    if (sortOption === "Status") return a.status.localeCompare(b.status);
    return 0;
  });

  // Checkbox handling functions
  const handleCheckboxChange = (id: any) => {
    dispatch(toggleCheckedItem(id));
  };

  const handleSelectAllChange = () => {
    dispatch(toggleSelectAll(filteredData?.map((item: any) => item.id)));
  };

  const handleFilterChange = (newFilter: string) => {
    dispatch(setFilter(newFilter));
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleSortChange = (option: string) => {
    dispatch(setSortOption(option));
  };

  return (
    <div className="px-2">
      <h1 className="text-lg pb-2 font-bold">Teacher Account Request</h1>
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            {statusOptions.map((option) => (
              <button
                key={option}
                className={`px-4 py-2 rounded-md text-sm ${
                  filter === option ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
                onClick={() => handleFilterChange(option)}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Sort and Search Section */}
          <div className="flex space-x-4 items-center relative">
            {/* Search Button */}
            <div ref={searchRef}>
              {isSearchOpen ? (
                <>
                  <input
                    type="text"
                    className="border border-gray-300 px-2 py-1 rounded-lg text-sm"
                    placeholder="Search by name"
                    value={searchText}
                    onChange={(e) => dispatch(setSearchText(e.target.value))}
                    // onBlur={() => setIsSearchOpen(false)} // Close input when it loses focus
                    autoFocus // Automatically focus on input when opened
                  />
                </>
              ) : (
                <button
                  className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-300"
                  onClick={() => dispatch(toggleSearch())}
                >
                  <FaSearch />
                </button>
              )}
            </div>

            {/* Sort button with icon */}
            <div ref={sortRef}>
              <button
                className="flex items-center px-2 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-300"
                onClick={() => dispatch(toggleSortPopup())}
              >
                <Image
                  src="/sort_minor.png"
                  alt="Sort Icon"
                  width={20}
                  height={20}
                />
              </button>

              {/* Sorting popup */}
              {isSortPopupOpen && (
                <div className="absolute left-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSortChange(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left text-sm">
                  <input
                    type="checkbox"
                    checked={isSelectAll}
                    onChange={handleSelectAllChange}
                    className="accent-black"
                  />
                </th>
                <th className="p-2 text-left font-medium text-gray-500 text-sm">
                  Name
                </th>
                <th className="p-2 text-left font-medium text-gray-500 text-sm">
                  Email
                </th>
                <th className="p-2 text-left font-medium text-gray-500 text-sm">
                  Date
                </th>
                <th className="p-2 text-left font-medium text-gray-500 text-sm">
                  Time
                </th>
                <th className="p-2 text-center text-sm"></th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((item: any) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-100 transition text-sm"
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="accent-black"
                    />
                  </td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.email}</td>
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">{item.time}</td>
                  <td className="p-2 text-center">
                    {checkedItems.includes(item.id) ? (
                      <>
                        <button className="bg-blue-400 text-white text-center px-2 py-1 rounded mr-2">
                          Delete
                        </button>
                        <button className="bg-gray-200 text-black text-center px-3 py-1 rounded">
                          Cancel
                        </button>
                      </>
                    ) : item.status === "Approved" ? (
                      <span className="bg-green-200 text-black-600 text-center px-2 font-semibold rounded-lg">
                        Active
                      </span>
                    ) : (
                      <>
                        <button className="bg-blue-400 text-white text-center px-2 py-1 rounded mr-2">
                          Approve
                        </button>
                        <button className="bg-gray-200 text-black text-center px-3 py-1 rounded">
                          Deny
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex mx-6 px-6 items-center justify-between mt-4 border-t border-gray-200 pt-4">
          <span className="ml-13 text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <div className="mr-13">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-300 text-black-400"
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`ml-2 px-3 py-1 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-300 text-black-400"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;

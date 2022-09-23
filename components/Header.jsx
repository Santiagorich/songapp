import React from "react";
import Link from "next/link";

function Header() {
  return (
    <div className="relative black-color ">
      <div className="mx-4 max-full px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:flex-1">
            <Link href="/">
              <a>
                <span className="sr-only">Top100</span>
                <div className="h-8 w-auto sm:h-10 ">
                  <svg className="fill-red-500 w-12 h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47 40">
                    <path d="M23.5 6.5c-6 0-9.75 3-11.25 9 2.25-3 4.875-4.125 7.875-3.375 1.712.428 2.935 1.67 4.29 3.044C26.62 17.41 29.172 20 34.75 20c6 0 9.75-3 11.25-9-2.25 3-4.875 4.125-7.875 3.375-1.712-.428-2.935-1.67-4.29-3.044C31.63 9.09 29.078 6.5 23.5 6.5zM12.25 20c-6 0-9.75 3-11.25 9 2.25-3 4.875-4.125 7.875-3.375 1.712.428 2.935 1.67 4.29 3.044C15.37 30.91 17.922 33.5 23.5 33.5c6 0 9.75-3 11.25-9-2.25 3-4.875 4.125-7.875 3.375-1.712-.428-2.935-1.67-4.29-3.044C20.38 22.59 17.828 20 12.25 20z"></path>
                  </svg>
                </div>
              </a>
            </Link>
          </div>
          <div className="flex flex-row flex-1 gap-2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <span className="text-gray-500 font-bold">Search</span>
          </div>
          <nav className="hidden space-x-10 md:flex">
            <Link href="/AdminPage">
              <a className="text-base font-medium text-gray-500 hover:text-white">
                Admin Page
              </a>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;

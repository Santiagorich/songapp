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
                  <svg
                    className="fill-red-500 w-12 h-12"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 47 40"
                  >
                    <path d="M23.5 6.5c-6 0-9.75 3-11.25 9 2.25-3 4.875-4.125 7.875-3.375 1.712.428 2.935 1.67 4.29 3.044C26.62 17.41 29.172 20 34.75 20c6 0 9.75-3 11.25-9-2.25 3-4.875 4.125-7.875 3.375-1.712-.428-2.935-1.67-4.29-3.044C31.63 9.09 29.078 6.5 23.5 6.5zM12.25 20c-6 0-9.75 3-11.25 9 2.25-3 4.875-4.125 7.875-3.375 1.712.428 2.935 1.67 4.29 3.044C15.37 30.91 17.922 33.5 23.5 33.5c6 0 9.75-3 11.25-9-2.25 3-4.875 4.125-7.875 3.375-1.712-.428-2.935-1.67-4.29-3.044C20.38 22.59 17.828 20 12.25 20z"></path>
                  </svg>
                </div>
              </a>
            </Link>
          </div>
          <div className="flex flex-row flex-1 gap-2 w-max "></div>
          <a
            href="https://github.com/Santiagorich"
            className="flex flex-row gap-4 select-none"
          >
            <svg viewBox="0 0 128 128" className="w-6 h-6 text-white">
              <g fill="#fff">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
                ></path>
                <path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"></path>
              </g>
            </svg>
            <span className="text-gray-300 font-bold">GitHub</span>
          </a>
          {/* <nav className="hidden space-x-10 md:flex">
            <Link href="/AdminPage">
              <a className="text-base font-medium text-gray-300 hover:text-white">
                Admin Page
              </a>
            </Link>
          </nav> */}
        </div>
      </div>
    </div>
  );
}

export default Header;

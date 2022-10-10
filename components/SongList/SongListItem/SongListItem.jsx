import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
function SongListItem({ song, playSong, pauseSong, currentlyPlaying }) {
const isCurrentSong = currentlyPlaying && currentlyPlaying.src == song.song;
  const [ytLink, setYtLink] = useState(
    `https://music.youtube.com/search?q=${encodeURI(
      song.title + " - " + song.artist
    )}`
  );
  const mobile = useSelector((state) => state.userSlice.isMobile);
  return (
    <div // I rather use the same var for mobile everywhere than set them with tailwind's breakpoints
      className={`w-full px-2 h-16 relative overflow-hidden ${isCurrentSong && `scale-105 bg-gray-color-light shadow-lg`} transition transform duration-200 ease-out cursor-pointer group`}
      onClick={(e) => {
        let audio = song.song;
        if (isCurrentSong) {
          pauseSong();
        } else {
          pauseSong();
          playSong(audio);
        }
      }}
    >
      <div className="flex flex-row items-center gap-4 py-2 px-2 h-fit bbhalf border-gray-500">
        <div className="w-8 h-8 flex-shrink-0 flex justify-center items-center">
          <span className={`text-white text-2xl flex-shrink-0 z-10`}>
            {song.number}
          </span>
        </div>

        <div className="flex flex-col w-full relative">
          <span
            className={`text-white text-xl font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis w-36 z-10`}
          >
            {song.title}
          </span>
          <span className=" text-gray-500 z-10 whitespace-nowrap overflow-hidden overflow-ellipsis">{song.artist}</span>
        </div>
        <div className=" w-4 h-4 text-white flex z-20">
          {isCurrentSong && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            pauseSong();
            fetch("/api/ytmusic?query=" + song.title + " " + song.artist)
              .then((response) => response.text())
              .then((data) => {
                window.open(
                  "https://music.youtube.com/watch?v=" + data,
                  "_blank",
                  "noopener,noreferrer"
                );
              })
              .catch((err) => {
                window.open(ytLink, "_blank", "noopener,noreferrer");
              });
          }}
          aria-label={song.title + " - " + song.artist}
        >
          <div className="flex flex-row gap-3">
            <svg width="24.36" height="24" viewBox="515.041 271.284 24.36 24">
              <ellipse
                cx="527.221"
                cy="283.284"
                fill="red"
                rx="12.18"
                ry="12"
              ></ellipse>
              <ellipse
                cx="527.221"
                cy="283.284"
                fill="red"
                stroke="#fff"
                strokeWidth="1.2"
                rx="7.308"
                ry="7.2"
              ></ellipse>
              <path
                fill="#fff"
                d="M524.785 286.829l6.327-3.544-6.327-3.546v7.09z"
              ></path>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

export default SongListItem;

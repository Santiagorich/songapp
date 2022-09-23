import Image from "next/image";
import React, { useRef } from "react";

function Song({ song, playSong, pauseSong, currentlyPlaying }) {
  const audioref = useRef();
  return (
    <div
      className="rounded-2xl w-64 h-64 relative overflow-hidden hover:scale-105 hover:shadow-lg transition transform duration-200 ease-out cursor-pointer group"
      onClick={() => {
        let audio = audioref.current;
        if (currentlyPlaying === audio) {
          pauseSong(audio);
        } else {
          playSong(audio);
        }
      }}
    >
      <Image
        layout="fill"
        src={`/api/imageFetcher?url=${encodeURIComponent(song.thumbnail)}`}
        className="absolute z-0"
        objectFit="cover"
        alt={song.title}
      ></Image>
      <div className="absolute w-full h-full justify-center items-center text-white flex z-20">
        {audioref.current && currentlyPlaying == audioref.current ? (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12"
            >
              <path
                fillRule="evenodd"
                d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ) : (
          <div className="opacity-0 group-hover:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-14 h-14"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      <div
        className="flex flex-col px-4 py-6 -mt-5 w-full relative"
        
      >
        <Image
        layout="fill"
        src={`/RedPaint.png`}
        className="absolute z-0"
        objectFit="cover"
        alt={song.title}
      ></Image>
        <span className="text-white text-2xl whitespace-nowrap overflow-hidden overflow-ellipsis w-42 z-10">
          {song.number}. {song.title}
        </span>
        <span className="text-white z-10">{song.artist}</span>
      </div>
      <audio
        onEnded={() => {
          pauseSong(audioref.current);
        }}
        ref={audioref}
        controls
        className="hidden"
      >
        <source src={song.song} type="audio/mpeg"></source>
      </audio>
    </div>
  );
}

export default Song;

import Image from "next/image";
import React, { useRef } from "react";

function Song({ song, playSong, pauseSong, currentlyPlaying }) {
  return (
    <div
      style={{
        width: "300px",
        height: "300px",
        backgroundImage: `url(${song.thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="rounded-2xl w-64 h-64 relative overflow-hidden hover:scale-105 hover:shadow-lg transition transform duration-200 ease-out cursor-pointer group"
      onClick={() => {
        let audio = song.song;
        if (currentlyPlaying && currentlyPlaying.src == audio) {
          pauseSong();
        } else {
          pauseSong();
          playSong(audio);
        }
      }}
    >
      <Image
        layout="fill"
        //src={`/api/imageFetcher?url=${encodeURIComponent(song.image)}`}
        src={song.image}
        className="absolute z-0"
        objectFit="cover"
        alt={song.title}
        placeholder="empty"
      ></Image>
      <div className="absolute w-full h-full justify-center items-center text-white flex z-20">
        {currentlyPlaying && currentlyPlaying.src == song.song ? (
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
      <a
        href={`https://music.youtube.com/search?q=${encodeURI(song.title + " - " + song.artist)}`}
      >
        <div className="absolute bottom-3 left-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="24"
            fill="none"
            className="ytmusic"
          >
            <ellipse cx="12.18" cy="12" fill="red" rx="12.18" ry="12"></ellipse>
            <ellipse
              cx="12.18"
              cy="12"
              fill="red"
              stroke="#fff"
              strokeWidth="1.2"
              rx="7.308"
              ry="7.2"
            ></ellipse>
            <path
              fill="#fff"
              d="M9.744 15.545l6.327-3.544-6.327-3.546v7.09zm27.689-5.903c-.579 2.853-1.019 6.336-1.25 7.774h-.163c-.187-1.482-.627-4.942-1.227-7.75L33.31 2.677h-4.52v18.85h2.803V5.987l.277 1.451 2.85 14.086h2.804l2.803-14.086.3-1.459v15.547h2.804V2.676h-4.563l-1.435 6.966zm13.577 9.054c-.256.517-.81.876-1.368.876-.648 0-.904-.494-.904-1.706V7.754H45.54v10.29c0 2.54.856 3.706 2.758 3.706 1.296 0 2.338-.562 3.058-1.909h.07l.277 1.684h2.502V7.755h-3.198v10.94h.003zm9.382-5.506c-1.043-.742-1.691-1.236-1.691-2.314 0-.763.37-1.19 1.25-1.19.905 0 1.206.605 1.227 2.674l2.689-.111c.208-3.346-.928-4.74-3.87-4.74-2.733 0-4.078 1.19-4.078 3.638 0 2.224 1.113 3.235 2.92 4.562 1.553 1.169 2.457 1.82 2.457 2.764 0 .72-.464 1.213-1.275 1.213-.95 0-1.507-.877-1.365-2.405l-2.71.044c-.419 2.852.766 4.515 3.915 4.515 2.758 0 4.195-1.236 4.195-3.706-.003-2.247-1.16-3.147-3.664-4.944zm8.48-5.436h-3.059v13.77h3.06V7.755zm-1.507-5.438c-1.18 0-1.738.427-1.738 1.911 0 1.528.554 1.909 1.739 1.909 1.205 0 1.738-.383 1.738-1.909 0-1.414-.533-1.911-1.739-1.911zM79.158 16.56l-2.803-.135c0 2.426-.277 3.212-1.226 3.212-.95 0-1.113-.877-1.113-3.73v-2.67c0-2.765.187-3.639 1.137-3.639.88 0 1.112.83 1.112 3.393l2.778-.178c.187-2.134-.093-3.595-.949-4.425-.627-.608-1.576-.897-2.896-.897-3.104 0-4.379 1.618-4.379 6.154v1.932c0 4.673 1.088 6.178 4.264 6.178 1.344 0 2.27-.27 2.896-.854.902-.814 1.249-2.205 1.18-4.341z"
            ></path>
          </svg>
        </div>
      </a>
      <div className="flex flex-col px-4 py-6 -mt-5 w-full relative">
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
    </div>
  );
}

export default Song;

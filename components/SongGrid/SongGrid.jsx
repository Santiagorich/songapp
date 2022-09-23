import React from "react";
import Song from "./Song/Song";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

function SongGrid({ songs }) {
  var songChunks = [];
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState(null);
  const playSong = (song) => {
    if (currentlyPlaying) {
      currentlyPlaying.pause();
    }
    setCurrentlyPlaying(song);
    song.currentTime = 0;
    song.play();
  };
  const pauseSong = (song) => {
    if (!song.paused) {
      song.pause();
    }
    setCurrentlyPlaying(null);
  };
  for (let i = 0; i < songs.length; i += 8) {
    songChunks.push(songs.slice(i, i + 8));
  }
  console.log(songChunks);
  return (
    <div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        keyboard={{
          enabled: true,
        }}
        navigation={true}
        modules={[Keyboard, Navigation]}
      >
        {songChunks.map((chunk, chunkindex) => {
          return (
            <SwiperSlide key={chunkindex}>
              <div className=" flex flex-wrap w-full gap-4 justify-center p-4 ">
                {chunk.map((song, index) => (
                  <Song
                    key={index}
                    song={song}
                    playSong={playSong}
                    pauseSong={pauseSong}
                    currentlyPlaying={currentlyPlaying}
                  ></Song>
                ))}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default SongGrid;

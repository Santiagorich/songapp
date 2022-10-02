import React from "react";
import Song from "../Song/Song";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Lazy, Virtual, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/lazy";
import { useSelector } from "react-redux";

function SongSwiper({songs,currentlyPlaying,playSong,pauseSong }) {
  const mobile = useSelector((state) => state.userSlice.isMobile);
  var songChunks = [];
  SwiperCore.use([Lazy, Virtual, Navigation, Pagination]);
  let steps = (mobile ? 1 : 8);
  for (let i = 0; i < songs.length; i += steps) {
    songChunks.push(songs.slice(i, i + steps));
  }
  return (
    <div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        keyboard={{
          enabled: true,
        }}
        navigation={(mobile ? false : true)}
        lazy={true}
        virtual
        followFinger={true}
        allowTouchMove={true}
        preloadImages={true}
      >
        {songChunks.map((chunk, chunkindex) => {
          return (
            <SwiperSlide key={chunkindex} virtualIndex={chunkindex}>
              <div className=" flex flex-wrap w-full gap-4 justify-center p-4 ">
                {chunk.map((song, index) => (
                  <Song
                    mobile={mobile}
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

export default SongSwiper;

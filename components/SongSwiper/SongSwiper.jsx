import React, { useEffect } from "react";
import Song from "../Song/Song";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Lazy,
  Virtual,
  Navigation,
  Pagination,
  Keyboard,
  Mousewheel,
} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/lazy";
import "swiper/css/keyboard";
import "swiper/css/virtual";
import { useSelector } from "react-redux";

function SongSwiper({ songs, currentlyPlaying, playSong, pauseSong }) {
  const [swiper, setSwiper] = React.useState(null);
  const mobile = useSelector((state) => state.userSlice.isMobile);
  var songChunks = [];
  SwiperCore.use([Lazy, Virtual, Navigation, Pagination, Keyboard, Mousewheel]);
  let steps = mobile ? 1 : 8;
  for (let i = 0; i < songs.length; i += steps) {
    songChunks.push(songs.slice(i, i + steps));
  }
  useEffect(() => {
    console.log(swiper,currentlyPlaying);
    if (mobile && swiper && currentlyPlaying) {
      swiper.slideTo(currentlyPlaying.number-1);
      console.log("slide to", currentlyPlaying.number-1);
    }
  }, [currentlyPlaying]);

  return (
    <div>
      <Swiper
        onSwiper={(swiper) => setSwiper(swiper)}
        slidesPerView={1}
        spaceBetween={30}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        navigation={mobile ? false : true}
        lazy={true}
        virtual
        followFinger={true}
        allowTouchMove={true}
        preloadImages={true}
      >
        {songChunks.map((chunk, chunkindex) => {
          return (
            <SwiperSlide
              key={chunkindex}
              virtualIndex={chunkindex}
              className="flex justify-center"
            >
              <div
                className={`${
                  mobile ? `flex` : `grid-cols-4 grid`
                } w-fit gap-8 justify-center p-4 `}
              >
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

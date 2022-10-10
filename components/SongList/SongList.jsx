import React from "react";
import SwiperCore, { Lazy, Virtual, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/lazy";
import "swiper/css/virtual";
import { useSelector } from "react-redux";
import SongListItem from './SongListItem/SongListItem';

function SongList({ songs, currentlyPlaying, playSong, pauseSong }) {
  const mobile = useSelector((state) => state.userSlice.isMobile);
  SwiperCore.use([Lazy, Virtual, Navigation, Pagination]);
  return (
    <div className=" h-48 overflow-y-auto overflow-x-hidden px-2">
      {songs.map((song, index) => (
        <SongListItem
          mobile={mobile}
          key={index}
          song={song}
          playSong={playSong}
          pauseSong={pauseSong}
          currentlyPlaying={currentlyPlaying}
        ></SongListItem>
      ))}
    </div>
  );
}

export default SongList;

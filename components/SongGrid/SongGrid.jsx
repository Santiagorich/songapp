import React from "react";
import Song from "./Song/Song";

function SongGrid({ songs }) {
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
  return (
    <div>
      <div className=" flex flex-wrap w-full gap-4 justify-center">
        {songs.map((song, index) => (
          <Song key={index} song={song} playSong={playSong} pauseSong={pauseSong} currentlyPlaying={currentlyPlaying}></Song>
        ))}
      </div>
    </div>
  );
}

export default SongGrid;

import React from "react";
import Song from "./Song/Song";


function SongGrid({ songs }) {

  return (
    <div>
      <h1>Song Grid</h1>
      <div className=" flex flex-wrap w-fulln">
        {songs.map((song) => (
            <Song song={song}></Song>
        ))} 
      </div>
    </div>
  );
}

export default SongGrid;

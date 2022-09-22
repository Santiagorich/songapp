import React from "react";


function SongGrid({ songs }) {

  return (
    <div>
      <h1>Song Grid</h1>
      <div>
        <button onClick={()=> console.log(songs)}>Click</button>
        {songs.map((song) => (
          <div key={song.number}>
            <h2>{song.title}</h2>
            <h3>{song.artist}</h3>
            <img src={song.image} alt={song.title}></img>
            <audio controls>
              <source src={song.song} type="audio/mpeg"></source>
            </audio>
          </div>
        ))} 
      </div>
    </div>
  );
}

export default SongGrid;

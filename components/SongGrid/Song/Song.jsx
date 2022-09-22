import React from "react";

function Song({ song }) {
  return (
    //set div background to song image
    <div
      style={{
        backgroundImage: `url(${song.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "300px",
        height: "300px",
      }}
    >
      <h1>{song.number}</h1>
      <h2>{song.title}</h2>
      <h3>{song.artist}</h3>
      <audio controls>
        <source src={song.song} type="audio/mpeg"></source>
      </audio>
    </div>
  );
}

export default Song;

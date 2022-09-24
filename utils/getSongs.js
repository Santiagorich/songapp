const fetch = require("node-fetch");
const jsdom = require("jsdom");
import { categories } from "../constants/categories";

export const getSongs = async (query) => {
  var url = "";
  categories.forEach((category) => {
    if (category.category === query) {
      url = category.link;
    }
  });
  const songs = await fetch(`https://www.popvortex.com/music/charts/${url}`)
    .then((res) => res.text())
    .then((body) => {
      const parser = new jsdom.JSDOM(body);
      const document = parser.window.document;
      const songs = document.querySelectorAll(".feed-item");
      const songList = [];
      songs.forEach((song) => {
        let genre = "";
        let release = "";
        let songEl = song.querySelector("audio > source");
        song.querySelectorAll(".chart-content > ul > li").forEach((li) => {
          if (li.textContent.includes("Genre")) {
            genre = li.textContent.replace("Genre: ", "");
          }
          if (li.textContent.includes("Release Date")) {
            release = li.textContent.replace("Release Date: ", "");
          }
        });
        songList.push({
          song: songEl
            ? song.querySelector("audio > source").getAttribute("src")
            : "",
          title: song.querySelector(".chart-content > .title-artist > .title")
            .textContent,
          artist: song.querySelector(".chart-content > .title-artist > .artist")
            .textContent,
          image: song
            .querySelector(".cover-art > img[class='cover-image']")
            .getAttribute("data-pin-media"),
          thumbnail: song.querySelector(".cover-art > img[class='cover-image']")
            .src,
          genre: genre,
          release: release,
          number: song.querySelector(".cover-art > .chart-position")
            .textContent,
        });
      });
      return songList;
    });
  return songs;
}

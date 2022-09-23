const fetch = require("node-fetch");
const jsdom = require("jsdom");

export default async function getSongs(query) {
  const categories = [
    { category: "top-100", link: "top-100-songs.php" },
    { category: "alternative", link: "top-alternative-songs.php" },
    { category: "bluegrass", link: "top-bluegrass-songs.php" },
    { category: "blues", link: "top-blues-songs.php" },
    { category: "christian", link: "top-christian-gospel-songs.php" },
    { category: "country", link: "top-country-songs.php" },
    { category: "dance", link: "top-dance-songs.php" },
    { category: "electronic", link: "top-electronic-songs.php" },
    { category: "heavy-metal", link: "top-heavy-metal-songs.php" },
    { category: "indie-rock", link: "top-indie-songs.php" },
    { category: "jazz", link: "top-jazz-songs.php" },
    { category: "k-pop", link: "top-kpop-songs.php" },
    { category: "kids", link: "top-kids-songs.php" },
    { category: "latin", link: "top-latin-songs.php" },
    { category: "pop", link: "top-pop-songs.php" },
    { category: "soul", link: "top-soul-songs.php" },
    { category: "rap", link: "top-rap-songs.php" },
    { category: "reggae", link: "top-reggae-songs.php" },
    { category: "reggaeton", link: "top-reggaeton-songs.php" },
    { category: "rock", link: "top-rock-songs.php" },
    { category: "soundtrack", link: "top-soundtrack-songs.php" },
  ];
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

import Head from "next/head";
import Header from "../components/Header";
import SongSwiper from "../components/SongSwiper/SongSwiper";
import { getSongs } from "../utils/getSongs";
import { categories } from "../constants/categories";
import React, { useEffect } from "react";


export async function getStaticProps() {

  const preload = {
    name: "Top 100",
    category: "top-100",
    songs: await getSongs("top-100"),
  };
  return {
    props: {
      preload,
    },
    revalidate: 120,
  };
}

export default function Home({ preload }) {
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState(null);
  const [currentCategory, setCurrentCategory] = React.useState(preload);
  const playSong = (song) => {
    const audio = new Audio(song);
    audio.play();
    setCurrentlyPlaying({
      src: song,
      audio: audio,
    });
  };
  const pauseSong = () => {
    if (currentlyPlaying) {
      currentlyPlaying.audio.pause();
      setCurrentlyPlaying(null);
    }
  };
  const changeCategory = async (categoryName) => {
    pauseSong();
    const songs = await fetchSongs(categoryName);
    setCurrentCategory({
      name: categories.find((c) => c.category === categoryName).name,
      category: categoryName,
      songs: songs,
    });
  };
  const fetchSongs = async (category) => {
    const res = await fetch(`/api/songs?query=${category}`);
    const data = await res.json();
    if (data.error) {
      return [];
    }
    return data;
  };
  useEffect(() => {
    categories.map((category) => {
      fetchSongs(category.category);
    });
  }, []);
  return (
    <div>
      <Head>
        <title>Top 100 Songs</title>
        <meta
          name="description"
          content="See what songs are popular right now!"
        />
      </Head>
      <Header></Header>

      <div className="flex flex-col gap-4 mt-4 mx-4 pb-8">
        <div className="flex flex-row gap-6 p-4 overflow-hidden">
          {categories.map((category, index) => (
            <span
              key={index}
              className={`${(currentCategory.category==category.category)?`font-bold text-white`:`text-gray-500`} text-2xl flex-shrink-0 cursor-pointer`}
              onClick={() => {
                changeCategory(category.category);
              }}
            >
              {category.name}
            </span>
          ))}
        </div>

        <div>
          <span className="text-white font-bold text-4xl ml-10 p-4">
            {currentCategory.name}
          </span>
          <SongSwiper
            playSong={playSong}
            pauseSong={pauseSong}
            currentlyPlaying={currentlyPlaying}
            songs={currentCategory.songs}
          ></SongSwiper>
        </div>
      </div>
    </div>
  );
}

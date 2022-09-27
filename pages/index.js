import Head from "next/head";
import Header from "../components/Header";
import SongSwiper from "../components/SongSwiper/SongSwiper";
import { getSongs } from "../utils/getSongs";
import { categories } from "../constants/categories";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

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
  const [volume, setVolume] = React.useState(1);
  const playSong = (song) => {
    const audio = new Audio(song);
    audio.play();
    audio.volume = volume;
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
        <div className="flex flex-row px-6 py-2 overflow-hidden whitespace-nowrap relative fader select-none">
          <Swiper
            slidesPerView={1}
            spaceBetween={0}
            keyboard={{
              enabled: true,
            }}
            followFinger={true}
            allowTouchMove={true}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <span
                  key={index}
                  className={`${
                    currentCategory.category == category.category
                      ? `font-bold text-white`
                      : `text-gray-500`
                  } text-2xl cursor-pointer`}
                  onClick={() => {
                    changeCategory(category.category);
                  }}
                >
                  {category.name}
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div>
          <div className="flex flex-row mx-12">
            <span className="text-white font-bold text-4xl p-4">
              {currentCategory.name}
            </span>
            <div className="flex flex-row items-center ml-auto text-white gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
                />
              </svg>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                defaultValue={volume}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                onChange={(e) => {
                  setVolume(e.target.value);
                  if (currentlyPlaying) {
                    currentlyPlaying.audio.volume = e.target.value;
                  }
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                />
              </svg>
            </div>
          </div>
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

import Head from "next/head";
import Header from "../components/Header";
import SongSwiper from "../components/SongSwiper/SongSwiper";
import getSongs from "../utils/getSongs";
import { categories } from "../constants/categories";
export async function getStaticProps() {
  const allSongs = [];
  await Promise.all(
    categories.map(async (category) => {
      const songs = await getSongs(category.category);
      allSongs.push({
        name: category.name,
        category: category.category,
        songs: songs,
      });
    })
  ).then(() => {
    console.log(allSongs);
  });
  return {
    props: {
      songs,
    },
    revalidate: 120,
  };
}

export default function Home({ songs }) {
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
      <div className="flex flex-col gap-4 mt-4 pb-8">
        <span className="text-white font-bold text-4xl ml-10 p-4">Top 100</span>

        <div>
          <SongSwiper songs={songs}></SongSwiper>
        </div>
      </div>
    </div>
  );
}

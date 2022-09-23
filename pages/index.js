import Head from "next/head";
import Header from "../components/Header";
import SongGrid from "../components/SongGrid/SongGrid";
import getSongs from "../utils/getSongs";

export async function getStaticProps() {
  const songs = await getSongs("top-100");
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
        <meta name="description" content="See what songs are popular right now!" />
      </Head>
      <Header></Header>
      <div className="mx-12 my-8">
        <span className="text-white font-bold text-4xl ml-10 p-4">Top 100</span>

        <div className="p-4 mt-4">
          <SongGrid songs={songs}></SongGrid>
        </div>
      </div>
    </div>
  );
}

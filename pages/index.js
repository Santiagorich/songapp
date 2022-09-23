import Header from "../components/Header";
import SongGrid from "../components/SongGrid/SongGrid";
import getSongs from "../utils/getSongs";

export async function getStaticProps() {
  const songs = await getSongs("top-100");
  return {
    props: {
      songs,
    },
  };
}

export default function Home({ songs }) {
  return (
    <div>
      <Header></Header>
      <div className="mx-12 my-4">
        <span className="text-white font-bold text-4xl p-4">Top 100</span>

        <div className="p-4 mt-4">
          <SongGrid songs={songs}></SongGrid>
        </div>
      </div>
    </div>
  );
}

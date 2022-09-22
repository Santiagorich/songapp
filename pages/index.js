import Header from "../components/Header";
import SongGrid from "../components/SongGrid/SongGrid";
import getSongs from "../utils/getSongs";



export async function getStaticProps() {
  const songs = await getSongs('top-100')
  return {
    props: {
      songs,
    },
  };
}

export default function Home({songs}) {
  return (
    <div>
      <Header></Header>
      <SongGrid songs={songs}></SongGrid>
    </div>
  )
}

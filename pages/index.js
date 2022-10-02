import Head from "next/head";
import Header from "../components/Header";
import SongSwiper from "../components/SongSwiper/SongSwiper";
import { getSongs } from "../utils/getSongs";
import { categories } from "../constants/categories";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Chat from "../components/Chat/Chat";
import { auth } from "../utils/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { setUser, setMobile } from "../components/Stores/Slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { rtdb } from "./../utils/firebase";
import { set, ref, remove } from "firebase/database";
import VolumeInput from "../components/VolumeInput/VolumeInput";
//Options for caching:
//Save to S3 After processing (I don't want to pay a penny)
//Figure out a way to save it on vercel's cache (Should do it automatically)
//UploadCare and drop the api
//All 3 have cdns
export async function getStaticProps() {
  // categories.map(async (category) => {
  //   let coverArr = [];
  //   let thumbnailArr = [];
  //   let songRes = await fetchSongs(category.category);
  //   await Promise.all(
  //     songRes.map((song) => {
  //       return fetch(`/api/imageFetcher?url=${song.thumbnail}&type=thumbnail`);
  //     })
  //   ).then((res) => {
  //     res.map((r) => {
  //       thumbnailArr.push(r);
  //     });
  //   });
  //   await Promise.all(
  //     songRes.map((song) => {
  //       return fetch(`/api/imageFetcher?url=${song.image}&type=cover`);
  //     })
  //   ).then((res) => {
  //     res.map((r) => {
  //       coverArr.push(r);
  //     });
  //   });
  // });
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

export default function Home({ preload, props }) {
  const dispatch = useDispatch();
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  const logout = () => {
    auth.signOut();
  };
  var currentUser = null;
  const user = useSelector((state) => state.userSlice.user);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(preload);
  const [volume, setVolume] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
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

  const checkMobile = () => {
    const width = window.innerWidth;
    return width <= 600;
  };


  useEffect(() => {
    setIsMobile(checkMobile());
    dispatch(setMobile(checkMobile()));
    if (window) {
      window.addEventListener("resize", () => {
        setIsMobile(checkMobile());
        dispatch(setMobile(checkMobile()));
      });
    }
    categories.map(async (category) => {
      fetchSongs(category.category);
    });
    console.log("Mounted");
    // categories.map(async (category) => {
    //   let songRes = await fetchSongs(category.category);
    //   await Promise.all(
    //     songRes.map((song) => {
    //       return fetch(
    //         `/api/imageFetcher?url=${song.thumbnail}&type=thumbnail`
    //       );
    //     })
    //   );
    // });
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = user.uid;
        set(ref(rtdb, "online/" + user.uid), {
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          photoUrl: user.photoURL,
        });
        dispatch(
          setUser({
            email: user.email,
            uid: user.uid,
            displayName: user.displayName,
            photoUrl: user.photoURL,
          })
        );
      } else {
        remove(ref(rtdb, "online/" + currentUser));
        dispatch(setUser(null));
      }
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
      <Header signInWithGoogle={signInWithGoogle} logout={logout}></Header>

      <div className="flex flex-col gap-4 mt-4 mx-4 pb-8">
        <div className="flex flex-row py-2 overflow-hidden whitespace-nowrap relative fader select-none">
          <Swiper
            slidesPerView={isMobile ? 1 : 4}
            spaceBetween={0}
            keyboard={{
              enabled: true,
            }}
            navigation={true}
            followFinger={true}
            allowTouchMove={true}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index} className="flex justify-center">
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

        <div className="flex flex-col gap-6">
          <div
            className={`flex flex-row mx-12 ${
              isMobile ? `justify-center` : `justify-between`
            }`}
          >
            <span className="text-white font-bold text-4xl p-4">
              {currentCategory.name}
            </span>

            {!isMobile && (
              <VolumeInput
                setVolume={setVolume}
                volume={volume}
                currentlyPlaying={currentlyPlaying}
              ></VolumeInput>
            )}
          </div>
          <SongSwiper
            mobile={isMobile}
            playSong={playSong}
            pauseSong={pauseSong}
            currentlyPlaying={currentlyPlaying}
            songs={currentCategory.songs}
          ></SongSwiper>

          {isMobile && (
            <div className="flex justify-center">
              <VolumeInput
                setVolume={setVolume}
                volume={volume}
                currentlyPlaying={currentlyPlaying}
              ></VolumeInput>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4 mx-4 pb-8">
        {user !== null ? (
          <Chat></Chat>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={signInWithGoogle}
              className="bg-white rounded-lg px-4 py-2"
            >
              Sign in to chat
            </button>
          </div>
        )}
        ;
      </div>
    </div>
  );
}

import Head from "next/head";
import Header from "../components/Header";
import SongSwiper from "../components/SongSwiper/SongSwiper";
import { getSongs } from "../utils/getSongs";
import { categories } from "../constants/categories";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import Chat from "../components/Chat/Chat";
// import { auth,rtdb } from "../utils/firebase";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
// } from "firebase/auth";
import {
  // setUser,
  setMobile,
  setChecked,
} from "../components/Stores/Slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { set, ref, remove } from "firebase/database";
import VolumeInput from "../components/VolumeInput/VolumeInput";
import { useBeforeunload } from "react-beforeunload";
import SongList from "../components/SongList/SongList";
// import Image from "next/image";
// import { paths } from "../constants/paths";
// import HackathonPromotion from "../components/HackathonPromotion";

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
    // const provider = new GoogleAuthProvider();
    // signInWithPopup(auth, provider);
  };
  const logout = () => {
    // auth.signOut();
    // goOffline(user);
  };
  const user = useSelector((state) => state.userSlice.user);
  const checked = useSelector((state) => state.userSlice.checked);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(preload);
  const [volume, setVolume] = useState(1);
  const isMobile = useSelector((state) => state.userSlice.isMobile);
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
    return width <= 1024;
  };
  const goOffline = (user) => {
    if (user) {
      remove(ref(rtdb, "online/" + user.uid));
    }
  };
  useBeforeunload(() => {
    goOffline(user);
  });

  useEffect(() => {
    if (!checked) {
      dispatch(setMobile(checkMobile()));
      dispatch(setChecked(true));
    }
    if (window) {
      window.addEventListener("resize", () => {
        dispatch(setMobile(checkMobile()));
      });
    }
    categories.map(async (category) => {
      fetchSongs(category.category);
    });
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

    //  onAuthStateChanged(auth, (logInUser) => {
    //   console.log("Login event", logInUser);
    //   if (logInUser && !user) {
    //     const logUser = {
    //       email: logInUser.email.toString(),
    //       uid: logInUser.uid.toString(),
    //       displayName: logInUser.displayName.toString(),
    //       photoUrl: logInUser.photoURL.toString(),
    //     };
    //     console.log("User logging in", logUser);
    //     set(ref(rtdb, "online/" + logUser.uid), logUser);
    //     console.log("User logged in", logUser);
    //     dispatch(setUser(logUser));
    //   } else {
    //     console.log("User logging out");
    //     goOffline(user);
    //     console.log("User logged out");
    //     dispatch(setUser(null));
    //   }
    // });
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

      <div className={`flex flex-col gap-4 mx-4 ${isMobile?`h-fit`:`h-screen mb-10`} mt-4`}>
        <div
          className={`flex flex-row flex-shrink-0 py-2 overflow-hidden whitespace-nowrap relative ${
            isMobile ? `` : `fader`
          } select-none`}
        >
          <Swiper
            slidesPerView={isMobile ? 1 : 4}
            spaceBetween={0}
            navigation={true}
            followFinger={true}
            allowTouchMove={true}
            loop={true}
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
          {!isMobile && <div
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
          </div>}
          <SongSwiper
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
          {isMobile && (
            <SongList
              playSong={playSong}
              pauseSong={pauseSong}
              currentlyPlaying={currentlyPlaying}
              songs={currentCategory.songs}
            ></SongList>
          )}
        </div>
      </div>

      {/* <div className="h-screen w-full ">
        <div className="flex flex-col gap-4 px-4 w-full h-3/4">
          <Chat signInWithGoogle={signInWithGoogle}></Chat>
        </div>
      </div> */}

      {/* <HackathonPromotion></HackathonPromotion> */}
    </div>
  );
}

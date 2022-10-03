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
import {
  setUser,
  setMobile,
  setChecked,
} from "../components/Stores/Slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { rtdb } from "./../utils/firebase";
import { set, ref, remove } from "firebase/database";
import VolumeInput from "../components/VolumeInput/VolumeInput";
import { useBeforeunload } from "react-beforeunload";
import Image from "next/image";
import { paths } from "../constants/paths";

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
    onAuthStateChanged(auth, (logInUser) => {
      if (logInUser) {
        let email = logInUser.email;
        let name = logInUser.displayName;
        let photo = logInUser.photoURL;
        let uid = logInUser.uid;
        // set(ref(rtdb, "online/" + uid), {
        //   email: email,
        //   uid: uid,
        //   displayName: name,
        //   photoUrl: photo,
        // });
        ref(rtdb, "online/" + uid)
        dispatch(
          setUser({
            email: email,
            uid: uid,
            displayName: name,
            photoUrl: photo,
          })
        );
      } else {
        if (user) {
          remove(ref(rtdb, "online/" + user.uid));
          dispatch(setUser(null));
        }
      }
    });
    return () => {
      goOffline(user);
    };
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

      <div className="flex flex-col gap-4 mx-4 h-screen mb-10">
        <div className="flex flex-row flex-shrink-0 py-2 overflow-hidden whitespace-nowrap relative fader select-none">
          <Swiper
            slidesPerView={isMobile ? 1 : 4}
            spaceBetween={0}
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

      <div className="h-screen w-full ">
        <div className="flex flex-col gap-4 px-4 w-full h-3/4">
          <Chat signInWithGoogle={signInWithGoogle}></Chat>
        </div>
      </div>

      <div className="flex flex-row align-middle h-screen">
        <div
          className={`${isMobile ? `flex-col gap-8` : `flex-row`} flex py-4`}
        >
          <div className="flex flex-col w-full h-screen gap-8 items-center px-8 rounded-lg ">
            <span className="text-white font-bold text-4xl py-4 border-b-2">
              ¿Qué es OpenBootcamp?
            </span>
            <span className="text-gray-color-lighter text-xl">
              Un programa pionero en el que recibirás toda la formación que
              necesites hasta que encuentres un mejor empleo. Nuestras empresas
              asumen el coste de tu formación una vez te contraten. Puedes
              formarte durante 12 meses en remoto a tu ritmo.
            </span>
            {/* https://campus.open-bootcamp.com/register */}
            {!isMobile && (
              <div className="flex flex-col w-full h-2/3 gap-4 px-4">
                <span className="text-gray-color-lighter font-bold text-lg">
                  Elije una ruta:
                </span>
                <div className="flex flex-col w-full h-full gap-4 pr-2 overflow-auto  ">
                  {paths.map((path, index) => (
                    <a
                      key={index}
                      target="_blank"
                      rel="noreferrer"
                      href="https://campus.open-bootcamp.com/register"
                      aria-label="Open Bootcamp"
                    >
                      <div className="flex flex-row gap-4 p-6 bg-gray-color-light rounded-lg w-full h-fit items-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                          <Image
                            src={path.src} //Not using loaders as i know the size i want
                            objectFit="contain"
                            layout="fill"
                            alt={path.title}
                          ></Image>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-color-lighter font-bold text-lg">
                            {path.title}
                          </span>
                          <span className="text-gray-color-lighter text-md">
                            {path.desc}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div
            className={`flex flex-col w-full gap-8 items-center justify-center ${
              !isMobile && `border-l-2`
            }`}
          >
            <a
              target="_blank"
              rel="noreferrer"
              href="https://open-bootcamp.com/"
              aria-label="Open Bootcamp"
            >
              <div
                className={`${
                  isMobile ? `h-80 w-80` : `h-96 w-96`
                } overflow-hidden rounded-full animate-pulse`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
                  <path
                    fill="#161153"
                    d="M0 0h900v900H0V0m357.83 129.47c-6.45 1.22-13.1.89-19.49 2.51-18.65 4.01-37.39 8.97-54.28 18.03-41.69 20.3-76.57 54.65-96.67 96.51-9.08 17.06-14.16 35.87-18.23 54.66-.79 7.63-2.94 15.12-2.61 22.85.15 6.34-1.72 12.62-.75 18.97 1.37 8.23-.02 16.68 2.07 24.83 2.67 23.25 10.5 45.6 20.56 66.63 3.9 6.88 7.83 13.74 11.41 20.79 7.79 12.17 17.13 23.36 27.52 33.4 9.82 10.28 21.03 19.17 32.81 27.11 7.96 4.1 15.72 8.61 23.87 12.36 8.59 4.99 18.17 7.8 27.34 11.53 10.23 2.99 20.57 5.81 31.16 7.21 11.73 2.09 23.69 3.25 35.6 2.35l-.04 1.02c-.38.17-1.13.49-1.5.65 1.04 4.63.95 9.4.86 14.12-.07 61.28.07 122.56-.07 183.84 4.78 1.22 9.73.74 14.61.77 69-.01 138 0 207 0 6.85-.06 13.8.55 20.53-1.14 11.69-1.96 23.34-5.16 33.58-11.29 7.52-3.39 13.7-8.92 20.19-13.88 8.25-7.46 16.12-15.54 21.83-25.16 4.1-7 8.65-13.87 11.16-21.65 2.81-8.57 5.3-17.35 5.7-26.41 1.53-10.05.09-20.18-1.09-30.18-2.68-13.5-7.09-27.1-15.62-38.11-3.02-4.37-5.03-9.44-8.72-13.34-6.62-7.04-13.34-14.21-21.69-19.22-2.55-1.63-5.65-2.83-6.95-5.77 3.12-2.07 6.3-4.04 9.4-6.15 6.28-4.27 11.23-10.09 16.6-15.39 6.62-6.62 11.26-14.79 16.39-22.53 1.9-2.97 3.22-6.27 4.41-9.57 6.66-17.35 9.47-36.37 6.98-54.84-.81-11.01-5.12-21.32-9.31-31.4-5.52-12.58-14.05-23.58-23.9-33.06-6.33-6.06-12.96-11.88-20.46-16.44-5.55-3.33-11.78-5.21-17.78-7.5-16.66-6.47-34.97-8.32-52.67-6.35-.02-.29-.04-.86-.06-1.14-1.32-15.6-2.29-31.29-5.95-46.56-8.07-35.58-25.51-69.03-50.19-95.92-7.66-7.97-15.76-15.51-23.97-22.9-9.32-6.08-18.32-12.66-28.01-18.14-12.21-6.2-24.48-12.43-37.57-16.59-12.43-3.61-24.98-7.01-37.86-8.43-7.04-.25-13.91-2.22-20.98-2.01-8.39.22-16.85-.57-25.16.93z"
                    opacity="1"
                  ></path>
                  <path
                    fill="#0af083"
                    d="M357.83 129.47c8.31-1.5 16.77-.71 25.16-.93 7.07-.21 13.94 1.76 20.98 2.01 12.88 1.42 25.43 4.82 37.86 8.43 13.09 4.16 25.36 10.39 37.57 16.59 9.69 5.48 18.69 12.06 28.01 18.14 8.21 7.39 16.31 14.93 23.97 22.9 24.68 26.89 42.12 60.34 50.19 95.92 3.66 15.27 4.63 30.96 5.95 46.56-6.48.75-13.01.65-19.52.57-57.33-.01-114.67 0-172-.01-5.21.1-10.52-.59-15.65.54-.26.31-.79.91-1.05 1.21-1.2 4.76-.54 9.74-.63 14.6.03 51.67 0 103.33.01 155-.07 12.74.32 25.48-.54 38.21-11.91.9-23.87-.26-35.6-2.35-10.59-1.4-20.93-4.22-31.16-7.21-9.17-3.73-18.75-6.54-27.34-11.53-8.15-3.75-15.91-8.26-23.87-12.36-11.78-7.94-22.99-16.83-32.81-27.11-10.39-10.04-19.73-21.23-27.52-33.4-3.58-7.05-7.51-13.91-11.41-20.79-10.06-21.03-17.89-43.38-20.56-66.63-2.09-8.15-.7-16.6-2.07-24.83-.97-6.35.9-12.63.75-18.97-.33-7.73 1.82-15.22 2.61-22.85 4.07-18.79 9.15-37.6 18.23-54.66 20.1-41.86 54.98-76.21 96.67-96.51 16.89-9.06 35.63-14.02 54.28-18.03 6.39-1.62 13.04-1.29 19.49-2.51z"
                    opacity="1"
                  ></path>
                  <path
                    fill="#0ec0cc"
                    d="M568 339.66c6.51.08 13.04.18 19.52-.57.02.28.04.85.06 1.14-.42 35.78-9.52 71.73-27.68 102.69-8.82 16.15-20.45 30.59-33.11 43.86-22.49 22.3-49.94 39.57-79.8 50.09-14.92 5.01-30.35 8.58-46 10.31-7.62.99-15.69-.07-22.89 3.05l.04-1.02c.86-12.73.47-25.47.54-38.21-.01-51.67.02-103.33-.01-155 .09-4.86-.57-9.84.63-14.6.26-.3.79-.9 1.05-1.21 5.13-1.13 10.44-.44 15.65-.54 57.33.01 114.67 0 172 .01z"
                    opacity="1"
                  ></path>
                  <path
                    fill="#047bf3"
                    d="M587.58 340.23c17.7-1.97 36.01-.12 52.67 6.35 6 2.29 12.23 4.17 17.78 7.5 7.5 4.56 14.13 10.38 20.46 16.44 9.85 9.48 18.38 20.48 23.9 33.06 4.19 10.08 8.5 20.39 9.31 31.4 2.49 18.47-.32 37.49-6.98 54.84-1.19 3.3-2.51 6.6-4.41 9.57-5.13 7.74-9.77 15.91-16.39 22.53-5.37 5.3-10.32 11.12-16.6 15.39-3.1 2.11-6.28 4.08-9.4 6.15 1.3 2.94 4.4 4.14 6.95 5.77 8.35 5.01 15.07 12.18 21.69 19.22 3.69 3.9 5.7 8.97 8.72 13.34 8.53 11.01 12.94 24.61 15.62 38.11 1.18 10 2.62 20.13 1.09 30.18-.4 9.06-2.89 17.84-5.7 26.41-2.51 7.78-7.06 14.65-11.16 21.65-5.71 9.62-13.58 17.7-21.83 25.16-6.49 4.96-12.67 10.49-20.19 13.88-10.24 6.13-21.89 9.33-33.58 11.29-6.73 1.69-13.68 1.08-20.53 1.14-69 0-138-.01-207 0-4.88-.03-9.83.45-14.61-.77.14-61.28 0-122.56.07-183.84.09-4.72.18-9.49-.86-14.12.37-.16 1.12-.48 1.5-.65 7.2-3.12 15.27-2.06 22.89-3.05 15.65-1.73 31.08-5.3 46-10.31 29.86-10.52 57.31-27.79 79.8-50.09 12.66-13.27 24.29-27.71 33.11-43.86 18.16-30.96 27.26-66.91 27.68-102.69z"
                    opacity="1"
                  ></path>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

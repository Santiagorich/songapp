import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyBDHcDxbe1oFJQzIVfOcYN4Mjs7OlwNaFk",
  authDomain: "acvhelper-93c1a.firebaseapp.com",
  databaseURL: "https://acvhelper-93c1a-default-rtdb.firebaseio.com",
  projectId: "acvhelper-93c1a",
  storageBucket: "acvhelper-93c1a.appspot.com",
  messagingSenderId: "651177855214",
  appId: "1:651177855214:web:fae2ebecb683cac3900bff",
  measurementId: "G-VWZCWWF1YC"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const db = getFirestore(app);
 const rtdb = getDatabase(app);

function OnlineList() {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
      const unsubscribeOnline = onValue(ref(rtdb, "online"), (snapshot) => {
        console.log("Received online user data: ", snapshot.val());
        const data = snapshot.val();
        if (data) {
          const users = [];
          Object.values(data).forEach((user) => {
            users.push(user);
          });
          console.log(users);
          setOnlineUsers(users);
        } else {
          setOnlineUsers([]);
        }
      });
      return () => {
          unsubscribeOnline();
      }
    }, [])
  return (
<div
          className={`w-60 flex-shrink-0 bg-gray-color border-r-2 border-white flex flex-col items-center`}
        >
          <div className="py-4 border-b-2 border-white">
            <span className="text-white font-bold ">Online Users</span>
          </div>
          <div className="flex flex-col gap-4 p-4">
            {onlineUsers.map((user, index) => {
              return (
                <div key={index} className="flex flex-row items-center gap-4">
                  <img src={user.photoUrl} className="w-12 h-12 rounded-full" />
                  <div className="flex flex-col">
                    <span className="text-white font-bold overflow-ellipsis">
                      {user.displayName}
                    </span>
                    <div className="flex flex-row items-center gap-2">
                    <span className="text-gray-500 text-sm">Online</span>
                    <div className=" w-2 h-2 bg-green-400 rounded-full">

                    </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>  )
}

export default OnlineList
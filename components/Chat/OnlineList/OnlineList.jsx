import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { rtdb } from './../../../utils/firebase';

function OnlineList() {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
      const unsubscribeOnline = onValue(ref(rtdb, "online"), (snapshot) => {
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
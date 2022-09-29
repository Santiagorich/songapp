import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db, rtdb } from "../../utils/firebase";

function Chat() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    const unsubscribe = onValue(ref(rtdb,"online"), (snapshot) => {
      const data = snapshot.val();
      const users = [];
      Object.values(data).forEach((user) => {
        users.push(user);
      });
      console.log(users);
      setOnlineUsers(users);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-row bg-gray-color rounded-lg w-full h-96 overflow-hidden ">
      <div className="w-1/5 bg-gray-color border-r-2 border-white flex flex-col items-center">
        <div className="py-4 border-b-2 border-white"><span className="text-white font-bold ">Online Users</span></div>
        <div className="flex flex-col gap-4 p-4">
          {onlineUsers.map((user) => {
            return (<div className="flex flex-row items-center gap-4">
            <img
              src={user.photoUrl}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-white font-bold">{user.displayName}</span>
              <span className="text-gray-500 text-sm">Online</span>
            </div>
          </div>)
          })}
        </div>
      </div>
      <div className="w-full flex justify-center py-4">
        <h1 className="text-white font-bold text-2xl">Chat Global</h1>
        <div></div>
      </div>
    </div>
  );
}

export default Chat;

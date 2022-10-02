import { onValue, push, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { db, rtdb } from "../../utils/firebase";

function Chat() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useSelector((state) => state.user);
  const textAreaRef = useRef(null);
  const sendMessage = (message) => {
    const messageRef = ref(rtdb, "messages");
    push(messageRef, {
      message: message,
      sender: {
        displayName: user.displayName,
        photoUrl: user.photoURL,
      },
    });
  };
  useEffect(() => {
    const unsubscribe = onValue(ref(rtdb, "online"), (snapshot) => {
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
      <div className="w-fit flex-shrink-0 bg-gray-color border-r-2 border-white flex flex-col items-center">
        <div className="py-4 border-b-2 border-white">
          <span className="text-white font-bold ">Online Users</span>
        </div>
        <div className="flex flex-col gap-4 p-4">
          {onlineUsers.map((user, index) => {
            return (
              <div key={index} className="flex flex-row items-center gap-4">
                <img src={user.photoUrl} className="w-12 h-12 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-white font-bold">
                    {user.displayName}
                  </span>
                  <span className="text-gray-500 text-sm">Online</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex items-center p-4 flex-col">
        <span className="text-white font-bold text-2xl h-fit">Chat Global</span>
        <div className="h-full bg-gray-color"></div>
        <div class=" w-full flex justify-between items-center ">
          <textarea
          ref={textAreaRef}
            class="flex-grow m-2 py-2 px-4 mr-1 rounded-full border border-gray-300 bg-gray-color-light text-gray-color-lighter placeholder-gray-color-lighter resize-none outline-none h-fit"
            rows="1"
            placeholder="Message..."
          ></textarea>
          <button class="m-2 outline-none" onClick={
            () => {
            sendMessage(textAreaRef.current.value);
            }
          }>
            <svg
              class="svg-inline--fa text-red-700 fa-paper-plane fa-w-16 w-12 h-12 py-2 mr-2"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="paper-plane"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;

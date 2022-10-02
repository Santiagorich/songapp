import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function Message({ message }) {
  const user = useSelector((state) => state.userSlice.user);
  const lastMsg = useSelector((state) => state.userSlice.lastMsg);
  const messageRef = useRef(null);
  const isSender = message.sender.uid === user.uid;
  const getTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = `${hours}:${minutes}`;
    return time;
  };
  useEffect(() => {
    if (lastMsg == message.timestamp) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' });
    }
  }, []);
  return (
    <div
      ref={messageRef}
      className={`flex w-full ${isSender ? `justify-end` : `justify-start`}`}
    >
      {isSender ? (
        <div className="flex flex-row-reverse items-center gap-2">
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-2">
              <span className=" text-gray-color-lighter">
                {getTime(message.timestamp)}
              </span>
              <div
                className={`text-white py-2 px-4 ${
                  isSender ? `bg-red-700` : `bg-gray-color-light`
                } rounded-full min-w-40`}
              >
                {message.message}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2">
          <img
            src={message.sender.photoUrl}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-gray-color-lighter">
              {message.sender.displayName}
            </span>
            <div className="flex flex-row items-center gap-2">
              <div
                className={`text-white py-2 px-4 ${
                  isSender ? `bg-red-700` : `bg-gray-color-light`
                } rounded-full min-w-40`}
              >
                {message.message}
              </div>
              <span className=" text-gray-color-lighter">
                {getTime(message.timestamp)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;

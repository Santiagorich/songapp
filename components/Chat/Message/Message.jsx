import React from "react";
import { useSelector } from "react-redux";

function Message({ message }) {
  const user = useSelector((state) => state.userSlice.user);
  const isSender = message.sender.uid === user.uid;
  const getTime = (timestamp) => {
    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };
  return (
    <div
      className={`flex w-full ${
        isSender ? `justify-end` : `justify-start`
      }`}
    >
      <div className="flex flex-row items-center gap-2">
        <img src={message.sender.photoUrl} className="w-12 h-12 rounded-full" />
        <div className="flex flex-col">
          <span className="text-gray-color-lighter">
            {message.sender.displayName}
          </span>
          <div className="flex flex-row items-center gap-2">
            <div className={`text-white py-2 px-4 ${isSender?`bg-red-700`:`bg-gray-color-light`} rounded-full min-w-40`}>
              {message.message}
            </div>
            <span className=" text-gray-color-lighter">
              {getTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;

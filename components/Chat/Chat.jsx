import { onValue, push, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db, rtdb } from "../../utils/firebase";
import { setLastMsg } from "../Stores/Slices/userSlice";
import Message from "./Message/Message";
import OnlineList from "./OnlineList/OnlineList";

function Chat({ signInWithGoogle }) {
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const mobile = useSelector((state) => state.userSlice.isMobile);
  const [textAreaState, setTextAreaState] = useState({
    value: "",
    rows: 1,
    minRows: 1,
    maxRows: 3,
  });
  const user = useSelector((state) => state.userSlice.user);
  const textAreaRef = useRef(null);
  const chatRef = useRef(null);
  const sendMessage = (message) => {
    const timestamp = Date.now();
    if (
      textAreaRef.current.value
        .replaceAll(/(?:\r\n|\r|\n)/g, "")
        .replaceAll(/\s/g, "").length > 0
    ) {
      const messageRef = ref(rtdb, "messages");
      push(messageRef, {
        message: message,
        sender: user,
        timestamp: timestamp,
      });
    }
    dispatch(setLastMsg(timestamp));
    setTextAreaState((prev) => {
      return {
        ...prev,
        value: "",
        rows: 1,
      };
    });
  };
  const textAreaHandler = (e) => {
    const textareaLineHeight = 24;
    const { minRows, maxRows } = textAreaState;
    const previousRows = e.target.rows;
    e.target.rows = minRows; // reset number of rows in textarea
    const currentRows = e.target.scrollHeight / textareaLineHeight;
    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }
    if (currentRows >= maxRows) {
      e.target.rows = maxRows;
      e.target.scrollTop = e.target.scrollHeight;
    }

    setTextAreaState((prev) => ({
      ...prev,
      value: e.target.value,
      rows: currentRows < maxRows ? currentRows : maxRows,
    }));
  };

  useEffect(() => {
    const unsubscribeMessages = onValue(ref(rtdb, "messages"), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = [];
        Object.values(data).forEach((message) => {
          messages.push(message);
        });
        setMessages(messages);
      } else {
        setMessages([]);
      }
    });

    return () => {
      unsubscribeMessages();
    };
  }, []);

  return (
    <div className="flex flex-row bg-gray-color rounded-lg h-full w-full overflow-hidden ">
      {!mobile && <OnlineList></OnlineList>}
      <div className="w-full h-full flex items-center p-4 flex-col m-2">
        <span className="text-white font-bold text-2xl h-fit">Chat Global</span>
        <div
          ref={chatRef}
          className={`h-full w-full bg-gray-color px-4 py-2 overflow-auto gap-4 flex flex-col  `}
        >
          {messages.map((message, index) => (
            <Message key={index} message={message}></Message>
          ))}
        </div>
        <div className=" w-full flex justify-between items-center ">
          {user ? (
            <div
              className={`flex-grow py-2 px-4 mr-1 ${
                textAreaState.rows < 2 ? `rounded-full` : `rounded-lg  `
              }  border border-gray-300 bg-gray-color-light text-gray-color-lighter placeholder-gray-color-lighter resize-none outline-none h-fit`}
            >
              <textarea
                ref={textAreaRef}
                rows={textAreaState.rows}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!e.shiftKey) {
                      e.stopPropagation();
                      e.preventDefault();
                      sendMessage(textAreaState.value);
                    }
                  }
                }}
                onChange={textAreaHandler}
                value={textAreaState.value}
                placeholder="Message..."
                className=" flex justify-center w-full h-full bg-transparent outline-none resize-none"
              ></textarea>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <button
                onClick={signInWithGoogle}
                className="bg-white rounded-lg px-4 py-2"
              >
                Log in to chat
              </button>
            </div>
          )}
          {user ? (
            <button
              className="m-2 outline-none"
              onClick={() => {
                sendMessage(textAreaState.value);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                ariaHidden="true"
                className="svg-inline--fa text-red-700 fa-paper-plane fa-w-16 w-12 h-12 py-2 mr-2"
                data-icon="paper-plane"
                data-prefix="fas"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
                ></path>
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Chat;

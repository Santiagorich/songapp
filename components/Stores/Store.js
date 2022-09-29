import userSlice from "./Slices/userSlice";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    userSlice,
  },
});

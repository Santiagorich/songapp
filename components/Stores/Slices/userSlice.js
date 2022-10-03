import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isMobile: false,
    checked: false,
    lastMsg: null,
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      return state;
    },
    setMobile: (state, action) => {
      state.isMobile = action.payload;
      return state;
    },
    setLastMsg: (state, action) => {
      state.lastMsg = action.payload;
      return state;
    },

  },
});

export const { setUser,setMobile,setLastMsg } = userSlice.actions;

export default userSlice.reducer;

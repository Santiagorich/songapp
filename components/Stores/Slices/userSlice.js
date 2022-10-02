import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isMobile: false,
    checked: false,
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      return state;
    },
    setMobile: (state, action) => {
      state.isMobile = action.payload;
      state.checked = true;
      return state;
    },

  },
});

export const { setUser,setMobile } = userSlice.actions;

export default userSlice.reducer;

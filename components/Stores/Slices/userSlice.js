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
      return state;
    },
    setChecked: (state, action) => {
      state.checked = action.payload;
      return state;
    },
  },
});

export const { setUser,setMobile,setChecked } = userSlice.actions;

export default userSlice.reducer;

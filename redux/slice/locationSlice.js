import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    geolocationDenied: false,
  },
  reducers: {
    setGeolocationDenied: (state, action) => {
      state.geolocationDenied = action.payload;
    },
  },
});

export const { setGeolocationDenied } = locationSlice.actions;
export default locationSlice.reducer;

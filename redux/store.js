"use client";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/slice/userSlice";
import locationReducer from "@/redux/slice/locationSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    location: locationReducer,
  },
});

export default store;

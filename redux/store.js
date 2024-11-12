"use client";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/slice/userSlice";
import locationReducer from "@/redux/slice/locationSlice";
import topBookedServicesReducer from "@/redux/slice/topBookedServicesSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    location: locationReducer,
    topServices: topBookedServicesReducer,
  },
});

export default store;

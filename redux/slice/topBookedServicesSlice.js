import { createSlice } from "@reduxjs/toolkit";

const topBookedServicesSlice = createSlice({
  name: "topServices",
  initialState: {
    services: [],
    loading: true,
  },
  reducers: {
    setTopBookedServices: (state, action) => {
      state.services = action.payload;
    },
    setTopBookedServicesLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setTopBookedServices, setTopBookedServicesLoading } =
  topBookedServicesSlice.actions;
export default topBookedServicesSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { RangeType } from "../../domain/range";
import axios from "axios";

export interface RangeState {
  loading: boolean;
  errors: boolean;
  ranges: RangeType[];
}

export const initialState: RangeState = {
  loading: true,
  errors: false,
  ranges: [],
};

const rangesSlice = createSlice({
  name: "ranges",
  initialState,
  reducers: {
    getRanges: (state) => {
      state.loading = true;
    },
    getRangesSuccess: (state, { payload }) => {
      state.loading = false;
      state.errors = false;
      state.ranges = payload;
    },
    getRangesFailure: (state) => {
      state.loading = false;
      state.errors = true;
    },
  },
});

export default rangesSlice.reducer;

export const { getRanges, getRangesSuccess, getRangesFailure } =
  rangesSlice.actions;

export const rangesSelector = (state: { rangesReducer: RangeState }) => state;

export function fetchRanges() {
  return async (dispatch: any) => {
    dispatch(getRanges());

    try {
      const response = await axios.get("http://localhost:8000/ranges");

      const data = await response.data;
      dispatch(getRangesSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(getRangesFailure());
    }
  };
}

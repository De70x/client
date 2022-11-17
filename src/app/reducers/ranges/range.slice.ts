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
    createRange: (state) =>{
      state.loading = true;
      state.errors = false;
    },
    createRangeSuccess: (state, {payload})=>{
      state.ranges = [...state.ranges, payload];
      state.loading = false;
      state.errors = false;
    },
    failure: (state) => {
      state.loading = false;
      state.errors = true;
    },
  },
});

export default rangesSlice.reducer;

export const { getRanges, getRangesSuccess, createRange, createRangeSuccess, failure } =
  rangesSlice.actions;

export const rangesSelector = (state: { rangesReducer: RangeState }) => state;

export function fetchRanges() {
  return async (dispatch: any) => {
    dispatch(getRanges());

    try {
      const response = await axios.get("http://localhost:5000/api/range");
      const data = await response.data;
      console.log(data);
      dispatch(getRangesSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(failure());
    }
  };
}

export function creerRange(range : RangeType) {
  return async  (dispatch:any) =>{
    dispatch(createRange());
    try{
      const response = await axios.post("http://localhost:5000/api/range/", range);
      const data = await response.data;
      dispatch(createRangeSuccess(data));
    }catch (error){
      console.error(error);
      dispatch(failure());
    }
  }
}

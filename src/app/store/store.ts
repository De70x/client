import { configureStore } from "@reduxjs/toolkit";
import rangesReducer from "../reducers/ranges/range.slice";
import rangeActiveReducer from "../reducers/ranges/rangeActive.slice";

export const store = configureStore({
  reducer: { rangesReducer, rangeActiveReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

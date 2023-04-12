import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { postSlice } from "./post/postSlice";
import { postFilterSlice } from "./post/postFilterSlice";

export const store = configureStore({
  reducer: {
    post: postSlice.reducer,
    postFilter: postFilterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

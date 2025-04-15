import { configureStore } from "@reduxjs/toolkit";
import { postsApi } from "../features/posts/postsApi";
import { commentsSlice } from "../features/comments/commentsSlice";
import { postsSlice } from "../features/posts/postsSlice";
import { commentsApi } from "../features/comments/commentsApi";
import { userSlice } from "../user/userSlice";

export const store = configureStore({
    reducer: {
        [postsApi.reducerPath]: postsApi.reducer,
        [commentsApi.reducerPath]: commentsApi.reducer,
        posts: postsSlice,
        comments: commentsSlice.reducer,
        user: userSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(postsApi.middleware)
            .concat(commentsApi.middleware),
});

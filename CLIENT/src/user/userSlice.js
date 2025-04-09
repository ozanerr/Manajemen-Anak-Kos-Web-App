import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: "admin",
    imageUrl: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
    isloggedIn: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload;
        },
    },
});

export default userSlice.reducer;

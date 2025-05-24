import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    displayName: "",
    photoURL: "",
    isloggedIn: false,
    isAuthLoading: true,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { displayName, photoURL } = action.payload;
            state.displayName = displayName;
            state.photoURL = photoURL;
            state.isloggedIn = true;
            state.isAuthLoading = false;
        },
        clearUser: (state, action) => {
            state.displayName = "";
            state.photoURL = "";
            state.isloggedIn = false;
            state.isAuthLoading = false;
        },
    },
});

export default userSlice.reducer;
export const { setUser, clearUser } = userSlice.actions;

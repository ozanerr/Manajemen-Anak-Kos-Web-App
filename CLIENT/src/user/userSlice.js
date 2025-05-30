import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    displayName: "",
    photoURL: "",
    isloggedIn: false,
    isAuthLoading: true,
    uid: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { displayName, photoURL, uid } = action.payload;
            state.displayName = displayName;
            state.photoURL = photoURL;
            state.isloggedIn = true;
            state.isAuthLoading = false;
            state.uid = uid;
            state.payload = action.payload;
        },
        clearUser: (state, action) => {
            state.displayName = "";
            state.photoURL = "";
            state.isloggedIn = false;
            state.isAuthLoading = false;
            state.uid = "";
            state.payload = "";
        },
    },
});

export default userSlice.reducer;
export const { setUser, clearUser } = userSlice.actions;

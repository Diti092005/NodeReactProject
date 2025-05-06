import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: "",
        isUserLoggedIn: false,
    },
    reducers: {
        setToken: (state, action) => {
            const token = action.payload.token;
            const isUserLoggedIn = action.payload.isUserLoggedIn;
            state.token=token
            state.isUserLoggedIn = isUserLoggedIn;
            // Save the token to localStorage
            localStorage.setItem("token", token);
        },
        removeToken: (state) => {
            state.token = null;
            state.isUserLoggedIn = false;
            // Remove the token from localStorage
            // localStorage.removeItem("token");
            localStorage.removeItem("token");
        },
    }
});
export const { setToken, removeToken } = authSlice.actions;
export default authSlice.reducer;


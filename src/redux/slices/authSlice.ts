import {createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: sessionStorage.getItem('token') || null,
    isAuthenticated: !!sessionStorage.getItem('token'),
};


const authSlice = createSlice({
    name: 'auth',
    initialState, 
    reducers:{
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            sessionStorage.setItem('token', action.payload);  
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            sessionStorage.removeItem('token');
        },
    },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
      
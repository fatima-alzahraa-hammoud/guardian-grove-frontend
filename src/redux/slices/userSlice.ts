import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    id: string | null;
    name: string | null;
    email: string | null;
    avatar: string | null;
    gender: string | null;
    stars: number | 0;
}

const initialState: UserState = {
    id: null,
    name: null,
    email: null,
    avatar: null,
    gender: null,
    stars: 0,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            return {...state, ...action.payload};
        },
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

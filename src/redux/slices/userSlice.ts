import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    _id: string | null;
    name: string | null;
    email: string | null;
    avatar: string | null;
    gender: string | null;
    stars: number | 0;
    coins: number | 0;
}

const initialState: UserState = {
    _id: null,
    name: null,
    email: null,
    avatar: null,
    gender: null,
    stars: 0,
    coins: 0
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            return {...state, ...action.payload}
        },
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectStars = (state: { user: UserState }) => state.user.stars;
export const selectAvatar = (state: { user: UserState }) => state.user.avatar;
export const selectUserId = (state: { user: UserState }) => state.user._id;
export const selectName = (state: { user: UserState }) => state.user.name;
export const selectCoins = (state: { user: UserState }) => state.user.coins;

export default userSlice.reducer;

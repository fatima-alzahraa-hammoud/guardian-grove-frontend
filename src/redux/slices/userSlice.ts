import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    _id: string | null;
    name: string | null;
    email: string | null;
    avatar: string | null;
    gender: string | null;
    stars: number | 0;
}

const initialState: UserState = {
    _id: null,
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
            state._id = action.payload._id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.avatar = action.payload.avatar;
            state.gender = action.payload.gender;
            state.stars = action.payload.stars;
        },
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectStars = (state: { user: UserState }) => state.user.stars;
export const selectAvatar = (state: { user: UserState }) => state.user.avatar;
export const selectUserId = (state: { user: UserState }) => state.user._id;
export const selectName = (state: { user: UserState }) => state.user.name;

export default userSlice.reducer;

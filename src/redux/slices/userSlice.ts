import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    _id: string | null;
    name: string | null;
    email: string | null;
    birthday: Date;
    avatar: string | null;
    gender: string | null;
    stars: number | 0;
    coins: number | 0;
    memberSince: Date;
    purchasedItems: string[];
}

const initialState: UserState = {
    _id: null,
    name: null,
    email: null,
    birthday: new Date('1940-01-01'),
    avatar: null,
    gender: null,
    stars: 0,
    coins: 0,
    memberSince: new Date('1940-01-01'),
    purchasedItems: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            return {...state, ...action.payload}
        },
        setPurchasedItems: (state, action: PayloadAction<string[]>) => {
            state.purchasedItems = action.payload;
        },
        setCoins(state, action: PayloadAction<number>) {
            state.coins = action.payload;
        },
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser, setPurchasedItems, setCoins } = userSlice.actions;

export const selectStars = (state: { user: UserState }) => state.user.stars;
export const selectAvatar = (state: { user: UserState }) => state.user.avatar;
export const selectUserId = (state: { user: UserState }) => state.user._id;
export const selectName = (state: { user: UserState }) => state.user.name;
export const selectEmail = (state: { user: UserState }) => state.user.email;
export const selectBirthday = (state: { user: UserState }) => state.user.birthday;
export const selectMmeberSince = (state: { user: UserState }) => state.user.memberSince;
export const selectCoins = (state: { user: UserState }) => state.user.coins;
export const selectPurchasedItems = (state: { user: UserState }) => state.user.purchasedItems;

export default userSlice.reducer;

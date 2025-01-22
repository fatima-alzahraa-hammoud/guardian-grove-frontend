import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { format } from "date-fns";

interface UserState {
    _id: string | null;
    name: string | null;
    email: string | null;
    familyId: string | null;
    birthday: string;
    avatar: string | null;
    gender: string | null;
    role: string | null;
    stars: number | 0;
    coins: number | 0;
    rankInFamily: number | 0;
    memberSince: string;
    purchasedItems: string[];
    dailyMessage: string ;
}

const initialState: UserState = {
    _id: null,
    name: null,
    email: null,
    familyId: null,
    birthday: format(new Date(), "yyyy-MM-dd"),
    avatar: null,
    gender: null,
    role: null,
    stars: 0,
    coins: 0,
    rankInFamily: 0,
    memberSince: format(new Date(), "yyyy-MM-dd"),
    purchasedItems: [],
    dailyMessage: "You are shining! 💫",
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
        setStars(state, action: PayloadAction<number>) {
            state.stars += action.payload;
        },
        setEmail (state, action: PayloadAction<string>){
            state.email = action.payload
        },
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser, setPurchasedItems, setCoins, setEmail, setStars } = userSlice.actions;

export const selectStars = (state: { user: UserState }) => state.user.stars;
export const selectAvatar = (state: { user: UserState }) => state.user.avatar;
export const selectUserId = (state: { user: UserState }) => state.user._id;
export const selectName = (state: { user: UserState }) => state.user.name;
export const selectEmail = (state: { user: UserState }) => state.user.email;
export const selectBirthday = (state: { user: UserState }) => state.user.birthday;
export const selectMmeberSince = (state: { user: UserState }) => state.user.memberSince;
export const selectCoins = (state: { user: UserState }) => state.user.coins;
export const selectRank = (state: { user: UserState }) => state.user.rankInFamily;
export const selectPurchasedItems = (state: { user: UserState }) => state.user.purchasedItems;
export const selectRole = (state: { user: UserState }) => state.user.role;
export const selectGender = (state: { user: UserState }) => state.user.gender;
export const selectFamilyId = (state: { user: UserState }) => state.user.familyId;
export const selectDialyMessage = (state: { user: UserState }) => state.user.dailyMessage;

export default userSlice.reducer;

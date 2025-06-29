import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FamilyMember {
    name: string;
    role: string;
    avatar: string;
    gender: string;
}

interface FamilyState {
    _id: string | null;
    familyName: string | null;
    email: string | null;
    members: FamilyMember[];
    familyAvatar: string | null;
    totalStars: number | 0;
    tasks: number | 0;
    rank: number | 0;
}


const initialState: FamilyState = {
    _id: null,
    familyName: null,
    email: null,
    familyAvatar: null,
    totalStars: 0,
    tasks: 0,
    rank: 0,
    members: [],
}

const familySlice = createSlice({
    name: 'family',
    initialState,
    reducers: {
        setFamily: (state, action: PayloadAction<FamilyState>) => {
            return {...state, ...action.payload}
        },
        updateFamilyName: (state, action: PayloadAction<string>) => {
            state.familyName = action.payload
        },
        updateFamilyAvatar: (state, action: PayloadAction<string>) => {
            state.familyAvatar = action.payload;
        },
        clearFamily: () => initialState,
    },
});

export const { setFamily, clearFamily, updateFamilyName, updateFamilyAvatar} = familySlice.actions;

export const selectFamilyStars = (state: { family: FamilyState }) => state.family.totalStars;
export const selectFamilyAvatar = (state: { family: FamilyState }) => state.family.familyAvatar;
export const selectFamilyName = (state: { family: FamilyState }) => state.family.familyName;
export const selectNbOfTasks = (state: { family: FamilyState }) => state.family.tasks;
export const selectFamilyMembers = (state: { family: FamilyState }) => state.family.members;

export default familySlice.reducer;
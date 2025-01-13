import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FamilyState {
    _id: string | null;
    familyName: string | null;
    email: string | null;
    members: string[]; //contains id role name
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
        clearFamily: () => initialState,
    },
});

export const { setFamily, clearFamily} = familySlice.actions;

export const selectStars = (state: { family: FamilyState }) => state.family.totalStars;
export const selectAvatar = (state: { family: FamilyState }) => state.family.familyAvatar;
export const selectFamilyName = (state: { family: FamilyState }) => state.family.familyName;
export const selectNbOfTasks = (state: { family: FamilyState }) => state.family.tasks;
export const selectFamilyMembers = (state: { family: FamilyState }) => state.family.members;

export default familySlice.reducer;
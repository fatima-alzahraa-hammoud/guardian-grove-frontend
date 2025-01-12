
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
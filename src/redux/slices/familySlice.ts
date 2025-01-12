
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

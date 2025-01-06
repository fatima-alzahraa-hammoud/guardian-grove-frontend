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


export interface Task {
    _id: string;
    title: string;
    isCompleted: boolean; 
    description: string;
    rewards: {
        stars: number;
        coins: number;
    };
}
export interface BondingActivity {
    _id: string;
    title: string;
    description: string;
    category: string;
    duration: string;
    difficulty: "Easy" | "Medium" | "Hard";
    ageGroup: string;
    participants: string;
    materials: string[];
    downloadUrl: string;
    thumbnail: string;
    rating: number;
    downloads: number;
}
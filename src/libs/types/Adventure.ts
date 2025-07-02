import { IChallenge } from "./IChallenge";

export interface Adventure {
    _id: string;
    startDate: string;
    title: string;
    description: string;
    challenges: IChallenge[];
    starsReward: number;
    coinsReward: number;
}
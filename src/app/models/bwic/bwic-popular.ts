import { WorkStatus } from "..";

export interface BWICPopularState {
    /** BWIC List loading status **/
    loadingStatus: WorkStatus;

    /** Visible BWIC Popular List **/
    bwicPopularList: BwicPopularItem[];

    /** BWIC Popular List Count **/
    totalCount: number;
}

export interface BwicPopularItem {
    id: any
    clientId: string,
    cusip: string,
    size: number,
    issuer: string,
    dueDate: Date,
    version: number,
    numberOfBids: number
}

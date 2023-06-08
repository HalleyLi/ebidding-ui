import { WorkStatus } from "..";

export interface BiddingState {
    /** Bidding List loading status **/
    loadingStatus: WorkStatus;

    /** Visible Bidding List **/
    biddingList: BiddingItem[];

    /** Bidding List Count **/
    totalCount: number;
}

export interface BiddingItem {
    id: string;
    bwicId: string;
    clientId: string;
    effectiveTime: Date;
    feedback: string;
    price: number;
    rank: number;
    size: number;
    transactionId: string;
    version: number;
    bwic?: PureBWICItem
}

export interface PureBWICItem {
    id: string,
    cusip: string,
    issuer: string,
    dueDate: Date,
    clientId: string,
    size: number,
    version: number
}

export interface BidSubmitParams {
    id?: string;
    bwicId: string;
    clientId?: string;
    price?: number;
    size?: number;
    isOverDue?: boolean;
}

export interface BidCancelParams {
    id: string;
}
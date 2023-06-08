import { WorkStatus } from "..";
import { BiddingItem } from "../bidding/bidding";

export interface BWICState {
  /** BWIC List loading status **/
  loadingStatus: WorkStatus;

  /** Visible BWIC List **/
  bwicList: BWICItem[];

  /** BWIC List Count **/
  totalCount: number;
}

export interface BWICItem {
  id: string;
  cusip: string;
  issuer: string;
  dueDate: Date;
  clientId: string;
  size: number;
  version: number;
  isOverDue: boolean;
  bidList?: BiddingItem[];
}

export interface BwicSubmitParams {
  id?: string;
  clientId: string;
  cusip: string;
  dueDate: Date;
  size?: number;
}

export interface BwicCancelParams {
  id: string;
}

export interface BwicResult {
  affectedId: string;
}

export interface BWICBidItem {
  bwicDto: BWICItem;
  bids: BiddingItem[];
}

export class BWICBidInsertItem {
  id: string;
  cusip?: string;
  issuer?: string;
  dueDate?: Date;
  clientId?: string;
  size?: number;
  version?: number;
  isOverDue?: boolean;
  bidList?: BWICBidingItem[];

  constructor(id: string, size: number, clientId: string, isOverDue: boolean) {
    this.id = id;
    this.size = size;
    this.isOverDue = isOverDue;
    this.bidList = [new BWICBidingItem(id, clientId, size, isOverDue)] ;
  }
}

export class BWICBidingItem {
  id?: string;
  bwicId: string;
  clientId: string;
  isOverDue: boolean;
  effectiveTime?: Date;
  feedback?: string;
  price?: number;
  rank?: number;
  size: number;
  transactionId?: string;
  version?: number;

  constructor(
    bwicId: string,
    clientId: string,
    size: number,
    isOverDue: boolean,
    id?: string,
    effectiveTime?: Date,
    feedback?: string,
    price?: number,
    rank?: number,
    transactionId?: string,
    version?: number
  ) {
    this.id = id;
    this.bwicId = bwicId;
    this.clientId = clientId;
    this.effectiveTime = effectiveTime;
    this.feedback = feedback;
    this.price = price;
    this.rank = rank;
    this.size = size;
    this.transactionId = transactionId;
    this.version = version;
    this.isOverDue = isOverDue;
  }
}

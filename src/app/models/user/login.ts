/** user's role */
export enum Role {
  SALES = "TRADER",
  CLIENT = 'CLIENT'
};

export interface LoginParams {
  username: string;
  password: string;
}

export interface Account {
  id: string;
  name: string;
  memberSince: string;
  role: string;
  token: string;
}

export interface LogoutParams {
  token: string;
}

export interface LogoutResult {
  code: string;
  message: string;
  success: boolean;
  /** auth token */
  token: string;
}

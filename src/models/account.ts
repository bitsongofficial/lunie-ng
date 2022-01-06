export interface Account {
  account_number?: string;
  sequence?: string;
  base_vesting_account: {
    base_account: Account;
  };
}

export interface AccountResponse {
  account: Account;
}

export interface AccountInfo {
  accountNumber: string | undefined;
  sequence: string;
}

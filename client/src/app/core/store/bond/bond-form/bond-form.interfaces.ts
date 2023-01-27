export interface BondAmount {
  amount?: number;
  equivalentAmount?: number;
}

export interface Bond {
  id?: number;
  equivalentCurrency?: any;
  bondAmount?: BondAmount;
  equivalentCurrencyId?: any;
  bankAccount?: any;
  bankAccountId?: any;
  interestRate?: number;
  frequency?: number;
  installments?: number;
  maturity?: number;
  bondProduct?: any;
  bondProductId?: number;
  startDate?: any;
  expireDate?: any;
  profile?: any;
  profileId?: number;
  number?: number;
  sellDate?: any;
  couponDate?: any;
  interestScheme?: any;
}

export interface BondBreadcrumb {
  name: string;
  link: string;
}

export interface BondProduct {
  id: number,
  name: string,
  code: string,
  amount: number,
  numberMin: number,
  numberMax: number,
  currencies: any[],
  interestRateMin: number,
  interestRateMax: number,
  frequency: string,
  maturityMin: number,
  maturityMax: number,
  interestScheme: string
}

export interface BondFormState {
  id?: number;
  changed?: boolean;
  valid: boolean;
  data: Bond;
  currentRoute?: string;
  state?: string;
  breadcrumb?: BondBreadcrumb[];
  loaded?: boolean;
  bondProduct: BondProduct;
  profile?: {};
}

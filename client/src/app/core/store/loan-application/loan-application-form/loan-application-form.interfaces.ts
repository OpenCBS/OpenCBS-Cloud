import { ICreditLine } from '../../credit-line';

export interface ILoanAppFormData {
  id?: number;
  amounts?: Object[];
  code: string;
  disbursementDate?: string;
  preferredRepaymentDate?: string;
  gracePeriod?: number;
  installments?: number;
  interestRate?: number;
  creditLine?: any;
  creditLineId?: number;
  loanProduct?: any;
  loanProductId?: number;
  maturity?: number;
  maturityDate?: string;
  profile?: any;
  profileId?: number;
  userId?: number;
  scheduleType?: string;
  scheduleBasedType?: string;
  currencyId?: number;
  currencyName?: string;
  members?: Object[]
}

export interface IBreadcrumb {
  name: string;
  link: string;
}

export interface IPayee {
  name: string;
  id: number;
  description: string;
  selected: boolean;
}

export interface IPayeeItem {
  id: number;
  payee: IPayee;
  payeeName: string;
  payeeId: number;
  amount: number;
  disbursementDate: string;
  plannedDisbursementDate: string;
  description: string;
  status: string;
}

export interface IEntryFeeItem {
  id: number;
  name: string;
  amount: number;
  code: string;
  edited: boolean;
  minValue: number;
  maxValue?: number;
  minLimit: any;
  maxLimit: any;
  percentage: boolean;
  validate?: boolean;
}

export interface ILoanProduct {
  profileId: number;
  id: number;
  name: string;
  currency: any;
  scheduleType: string;
  scheduleBasedType: string;
  interestRateMin: number;
  interestRateMax: number;
  amountMin: number;
  amountMax: number;
  maturityMin: number;
  maturityMax: number;
  gracePeriodMin: number;
  gracePeriodMax: number;
  penaltyType: number;
  availability: number;
  hasPayees: boolean;
  fees: any[];
}

export interface ILoanAppFormState {
  id?: number;
  changed?: boolean;
  valid: boolean;
  data: ILoanAppFormData;
  total: Object[];
  currentRoute?: string;
  state?: string;
  breadcrumb?: IBreadcrumb[];
  loaded?: boolean;
  loanProduct: ILoanProduct;
  creditLine?: ICreditLine;
  payees?: IPayeeItem[],
  entryFees?: IEntryFeeItem[],
  profile?: {};
  currencyName: string;
  members: Object[];
}

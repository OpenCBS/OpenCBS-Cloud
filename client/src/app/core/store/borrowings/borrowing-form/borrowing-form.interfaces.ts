export interface IBorrowingFormData {
  id?: number;
  amount?: number;
  code: string;
  disbursementDate?: string;
  preferredRepaymentDate?: string;
  gracePeriod?: number;
  installments?: number;
  interestRate?: number;
  borrowingProduct?: any;
  borrowingProductId?: number;
  maturity?: number;
  profile?: any;
  profileId?: number;
  scheduleType?: string;
}

export interface IBorrowingBreadcrumb {
  name: string;
  link: string;
}

export interface IBorrowingProduct {
  id: number;
  name: string;
  currency: any;
  scheduleType: string;
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
}

export interface IBorrowingFormState {
  id?: number;
  changed?: boolean;
  valid: boolean;
  data: IBorrowingFormData;
  currentRoute?: string;
  state?: string;
  breadcrumb?: IBorrowingBreadcrumb[];
  loaded?: boolean;
  borrowingProduct: IBorrowingProduct;
  profile?: {};
}

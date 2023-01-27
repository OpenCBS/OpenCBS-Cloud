import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';

@Injectable()
export class HistoryLogService {
  public type: string;
  LOAN_PRODUCTS: string[] = ['LOAN_PRODUCT_CREATE', 'LOAN_PRODUCT_EDIT'];
  ROLES: string[] = ['ROLE_CREATE', 'ROLE_EDIT'];
  PROFILES: string[] = ['PEOPLE_CREATE', 'PEOPLE_EDIT', 'COMPANY_CREATE', 'COMPANY_EDIT', 'GROUP_CREATE', 'GROUP_EDIT'];
  SAVING_PRODUCTS: string[] = ['SAVING_PRODUCT_CREATE', 'SAVING_PRODUCT_EDIT'];
  TERM_DEPOSIT_PRODUCTS: string[] = ['TERM_DEPOSIT_PRODUCT_CREATE', 'TERM_DEPOSIT_PRODUCT_EDIT'];
  USERS: string[] = ['USER_CREATE', 'USER_EDIT'];
  ACCOUNTING: string[] = ['ACCOUNT_CREATE', 'ACCOUNT_EDIT'];

  constructor(private httpClient: HttpClient) {
  }

  getHistoryLog(data) {
    if ( this.LOAN_PRODUCTS.includes(data.requestType) ) {
      this.type = 'loan-products';
    } else if ( this.ROLES.includes(data.requestType) ) {
      this.type = 'roles';
    } else if ( this.PROFILES.includes(data.requestType) ) {
      this.type = 'profiles';
    } else if ( this.SAVING_PRODUCTS.includes(data.requestType) ) {
      this.type = 'saving-products';
    } else if ( this.TERM_DEPOSIT_PRODUCTS.includes(data.requestType) ) {
      this.type = 'term-deposit-products';
    } else if ( this.USERS.includes(data.requestType) ) {
      this.type = 'users';
    } else if ( this.ACCOUNTING.includes(data.requestType) ) {
      this.type = 'accounting';
    }
    return this.httpClient.get(`${environment.API_ENDPOINT}${this.type}/${data.objectId}/history/last_change?dateTime=${data.dateTime}`)
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

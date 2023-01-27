import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanApplicationFieldsService {

  constructor(private httpClient: HttpClient) {
  }

  getLoanApplicationFieldsMeta(): Observable<any> {
    const url = `loan-applications/custom-field-sections`;
    return this.httpClient.get(`${environment.API_ENDPOINT}${url}`);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class BorrowingInstallmentsService {

  constructor(private httpClient: HttpClient) {
  }

  getBorrowingInstallments(id: number) {
    return this.httpClient.get<any[]>(
      `${environment.API_ENDPOINT}borrowings/${id}/schedule`);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class BondInstallmentsService {

  constructor(private httpClient: HttpClient) {
  }

  getBondInstallments(id: number) {
    return this.httpClient.get<any[]>(
      `${environment.API_ENDPOINT}bonds/${id}/schedule`);
  }
}

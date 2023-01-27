import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientHeadersService } from '../../../services';
import { environment } from '../../../../../environments/environment';
import { BondProduct } from './bond-form.interfaces';

@Injectable({providedIn: 'root'})
export class BondProductService {

  constructor(private httpClient: HttpClient,
              private httpClientHeadersService: HttpClientHeadersService) {
  }

  public getDefaultBondProduct(): Observable<BondProduct> {
    return this.httpClient.get<BondProduct>(
      `${environment.API_ENDPOINT}/bond-products/default`,
      {
        headers: this.httpClientHeadersService.getHeaders()
      })
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

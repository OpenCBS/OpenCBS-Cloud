import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VaultCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createVault(vault) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}vaults`,
      JSON.stringify(vault))
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

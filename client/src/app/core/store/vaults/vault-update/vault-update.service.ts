import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VaultUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateVault(vault, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}vaults/${id}`,
      JSON.stringify(vault)).pipe(delay(environment.RESPONSE_DELAY));
  }
}

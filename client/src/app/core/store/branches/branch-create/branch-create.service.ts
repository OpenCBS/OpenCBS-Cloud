import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BranchCreateService {

  constructor(private httpClient: HttpClient) {
  }

  createBranch(branch) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}branches`,
      JSON.stringify(branch)).pipe(delay(environment.RESPONSE_DELAY));
  }
}

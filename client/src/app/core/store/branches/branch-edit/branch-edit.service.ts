import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BranchUpdateService {

  constructor(private httpClient: HttpClient) {
  }

  updateBranch(branch, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}branches/${id}`,
      JSON.stringify(branch)).pipe(delay(environment.RESPONSE_DELAY));
  }
}

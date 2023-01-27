import { delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoanApplicationCommentsService {

  constructor(private httpClient: HttpClient) {
  }

  public getLoanApplicationComments(params): Observable<any> {
    const endPoint = `${environment.API_ENDPOINT}chat/LOAN_APPLICATION/${params.id}`;
    const url = params.query ? `${endPoint}?page=${params.query.page}` : endPoint;

    return this.httpClient.get(url)
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  public addComment(data) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}chat/LOAN_APPLICATION/${data.id}`,
      null,
      {
        params: {
          payload: data.payload
        }
      })
      .pipe(delay(environment.RESPONSE_DELAY));
  }
}

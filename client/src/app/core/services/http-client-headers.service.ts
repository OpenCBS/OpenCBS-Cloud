import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class HttpClientHeadersService {

  constructor() {
  }

  private setHeaders(token?): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headersConfig);
  }

  public getHeaders() {
    const token = window.localStorage.getItem('token');
    return this.setHeaders(token);
  }

  public buildQueryParams(params): any {
    if (params) {
      let queryParams = {...params};
      if (queryParams['page']) {
        queryParams = {...queryParams, page: queryParams['page'] - 1};
      }
      return queryParams;
    } else {
      return null;
    }
  }
}

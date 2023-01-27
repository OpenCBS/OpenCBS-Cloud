import { Injectable } from '@angular/core';

@Injectable()
export class RouteService {
  public redirectUrl = '';

  constructor() {
  }


  getRedirectUrl() {
    return this.redirectUrl;
  }
}

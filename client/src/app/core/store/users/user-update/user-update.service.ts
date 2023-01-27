import { catchError, delay, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UserUpdateService {

  constructor(
    private httpClient: HttpClient,
    public translate: TranslateService,
    public toastrService: ToastrService) {
  }

  updateUser(user, id) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}users/${id}`,
      JSON.stringify(user))
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  updatePassword(data) {
    return this.httpClient.put(
      `${environment.API_ENDPOINT}users/update-password`,
      JSON.stringify(data))
      .pipe(
        delay(environment.RESPONSE_DELAY),
        catchError((err: HttpErrorResponse) => {
          const errObj = {
            error: true,
            message: err.error.message
          };
          return observableOf(errObj);
        }));
  }

  updateLoginPassword(data) {
    return this.httpClient.put(`${environment.API_ENDPOINT}login/update-password`,
      data,
      {responseType: 'text'})
      .pipe(delay(environment.RESPONSE_DELAY),
        map(res => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        }),
        catchError((err: HttpErrorResponse) => {
          const resp = JSON.parse(err.error);
          this.toastrService.error(`${resp.message}`, '', environment.ERROR_TOAST_CONFIG);
          return observableOf(err.error);
        }));
  }

  recover(data) {
    const inputValue = data.username;
    return this.httpClient.post(`${environment.API_ENDPOINT}login/password-reset?username=${inputValue}`,
      data,
      {responseType: 'text'})
      .pipe(delay(environment.RESPONSE_DELAY),
        map(res => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        }),
        catchError((err: HttpErrorResponse) => {
          const resp = JSON.parse(err.error);
          this.toastrService.error(`${resp.message}`, '', environment.ERROR_TOAST_CONFIG);
          return observableOf(err.error);
        }));
  }
}

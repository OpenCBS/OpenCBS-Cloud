import { delay } from 'rxjs/operators';


import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import * as UserActions from '../users/current-user';
import { CurrentUserAppState } from '../users/current-user';
import { Credentials } from './auth.actions';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class AuthService {

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private httpClient: HttpClient,
              private toastrService: ToastrService,
              private userStore$: Store<CurrentUserAppState>) {
  }

  login(credentials: Credentials): Observable<any> {
    return this.httpClient.post(`${environment.API_ENDPOINT}login`,
      JSON.stringify(credentials))
      .pipe(delay(environment.RESPONSE_DELAY));
  }

  checkAsAuthenticated(): void {
    this.isAuthenticatedSubject.next(true);
  }

  checkAsUnauthenticated(): void {
    this.userStore$.dispatch(new UserActions.CurrentUserLogout());
    this.isAuthenticatedSubject.next(false);
  }

  dispatchUserLoading(): void {
    this.userStore$.dispatch(new UserActions.CurrentUserLoading());
  }
}

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class CurrentUserService {

  public currentUserPermissionsSubject = new ReplaySubject<string[]>(1);
  public currentUserPermissions$ = this.currentUserPermissionsSubject.asObservable();


  constructor(private httpClient: HttpClient) {
  }

  getCurrentUser() {
    return this.httpClient.get<any>(`${environment.API_ENDPOINT}users/current`)
      .pipe(
        map(res => {
          if (res) {
            this.currentUserPermissionsSubject.next(res.role.permissions);
          }
          return res;
        }));
  }
}

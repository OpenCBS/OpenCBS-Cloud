import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { UserState } from '../../../../../core/store/users';
import * as fromStore from '../../../../../core/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cbs-user-details',
  templateUrl: 'user-details.component.html',
  styleUrls: ['user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public user: any;
  public userId: number;

  private userSub: Subscription;

  constructor(private userStore$: Store<UserState>) {
  }

  ngOnInit() {
    this.userSub = this.userStore$.pipe(select(fromRoot.getUserState))
      .subscribe((user: UserState) => {
        if ( user.loaded && user.success && !user.error ) {
          this.user = user;
          this.breadcrumb = [
            {
              name: 'CONFIGURATION',
              link: '/configuration'
            },
            {
              name: 'USERS',
              link: '/configuration/users'
            },
            {
              name: `${user.firstName} ${user.lastName}`,
              link: `/configuration/users/ ${this.user.id}`
            },
            {
              name: 'INFO',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.userStore$.dispatch(new fromStore.SetUserBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.userStore$.dispatch(new fromStore.ResetUser());
  }
}

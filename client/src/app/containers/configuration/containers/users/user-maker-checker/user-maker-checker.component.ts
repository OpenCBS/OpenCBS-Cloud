import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { UserMakerCheckerState } from '../../../../../core/store/users';
import * as fromStore from '../../../../../core/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cbs-user-maker-checker',
  templateUrl: 'user-maker-checker.component.html',
  styleUrls: ['user-maker-checker.component.scss']
})
export class UserMakerCheckerComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public user: any;
  public userId: number;

  private userSub: Subscription;

  constructor(private userMakerCheckerStore$: Store<UserMakerCheckerState>) {
  }

  ngOnInit() {
    this.userSub = this.userMakerCheckerStore$.pipe(select(fromRoot.getUserMakerCheckerState))
      .subscribe((userMakerChecker: UserMakerCheckerState) => {
        if ( userMakerChecker.loaded && userMakerChecker.success && !userMakerChecker.error ) {
          this.user = userMakerChecker;
          this.breadcrumb = [
            {
              name: 'USERS',
              link: '/configuration/users'
            },
            {
              name: `${userMakerChecker.firstName} ${userMakerChecker.lastName}`,
              link: `/configuration/users/ ${this.user.id}`
            },
            {
              name: 'MAKER/CHECKER',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.userMakerCheckerStore$.dispatch(new fromStore.SetUserMakerCheckerBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.userMakerCheckerStore$.dispatch(new fromStore.ResetUser());
  }
}

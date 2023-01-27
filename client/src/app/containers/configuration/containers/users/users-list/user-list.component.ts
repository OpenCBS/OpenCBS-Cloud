import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { UserListState } from '../../../../../core/store/users';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom15',
  name: 'custom15'
};

@Component({
  selector: 'cbs-config-users',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public users: Observable<UserListState>;
  public showAll = false;
  public queryObjectShowAll = {
    showAll: false
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'USERS',
      link: '/configuration/users'
    }
  ];

  private paramsSub: Subscription;

  constructor(
    private userListStore$: Store<UserListState>,
    private store$: Store<fromRoot.State>,
    private router: Router,
    private route: ActivatedRoute) {
    this.users = this.store$.pipe(select(fromRoot.getUsersState));
  }

  ngOnInit() {
    this.userListStore$.dispatch(new fromStore.LoadUserList());

    this.paramsSub = this.route.queryParams.subscribe(() => {
      if ( this.queryObjectShowAll.showAll ) {
        this.userListStore$.dispatch(new fromStore.LoadUserList(this.queryObjectShowAll));
      } else {
        this.userListStore$.dispatch(new fromStore.LoadUserList());
      }
    });
  }

  rowStyleClass(row) {
    return row.statusType !== 'ACTIVE' ? 'is-deleted' : '';
  }

  showAllUsers() {
    this.showAll = !this.showAll;
    this.queryObjectShowAll = {
      showAll: this.showAll
    };
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObjectShowAll
    };
    this.router.navigate(['configuration/users'], navigationExtras);
  }

  goToUserDetails(user) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'live'
      }
    };
    this.router.navigate(['/users', user.id, 'info'], navigationExtras)
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}

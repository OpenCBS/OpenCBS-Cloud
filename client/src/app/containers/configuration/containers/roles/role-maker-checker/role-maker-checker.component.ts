import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { generateRoleGroups } from '../shared/roles.utils';
import { RoleMakerCheckerState } from '../../../../../core/store';
import { GlobalPermissions } from '../../../../../core/store/global-permissions/global-permissions.model';

@Component({
  selector: 'cbs-role-maker-checker',
  templateUrl: 'role-maker-checker.component.html',
  styleUrls: ['role-maker-checker.component.scss']
})
export class RoleMakerCheckerComponent implements OnInit, OnDestroy {
  public roleMakerCheckerGroups: any;
  public roleMakerChecker: any;
  public isLoading = true;
  public breadcrumb = [];

  private roleMakerCheckerSub: any;
  private permissionsSub: any;

  constructor(private roleMakerCheckerStore$: Store<RoleMakerCheckerState>,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.permissionsSub = this.store$.pipe(select(fromRoot.getGlobalPermissionsState))
      .subscribe((data: GlobalPermissions) => {
        if ( data.loaded && data.success && !data.error ) {
          this.roleMakerCheckerGroups = generateRoleGroups(data['permissions']);
        }
      });

    this.roleMakerCheckerSub = this.roleMakerCheckerStore$.pipe(select(fromRoot.getRoleMakerCheckerState))
      .subscribe((roleMakerChecker: RoleMakerCheckerState) => {
        if ( roleMakerChecker.loaded && roleMakerChecker.success && !roleMakerChecker.error ) {
          this.isLoading = false;
          this.roleMakerChecker = roleMakerChecker.role;
          this.breadcrumb = [
            {
              name: 'ROLES',
              link: '/configuration/roles'
            },
            {
              name: `${this.roleMakerChecker['name']}`,
              link: `/configuration/roles/ ${this.roleMakerChecker.id}`
            },
            {
              name: 'MAKER/CHECKER',
              link: ''
            }
          ];
          this.checkDefined(this.roleMakerChecker['permissions'][0]['permissions']);
        }
      });

    setTimeout(() => {
      this.roleMakerCheckerStore$.dispatch(new fromStore.SetRoleMakerCheckerBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  checkDefined(permissions: string[]) {
    if ( permissions && permissions.length ) {
      permissions.map(permission => {
        this.roleMakerCheckerGroups.map(group => {
          group.permissions.map(element => {
            if ( element.name === permission ) {
              element.checked = true;
            }
          });
        });
      });
    }
    this.isLoading = false;
  }

  resetState() {
    this.roleMakerCheckerStore$.dispatch(new fromStore.ResetRoleMakerChecker());
  }

  ngOnDestroy() {
    this.resetState();
    this.roleMakerCheckerSub.unsubscribe();
    this.permissionsSub.unsubscribe();
  }
}

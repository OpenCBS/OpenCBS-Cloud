import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { generateRoleGroups } from '../shared/roles.utils';
import { RoleState } from '../../../../../core/store';
import { GlobalPermissions } from '../../../../../core/store/global-permissions/global-permissions.model';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'cbs-role-details',
  templateUrl: 'role-details.component.html',
  styleUrls: ['role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit, OnDestroy {
  public roleGroups: any;
  public role: any;
  public isLoading = true;
  public breadcrumb = [];

  private roleSub: Subscription;
  private permissionsSub: Subscription;

  constructor(private roleInfoStore$: Store<RoleState>,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.permissionsSub = this.store$.pipe(select(fromRoot.getGlobalPermissionsState))
      .subscribe((data: GlobalPermissions) => {
        if ( data.loaded && data.success && !data.error ) {
          this.roleGroups = generateRoleGroups(data['permissions']);
        }
      });

    this.roleSub = this.roleInfoStore$.pipe(select(fromRoot.getRoleInfoState))
      .subscribe((roleInfo: RoleState) => {
        if ( roleInfo.loaded && roleInfo.success && !roleInfo.error ) {
          this.isLoading = false;
          this.role = roleInfo;
          this.breadcrumb = [
            {
              name: 'CONFIGURATION',
              link: '/configuration'
            },
            {
              name: 'ROLES',
              link: '/configuration/roles'
            },
            {
              name: `${roleInfo.role['name']}`,
              link: `/configuration/roles/ ${this.role.role.id}`
            },
            {
              name: 'INFO',
              link: ''
            }
          ];
          this.checkDefined(roleInfo.role['permissions'][0]['permissions']);
        }
      });

    setTimeout(() => {
      this.roleInfoStore$.dispatch(new fromStore.SetRoleBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  checkDefined(permissions: string[]) {
    if ( permissions && permissions.length ) {
      permissions.map(permission => {
        this.roleGroups.map(group => {
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
    this.roleInfoStore$.dispatch(new fromStore.ResetRole());
  }

  ngOnDestroy() {
    this.resetState();
    this.roleSub.unsubscribe();
    this.permissionsSub.unsubscribe();
  }
}

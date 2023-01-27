import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { RoleMakerCheckerService, RoleMakerCheckerState, RoleState } from '../../../../../core/store';
import { generateRoleGroups } from '../shared/roles.utils';
import { GlobalPermissions } from '../../../../../core/store/global-permissions/global-permissions.model';
import { RoleSideNavService } from '../shared/services/role-side-nav.service';
import { environment } from '../../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Rx';

const SVG_DATA = {  collection: 'standard',  class: 'service-resource',  name: 'service_resource'};

@Component({
  selector: 'cbs-role-wrap',
  templateUrl: 'role-wrap.component.html',
  styleUrls: ['./role-wrap.component.scss']
})
export class RoleWrapComponent implements OnInit, OnDestroy {
  public roleGroups: any;
  public breadcrumb = [];
  public role: any;
  public roleId: number;
  public isLoading = true;
  public roleNavConfig = [];
  public svgData = SVG_DATA;
  public roleType: string;
  public approve = false;
  public deleteRequest = false;
  public readOnly = false;

  private routeSub: Subscription;
  private paramsSub: Subscription;
  private roleSub: Subscription;
  private roleMakerCheckerSub: Subscription;
  private permissionsSub: Subscription;

  constructor(private roleInfoStore$: Store<RoleState>,
              private roleMakerCheckerStore$: Store<RoleMakerCheckerState>,
              private store$: Store<fromRoot.State>,
              private roleSideNavService: RoleSideNavService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private roleMakerCheckerService: RoleMakerCheckerService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.roleId = +params['id'];
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.roleType = query.type;
      this.roleType === 'live' ? this.loadRole(this.roleId) : this.loadMakerCheckerRole(this.roleId);
    });

    this.permissionsSub = this.store$.pipe(select(fromRoot.getGlobalPermissionsState))
      .subscribe((data: GlobalPermissions) => {
        if (data.loaded && data.success && !data.error) {
          this.roleGroups = generateRoleGroups(data['permissions']);
        }
      });

    if (this.roleType === 'live') {
      this.roleSub = this.roleInfoStore$.pipe(select(fromRoot.getRoleInfoState))
        .subscribe((roleInfo: RoleState) => {
          if (roleInfo.loaded && roleInfo.success && !roleInfo.error) {
            this.role = roleInfo;
            this.readOnly = this.role.role.readOnly;
            this.breadcrumb = this.role.breadcrumb;
            this.roleNavConfig = this.roleSideNavService.getNavList('roles', {
              roleId: this.role.role.id,
              editMode: false,
              createMode: false
            });
            this.checkDefined(roleInfo.role['permissions'][0]['permissions']);
          }
        });
    }

    if (this.roleType === 'maker-checker') {
      this.roleMakerCheckerSub = this.roleMakerCheckerStore$.pipe(select(fromRoot.getRoleMakerCheckerState))
        .subscribe((roleMakerChecker: RoleMakerCheckerState) => {
          if (roleMakerChecker.loaded && roleMakerChecker.success && !roleMakerChecker.error) {
            this.role = roleMakerChecker;
            this.breadcrumb = this.role.breadcrumb;
            this.roleNavConfig = this.roleSideNavService.getNavList('roles', {
              roleId: this.roleId,
              editMode: true,
              createMode: true
            });
            this.checkDefined(roleMakerChecker.role['permissions'][0]['permissions']);
          }
        });
    }
  }

  loadRole(id) {
    this.roleInfoStore$.dispatch(new fromStore.LoadRole(id));
  }

  loadMakerCheckerRole(id) {
    this.roleMakerCheckerStore$.dispatch(new fromStore.LoadRoleMakerChecker(id));
  }

  checkDefined(permissions: string[]) {
    if (permissions && permissions.length) {
      permissions.map(permission => {
        this.roleGroups.map(group => {
          group.permissions.map(element => {
            if (element.name === permission) {
              element.checked = true;
            }
          });
        });
      });
    }
    this.isLoading = false;
  }

  openApproveModal() {
    this.approve = true;
  }

  openDeleteModal() {
    this.deleteRequest = true;
  }

  closeModal() {
    this.approve = false;
    this.deleteRequest = false;
  }

  approveRoleRequest() {
    this.roleMakerCheckerService.approveMakerChecker(this.roleId)
      .pipe(catchError((res: HttpErrorResponse) => {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        return throwError(res);
      }))
      .subscribe(() => {
        this.toastrService.clear();
        this.toastrService.success('Successfully approved', '', environment.SUCCESS_TOAST_CONFIG);
        this.router.navigate(['/requests'])
      });
  }

  deleteRoleRequest() {
    this.roleMakerCheckerService.deleteMakerChecker(this.roleId)
      .pipe(catchError((res: HttpErrorResponse) => {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        return throwError(res);
      }))
      .subscribe(() => {
        this.toastrService.clear();
        this.toastrService.success('Successfully deleted', '', environment.SUCCESS_TOAST_CONFIG);
        this.router.navigate(['/requests'])
      });
  }

  resetState() {
    this.roleInfoStore$.dispatch(new fromStore.ResetRole());
    this.roleMakerCheckerStore$.dispatch(new fromStore.ResetRoleMakerChecker());
  }

  ngOnDestroy() {
    this.resetState();
    if (this.roleType === 'live') {
      this.roleSub.unsubscribe();
    }
    if (this.roleType === 'maker-checker') {
      this.roleMakerCheckerSub.unsubscribe();
    }
    this.routeSub.unsubscribe();
    this.paramsSub.unsubscribe();
    this.permissionsSub.unsubscribe();
  }
}

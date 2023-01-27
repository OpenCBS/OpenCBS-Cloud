import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import {
  checkRoleFormChanges,
  generateRoleGroups,
  generateSubmitData
} from '../shared/roles.utils';
import {
  RoleState,
  GlobalPermissions,
  UpdateRoleState, RoleUpdateService,
} from '../../../../../core/store';
import { RoleListState } from '../../../../../core/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Rx';

const SVG_DATA = {  collection: 'standard',  class: 'service-resource',  name: 'service_resource'};

@Component({
  selector: 'cbs-role-edit',
  templateUrl: 'role-edit.component.html',
  styleUrls: ['role-edit.component.scss']
})
export class RoleEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('f', {static: false}) roleForm;
  public roleGroups: any;
  public role: any;
  public formChanged = false;
  public formInvalid = false;
  public isLoading = true;
  public svgData = SVG_DATA;
  public isOpen = false;
  public selectValue = 'value';
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'ROLES',
      link: '/configuration/roles'
    },
    {
      name: 'EDIT',
      link: ''
    }
  ];
  public statusTypeData = [
    {
      value: 'ACTIVE',
      name: 'Active'
    },
    {
      value: 'INACTIVE',
      name: 'Inactive'
    },
  ];

  private isLeaving = false;
  private isSubmitting = false;
  private nextRoute: string;
  private routeSub: any;
  private formSub: any;
  private timer: any;
  private cachedRole: any;
  private roleId: number;
  private roleSub: Subscription;
  private permissionsSub: Subscription;

  constructor(private roleUpdateStore$: Store<UpdateRoleState>,
              private roleStore$: Store<RoleListState>,
              private toastrService: ToastrService,
              private roleUpdateService: RoleUpdateService,
              private translate: TranslateService,
              private route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private roleInfoStore$: Store<RoleState>) {
  }

  ngOnInit() {
    this.permissionsSub = this.store$.pipe(select(fromRoot.getGlobalPermissionsState))
      .subscribe((data: GlobalPermissions) => {
        if ( data.loaded && data.success && !data.error ) {
          this.roleGroups = generateRoleGroups(data['permissions']);
        }
      });

    this.roleSub = this.store$.pipe(select(fromRoot.getRoleInfoState))
      .subscribe((roleInfo: RoleState) => {
        if ( roleInfo.loaded && roleInfo.success && !roleInfo.error ) {
          this.role = roleInfo;
          this.cachedRole = roleInfo.role;
          this.breadcrumbLinks[1] = {
            name: `${roleInfo.role['name']}`,
            link: ''
          };
          this.checkDefined(roleInfo.role['permissions'][0]['permissions']);
        }
      });

    this.routeSub = this.route.params.subscribe(params => {
      this.roleId = +params['id'];
      this.loadRole(this.roleId);
    });
  }

  loadRole(id) {
    this.roleInfoStore$.dispatch(new fromStore.LoadRole(id));
  }

  canDeactivate(url?) {
    this.nextRoute = url;
    if ( this.formChanged && !this.isSubmitting ) {
      this.isOpen = true;
      return this.isLeaving;
    } else {
      return true;
    }
  }

  goToNextRoute() {
    this.isLeaving = true;
    this.router.navigateByUrl(this.nextRoute);
  }

  closeConfirmPopup() {
    this.isOpen = false;
  }

  ngAfterViewInit() {
    this.formSub = this.roleForm.form.valueChanges.subscribe(data => {
      if ( this.cachedRole ) {
        this.formChanged = checkRoleFormChanges(data, this.cachedRole);
      }
      !(data['name'] && data['name'].length) ? this.formInvalid = true : this.formInvalid = false;
    });
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

  submitForm({valid, value}) {
    if ( valid ) {
      this.isSubmitting = true;
      const data = generateSubmitData(value);
      this.roleUpdateService.updateRole(data, this.roleId).subscribe((res: any) => {
        if (res.error) {
          this.toastrService.clear();
          this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
        } else {
          this.toastrService.clear();
          this.translate.get('UPDATE_SUCCESS').subscribe((message: string) => {
            this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.router.navigate(['/configuration', 'roles']);
        }
      });
      this.roleStore$.dispatch(new fromStore.LoadRoleList());
    }
  }

  goToViewRole() {
    this.resetState();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'live'
      }
    };
    this.router.navigate(['/roles', this.roleId, 'info'], navigationExtras);
  }

  resetState() {
    clearTimeout(this.timer);
    this.roleInfoStore$.dispatch(new fromStore.ResetRole());
    this.roleUpdateStore$.dispatch(new fromStore.UpdateRoleReset());
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.formSub.unsubscribe();
    this.roleSub.unsubscribe();
    this.permissionsSub.unsubscribe();
  }
}

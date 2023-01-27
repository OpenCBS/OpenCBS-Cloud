import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { environment } from '../../../../../../environments/environment';

import { Role, CreateRoleState } from '../../../../../core/store/roles';
import {
  generateRoleGroups,
  generateSubmitData
} from '../shared/roles.utils';
import { GlobalPermissions } from '../../../../../core/store/global-permissions/global-permissions.model';
import { CurrentUserService } from '../../../../../core/store/users/current-user';
import { RoleCreateService, RoleListState } from '../../../../../core/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Rx';

const SVG_DATA = {collection: 'standard', class: 'service-resource', name: 'service_resource'};

@Component({
  selector: 'cbs-role-create',
  templateUrl: 'role-create.component.html',
  styleUrls: ['role-create.component.scss']
})
export class RoleCreateComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('f', {static: false}) roleForm;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public role: Role;
  public isLoading = true;
  public roleGroups: any;
  public permissions = [];
  public formInvalid = false;
  public svgData = SVG_DATA;
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
      name: 'CREATE',
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

  private formSub: Subscription;
  private permissionsSub: Subscription;

  constructor(private createRoleStore$: Store<CreateRoleState>,
              private roleStore$: Store<RoleListState>,
              private router: Router,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private store$: Store<fromRoot.State>,
              private roleCreateService: RoleCreateService,
              private currentUserService: CurrentUserService,
              private globalPermissionsStore$: Store<GlobalPermissions>,
              private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.permissionsSub = this.store$.pipe(select(fromRoot.getGlobalPermissionsState))
      .subscribe((data: GlobalPermissions) => {
        if ( data.loaded && data.success && !data.error ) {
          this.roleGroups = generateRoleGroups(data['permissions']);
          this.isLoading = false;
        }
      });

    this.globalPermissionsStore$.dispatch(new fromStore.LoadGlobalPermissions());
  }

  ngAfterViewInit() {
    this.formSub = this.roleForm.form.valueChanges.subscribe(data => {
      !data['name'].length ? this.formInvalid = true : this.formInvalid = false;
    });
  }

  submitForm({valid, value}) {
    if ( valid ) {
      const data = generateSubmitData(value);
      this.roleCreateService.createRole(data)
        .subscribe((res: any) => {
          if ( res.error ) {
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.toastrService.clear();
            this.translate.get('CREATE_SUCCESS').subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['/configuration', 'roles']);
          }
        });
      this.roleStore$.dispatch(new fromStore.LoadRoleList());
    }
  }

  goToViewRoles() {
    this.resetState();
    this.router.navigate(['/configuration', 'roles']);
  }

  resetState() {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', false);
    this.createRoleStore$.dispatch(new fromStore.CreateRoleReset());
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
    this.permissionsSub.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as fromRoot from '../../../../../core/core.reducer';
import { CreateUserState, UserCreateService, UserListState } from '../../../../../core/store/users';
import { getRoles, Role, RoleListState } from '../../../../../core/store/roles';
import * as fromStore from '../../../../../core/store';
import { environment } from '../../../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom15',
  name: 'custom15'
};

@Component({
  selector: 'cbs-user-create',
  templateUrl: 'user-create.component.html',
  styleUrls: ['user-create.component.scss']
})
export class UserCreateComponent implements OnInit, OnDestroy {
  public roles = [];
  public rolesStore;
  public branch: any;
  public rolesExist = false;
  public userState: CreateUserState;
  public userCreateForm: FormGroup;
  public passwordNotMatch: boolean;
  private userFormSub$: any;
  public formConfig = {
    url: `${environment.API_ENDPOINT}branches`
  };
  public statusTypeData = [
    {
      value: 'ACTIVE',
      name: 'ACTIVE'
    },
    {
      value: 'INACTIVE',
      name: 'INACTIVE'
    },
  ];
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'USERS',
      link: '/configuration/users'
    },
    {
      name: 'CREATE',
      link: ''
    }
  ];

  private createUserSub: Subscription;
  private rolesSub: Subscription;

  constructor(private createUserStore$: Store<CreateUserState>,
              private userCreateService: UserCreateService,
              private userListStore$: Store<UserListState>,
              private rolesStore$: Store<RoleListState>,
              private store$: Store<fromRoot.State>,
              public toastrService: ToastrService,
              public translate: TranslateService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.createUserSub = this.store$.select(fromRoot.getUserCreateState).subscribe((state: CreateUserState) => {
      this.userState = state;
      if ( state.loaded && state.success && !state.error ) {
        this.goToUsers();
      } else if ( state.loaded && !state.success && state.error ) {
        this.resetState();
      }
    });

    this.rolesSub = this.rolesStore$.pipe((getRoles())).subscribe((roles: Role[]) => {
      if ( roles && roles.length ) {
        this.rolesExist = true;
        this.roles = [];
        roles.map(item => {
          this.roles.push({
            id: item.id,
            name: item.name
          });
        });
      } else {
        this.rolesExist = false;
      }
    });

    this.userCreateForm = this.formBuilder.group({
      statusType: new FormControl('ACTIVE'),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      roleId: new FormControl('', Validators.required),
      branchId: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      idNumber: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required)
    });

    this.userFormSub$ = this.userCreateForm.valueChanges.subscribe(data => {
      this.passwordNotMatch = data.confirmPassword !== '' && data.password !== data.confirmPassword;
    });
  }

  submit() {
    delete this.userCreateForm.value['confirmPassword'];
    this.userCreateService.createUser(this.userCreateForm.value)
      .subscribe((res) => {
        if ( res.error ) {
          this.toastrService.clear();
          this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
        } else {
          this.toastrService.clear();
          this.translate.get('CREATE_SUCCESS').subscribe((message: string) => {
            this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.router.navigate(['/configuration', 'users']);
        }
      });
    this.userListStore$.dispatch(new fromStore.LoadUserList());
  }

  goToUsers() {
    this.resetState();
    this.router.navigate(['configuration', 'users']);
  }

  resetState() {
    this.createUserStore$.dispatch(new fromStore.CreateUserReset());
  }

  ngOnDestroy() {
    this.createUserSub.unsubscribe();
    this.rolesSub.unsubscribe();
    this.userFormSub$.unsubscribe();
    this.resetState();
  }
}

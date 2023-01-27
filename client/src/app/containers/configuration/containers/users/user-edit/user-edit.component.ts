import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { RoleListState, getRoles, Role } from '../../../../../core/store/roles';
import { UpdateUserState, UserState } from '../../../../../core/store/users';
import { environment } from '../../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserUpdateService } from '../../../../../core/store';
import { UserListState } from '../../../../../core/store';
import { Subscription } from 'rxjs';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom15',
  name: 'custom15'
};

@Component({
  selector: 'cbs-user-edit',
  templateUrl: 'user-edit.component.html',
  styleUrls: ['user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy, AfterViewInit {
  public roles: Object[] = [];
  public userId: number;
  public user: any = {};
  public selectLabel = 'SELECT';
  public formChanged = false;
  public userUpdateState: UpdateUserState;
  public userEditForm: FormGroup;
  public branchId: number;
  public svgData = SVG_DATA;
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
      name: '',
      link: ''
    },
    {
      name: 'EDIT',
      link: ''
    }
  ];
  public isOpen = false;

  private isLeaving = false;
  private isSubmitting = false;
  private nextRoute: string;
  private cachedUser = {};
  private rolesSub: Subscription;
  private routeSub: Subscription;
  private userSub: Subscription;
  private formSub: Subscription;
  private userUpdateSub: Subscription;

  constructor(private route: ActivatedRoute,
              private userListStore$: Store<UserListState>,
              private router: Router,
              private rolesStore$: Store<RoleListState>,
              private userStore$: Store<UserState>,
              private userUpdateService: UserUpdateService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private userUpdateStore$: Store<UpdateUserState>,
              private store$: Store<fromRoot.State>,
              private formBuilder: FormBuilder) {
    this.userSub = this.store$.pipe(select(fromRoot.getUserState)).subscribe((user: UserState) => {
      if (user.success && user.loaded) {
        this.user = user;
        if (user['branch']) {
          this.selectLabel = user['branch']['name'];
          this.cachedUser['branchId'] = user.branch['id'];
          this.branchId = user['branch']['id'];
        }
        this.cachedUser['firstName'] = user.firstName;
        this.cachedUser['lastName'] = user.lastName;
        this.cachedUser['username'] = user.username;
        this.cachedUser['roleId'] = user.role['id'];
        this.cachedUser['email'] = user.email;
        this.cachedUser['phoneNumber'] = user.phoneNumber;
        this.cachedUser['address'] = user.address;
        this.cachedUser['idNumber'] = user.idNumber;
        this.cachedUser['position'] = user.position;
        this.cachedUser['statusType'] = user.statusType;

        this.breadcrumbLinks[2] = {
          name: `${user.firstName} ${user.lastName}`,
          link: ''
        };
        this.populateFields(user);
      }
    });
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && id > 0) {
        this.userId = id;
        this.userStore$.dispatch(new fromStore.LoadUser(id));
      }
    });

    this.rolesSub = this.rolesStore$.pipe((getRoles())).subscribe((roles: Role[]) => {
      if (roles && roles.length) {
        this.roles = [];
        roles.map(item => {
          this.roles.push({
            id: item.id,
            name: item.name
          });
        });
      }
    });

    this.userUpdateSub = this.store$.pipe(select(fromRoot.getUserUpdateState)).subscribe((userUpdateState: UpdateUserState) => {
      this.userUpdateState = userUpdateState;
      if (userUpdateState.loaded && userUpdateState.success && !userUpdateState.error) {
        this.goToViewUser();
      } else if (userUpdateState.loaded && !userUpdateState.success && userUpdateState.error) {
        this.resetState();
      }
    });

    this.userEditForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      roleId: new FormControl('', Validators.required),
      branchId: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      idNumber: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      statusType: new FormControl(''),
      id: new FormControl('')
    });
    this.userEditForm.controls['username'].disable({emitEvent: false, onlySelf: true});
  }

  populateFields(userData) {
    for (const key in userData) {
      if (this.userEditForm.controls.hasOwnProperty(key) && userData.hasOwnProperty(key)) {
        this.userEditForm.controls[key].setValue(userData[key], {emitEvent: false});
        this.userEditForm.controls['branchId'].setValue(userData['branch']['id']);
        this.userEditForm.controls['roleId'].setValue(userData['role']['id']);
      }
    }
  }

  canDeactivate(url?) {
    this.nextRoute = url;
    if (this.formChanged && !this.isSubmitting) {
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
    this.formSub = this.userEditForm.valueChanges.subscribe(data => {
      if (data['firstName'] && data['lastName'] && data['roleId']) {
        this.formChanged = this.checkFormChanges(data);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.userSub.unsubscribe();
    this.formSub.unsubscribe();
    this.userUpdateSub.unsubscribe();
  }

  checkFormChanges(data) {
    let status = false;
    for (let key in data) {
      if (data.hasOwnProperty(key) && this.cachedUser.hasOwnProperty(key)) {
        if (data[key] !== this.cachedUser[key]) {
          status = true;
        }
      }
    }
    return status;
  }

  goToViewUser() {
    this.resetState();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'live'
      }
    };
    this.router.navigate(['/users', this.userId, 'info'], navigationExtras)
  }

  resetState() {
    this.userUpdateStore$.dispatch(new fromStore.UpdateUserReset());
  };

  submitForm() {
    this.isSubmitting = true;
    this.userEditForm.controls['id'].setValue(this.userId);
    this.userUpdateService.updateUser(this.userEditForm.value, this.userId)
      .subscribe((res: any) => {
        if (res.error) {
          this.toastrService.clear();
          this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
        } else {
          this.toastrService.clear();
          this.translate.get('UPDATE_SUCCESS').subscribe((message: string) => {
            this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.router.navigate(['/configuration', 'users']);
        }
      });
    setTimeout(() => {
      this.userListStore$.dispatch(new fromStore.LoadUserList());
    }, 300);
  }
}

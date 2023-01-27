import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { UserMakerCheckerService, UserMakerCheckerState, UserState, UserUpdateService } from '../../../../../core/store/users';
import * as fromStore from '../../../../../core/store';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UpdateUserState } from '../../../../../core/store/users/user-update/user-update.reducer';
import { environment } from '../../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserSideNavService } from '../shared/services/user-side-nav.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Subscription } from 'rxjs';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom15',
  name: 'custom15'
};

@Component({
  selector: 'cbs-user-wrap',
  templateUrl: 'user-wrap.component.html',
  styleUrls: ['user-wrap.component.scss']
})
export class UserWrapComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public breadcrumb = [];
  public userNavConfig = [];
  public user: any;
  public userName: any;
  public userId: number;
  public userCurrentId: number;
  public openModal: boolean;
  public changePasswordForm: FormGroup;
  public passwordNotMatch: boolean;
  public userType: string;
  public approveRequest = false;
  public deleteRequest = false;
  public showChangePassword = false;
  public readOnly = false;
  public isSystem = true;

  private userCurrent: any;
  private formSub: Subscription;
  private routeSub: Subscription;
  private userSub: Subscription;
  private paramsSub: Subscription;
  private userMakerCheckerSub: Subscription;

  constructor(private userStore$: Store<UserState>,
              private userUpdateStore$: Store<UpdateUserState>,
              private userMakerCheckerStore$: Store<UserMakerCheckerState>,
              private route: ActivatedRoute,
              private router: Router,
              private userUpdateService: UserUpdateService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private userSideNavService: UserSideNavService,
              private userMakerCheckerService: UserMakerCheckerService,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.userId = +params['id'];
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.userType = query.type;
      this.userType === 'live' ? this.loadUser(this.userId) : this.loadMakerCheckerUser(this.userId);
    });

    if ( this.userType === 'live' ) {
      this.userSub = this.userStore$.pipe(select(fromRoot.getUserState))
        .subscribe((user: UserState) => {
          if ( user.loaded && user.success && !user.error ) {
            this.user = user;
            this.isSystem = this.user.role.isSystem;
            this.readOnly = this.user.readOnly;
            this.userName = this.user.firstName + ' ' + this.user.lastName;
            this.breadcrumb = this.user.breadcrumb;
            this.userNavConfig = this.userSideNavService.getNavList('users', {
              userId: this.userId,
              editMode: false,
              createMode: false
            });
          }
        });
    }

    if ( this.userType === 'maker-checker' ) {
      this.userMakerCheckerSub = this.userMakerCheckerStore$.pipe(select(fromRoot.getUserMakerCheckerState))
        .subscribe((userMakerChecker: UserMakerCheckerState) => {
          if ( userMakerChecker.loaded && userMakerChecker.success && !userMakerChecker.error ) {
            this.user = userMakerChecker;
            this.userName = this.user.firstName + ' ' + this.user.lastName;
            this.breadcrumb = this.user.breadcrumb;
            this.userNavConfig = this.userSideNavService.getNavList('users', {
              userId: this.userId,
              editMode: true,
              createMode: true
            });
          }
        });
    }

    this.changePasswordForm = this.formBuilder.group({
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    });

    this.formSub = this.changePasswordForm.valueChanges.subscribe(data => {
      this.passwordNotMatch = data.confirmPassword !== null && data.password !== data.confirmPassword;
    });

    this.userCurrent = this.store$.pipe(select(fromRoot.getCurrentUserState)).subscribe(res => {
      this.userCurrentId = res.id;
      this.showChangePassword = this.userCurrentId === this.userId;
    });
  }

  loadUser(id) {
    this.userStore$.dispatch(new fromStore.LoadUser(id));
  }

  loadMakerCheckerUser(id) {
    this.userMakerCheckerStore$.dispatch(new fromStore.LoadUserMakerChecker(id));
  }

  openChangePasswordModal() {
    this.openModal = true;
    this.changePasswordForm.reset();
  }

  cancel() {
    this.openModal = false;
  }

  openApproveModal() {
    this.approveRequest = true;
  }

  openDeleteModal() {
    this.deleteRequest = true;
  }

  closeModal() {
    this.approveRequest = false;
    this.deleteRequest = false;
  }

  approveUserRequest() {
    this.userMakerCheckerService.approveMakerChecker(this.userId)
      .pipe(catchError((res: any) => {
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

  deleteUserRequest() {
    this.userMakerCheckerService.deleteMakerChecker(this.userId)
      .pipe(catchError((res: any) => {
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

  submit() {
    this.changePasswordForm.value['userId'] = this.userId;
    this.userUpdateService.updatePassword(this.changePasswordForm.value)
      .subscribe((res: any) => {
        if (res.error) {
          this.toastrService.clear();
          this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
        } else {
          this.openModal = false;
          this.toastrService.clear();
          this.translate.get('UPDATE_SUCCESS').subscribe((message: string) => {
            this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
          });
        }
      });
  }

  resetState() {
    this.userUpdateStore$.dispatch(new fromStore.UpdateUserReset());
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.paramsSub.unsubscribe();
    this.formSub.unsubscribe();
    if ( this.userType === 'live' ) {
      this.userSub.unsubscribe();
    }
    if ( this.userType === 'maker-checker' ) {
      this.userMakerCheckerSub.unsubscribe();
    }
    this.userStore$.dispatch(new fromStore.ResetUser());
  }
}

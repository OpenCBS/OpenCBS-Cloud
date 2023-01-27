import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { AuthAppState, AuthService, UserUpdateService } from '../../../core/store';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { CommonService, SystemSettingsShareService } from '../../../core/services';
import { ISystemSettingState } from '../../../core/store';

@Component({
  selector: 'cbs-auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  public currentUser: any;
  public changePasswordForm: FormGroup;
  public recoverPasswordForm: FormGroup;
  public openModal: boolean;
  public openRecoverModal: boolean;
  public passwordNotMatch: boolean;
  public userId: number;
  public isLoading = false;
  public disabled = false;

  private formSub: any;

  constructor(private store$: Store<fromRoot.State>,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private authAppStateStore$: Store<AuthAppState>,
              private userUpdateService: UserUpdateService,
              private commonService: CommonService,
              private systemSettingsShareService: SystemSettingsShareService,
              private systemSettingStore$: Store<ISystemSettingState>) {
  }

  ngOnInit() {
    this.currentUser = this.store$.pipe(select(fromRoot.getAuthState));

    this.changePasswordForm = this.formBuilder.group({
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    });

    this.recoverPasswordForm = this.formBuilder.group({
      username: new FormControl('', Validators.required)
    });

    this.formSub = this.changePasswordForm.valueChanges.subscribe(data => {
      this.passwordNotMatch = data.confirmPassword !== null && data.password !== data.confirmPassword;
    });
  }

  submitForm({value, valid}) {
    this.commonService.getVersion()
      .subscribe(res => {
        if ( res.error ) {
          this.toastrService.error(res.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        } else {
          this.commonService.setData(res.instance);
        }
      });
    this.systemSettingStore$.dispatch(new fromStore.LoadSystemSetting());
    if ( valid ) {
      this.authService.login(value).pipe(
        catchError((res: any) => {
          if ( res.error.errorCode && res.error.errorCode !== 'invalid_credentials'
            && res.error.errorCode !== 'internal_error' && res.error.errorCode !== 'Not Found'
            && res.error.message !== 'User is disabled.' ) {
            this.userId = parseInt(res.error.errorCode, 10);
            this.openChangePasswordModal();
          }

          this.toastrService.clear();
          this.toastrService.error(`ERROR: ${res.error.message}`, '', environment.ERROR_TOAST_CONFIG);
          return throwError(res)
        })
      ).subscribe(data => {
        if ( data['error'] ) {
        } else {
          this.disabled = true;
          this.store$.dispatch(new fromStore.Login(value));
          setTimeout(() => {
            localStorage.removeItem('dateFormat');
            localStorage.setItem('dateFormat', this.systemSettingsShareService.getData('DATE_FORMAT'));
          }, 1500);
        }
      });
    }
  }

  openChangePasswordModal() {
    this.openModal = true;
    this.changePasswordForm.reset();
  }

  cancel() {
    this.disabled = false;
    this.openModal = false;
    this.openRecoverModal = false;
  }

  submit() {
    this.disabled = false;
    delete this.changePasswordForm.value['confirmPassword'];
    this.changePasswordForm.value['userId'] = this.userId;
    this.userUpdateService.updateLoginPassword(this.changePasswordForm.value).subscribe((res: any) => {
      if ( !res || res.httpStatus !== 500 ) {
        this.openModal = false;
      }
    });
  }

  recoverOpenModal() {
    this.openRecoverModal = true;
  }

  submitRecover() {
    this.isLoading = true;
    this.userUpdateService.recover(this.recoverPasswordForm.value).subscribe(() => {
      this.isLoading = false;
    });
    this.openRecoverModal = false;
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }
}

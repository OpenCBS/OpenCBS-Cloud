import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { select, Store } from '@ngrx/store';
import { ICreateOperation, OperationCreateService } from '../../../core/store/tellers/operation-create';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ITillInfo } from '../../../core/store';
import * as FileSaver from 'file-saver';
import { IProfile } from '../../../core/store/profile';
import { CommonService } from '../../../core/services';
import { PrintOutService } from '../../../core/services';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';

const SVG_DATA = {
  collection: 'standard',
  class: 'groups',
  name: 'groups'
};

@Component({
  selector: 'cbs-new-deposit',
  templateUrl: 'till-operation-new.component.html',
  styleUrls: ['till-operation-new.component.scss'],
  providers: [CommonService]
})

export class OperationsNewComponent implements OnInit, OnDestroy {
  public breadcrumbLinks = [];
  public tillId: number;
  public accountId: number;
  public form: FormGroup;
  public type: string;
  public labelButton: string;
  public customerControlName: string;
  public initiator: string;
  public formConfigCustomerAccount = {};
  public url;
  public currency: string;
  public isLoading = false;
  public disable: boolean;
  public tillIdForBreadcrumb: string;
  public formConfigCurrentAccount = {
    url: `${environment.API_ENDPOINT}profiles/with-accounts`
  };
  public formConfigSavingAccount = {
    url: `${environment.API_ENDPOINT}tills/savings-with-account`
  };
  public formConfigProfile = {
    url: `${environment.API_ENDPOINT}profiles`
  };
  public formConfigDepositors = [];
  public svgData = SVG_DATA;
  public hasBalance = false;
  public profileData: any;
  public imageUrl = '';
  public opened = false;
  public profileId: number;
  public profile: Observable<IProfile>;
  public balance: number;
  public getBalanceAccountId: number;
  public currentInstance: string;
  public receiptFormId: number;
  public receiptFormLabel: string;
  public isProfileExist = true;
  public addWithdrawer = false;
  public withdrawers = [];
  public showConfirmModal = false;
  public selectedFormFieldLabels = {};
  public date = moment().format(environment.DATE_FORMAT_MOMENT);

  private operationCreateSub: Subscription;
  private routerSub: Subscription;
  private tillSub: Subscription;

  constructor(private route: ActivatedRoute,
              private operationCreateStore$: Store<ICreateOperation>,
              private toastrService: ToastrService,
              private router: Router,
              private profileStore$: Store<IProfile>,
              private store$: Store<fromRoot.State>,
              private operationCreateService: OperationCreateService,
              private printingFormService: PrintOutService,
              private translate: TranslateService,
              private httpClient: HttpClient,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.currentInstance = this.commonService.getData();
    this.disable = false;
    this.operationCreateSub = this.store$.pipe(select(fromRoot.getOperationCreateState))
      .subscribe((operationCreate: ICreateOperation) => {
        if ( operationCreate.loaded && operationCreate.success && !operationCreate.error ) {
          this.resetState();
          setTimeout(() => {
            this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
              this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.goToOperations();
            this.isLoading = false;
          }, 1000);

        } else if ( operationCreate.loaded && !operationCreate.success && operationCreate.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(operationCreate.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.isLoading = false;
          this.resetState();
        }
      });

    this.createForm();
    this.tillSub = this.store$.pipe(select(fromRoot.getTillInfoState)).subscribe(
      (tillInfo: ITillInfo) => {
        if ( tillInfo['loaded'] && !tillInfo['error'] && tillInfo['success'] ) {
          this.tillId = tillInfo.data.id;
          this.tillIdForBreadcrumb = tillInfo.data.id.toString();
        }
      });

    this.routerSub = this.route.params.subscribe(params => {
      this.type = params['type'];
      if ( this.type === 'WITHDRAW_FROM_CURRENT_ACCOUNT' ) {
        this.addWithdrawer = true;
      }

      if ( this.type ) {
        this.labelButton = this.type === 'DEPOSIT_TO_CURRENT_ACCOUNT' || this.type === 'DEPOSIT_TO_SAVING_ACCOUNT'
          ? 'DEPOSIT' : 'WITHDRAW';
        this.customerControlName = this.type === 'DEPOSIT_TO_CURRENT_ACCOUNT' || this.type === 'WITHDRAW_FROM_CURRENT_ACCOUNT'
          ? 'profileId' : 'savingId'
        this.formConfigCustomerAccount = this.type === 'DEPOSIT_TO_CURRENT_ACCOUNT' || this.type === 'WITHDRAW_FROM_CURRENT_ACCOUNT'
          ? this.formConfigCurrentAccount : this.formConfigSavingAccount
        this.initiator = this.type === 'WITHDRAW_FROM_SAVING_ACCOUNT' || this.type === 'WITHDRAW_FROM_CURRENT_ACCOUNT'
          ? 'WITHDRAWER' : 'DEPOSITOR';
        const formType = this.type === 'DEPOSIT_TO_CURRENT_ACCOUNT'
          ? 'DEPOSIT_CA'
          : this.type === 'WITHDRAW_FROM_CURRENT_ACCOUNT'
            ? 'WITHDRAWAL_CA'
            : 'TILL_CASH_RECEIPT';
        this.printingFormService.getForms(formType).subscribe(res => {
          if ( res.err ) {
            this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
          } else if ( res.length ) {
            this.receiptFormId = res[0]['id'];
            this.receiptFormLabel = res[0]['label'];
          }
        });
      }

      this.breadcrumbLinks = [
        {
          name: 'TELLER_MANAGEMENT',
          link: '/till'
        },
        {
          name: this.tillIdForBreadcrumb,
          link: '/till/' + this.tillId + '/list'
        },
        {
          name: 'OPERATIONS',
          link: '/till/' + this.tillId + '/operations'
        },
        {
          name: this.type.toUpperCase(),
          link: ''
        }
      ];
    });
  }

  goToOperations() {
    this.router.navigate(['till', this.tillId, 'operations']);
  }

  createForm() {
    this.form = new FormGroup({
      date: new FormControl(this.date, Validators.required),
      profileId: new FormControl(''),
      amount: new FormControl('', Validators.required),
      savingId: new FormControl(''),
      description: new FormControl('', Validators.required),
      initiatorId: new FormControl('', Validators.required),
      initiator: new FormControl(''),
      isProfileExist: new FormControl(true),
      autoPrint: new FormControl('')
    });
  }

  resetState() {
    this.operationCreateStore$.dispatch(new fromStore.CreateOperationReset())
  }

  setLookupValue(values) {
    this.markSelectedFieldLabel(values, 'profileId');
    this.withdrawers = [];

    this.getBalanceAccountId = values.savingId ? values.accountId : values.id;
    this.operationCreateService.getAccountBalance(this.getBalanceAccountId).subscribe(accountingBalance => {
      this.balance = 0 < accountingBalance ? accountingBalance : 0;
      if ( this.currentInstance === 'fundaccess' ) {
        this.getDepositors(`profiles/people/${values.profileId}/links/profiles`).subscribe(
          res => {
            this.formConfigDepositors = res;
          },
          err => {
            this.toastrService.error(err.error.message, '', environment.ERROR_TOAST_CONFIG);
          });
      }
    });

    this.accountId = values.id;
    this.clearValues();
    this.currency = values.currency;
    this.hasBalance = true;

    this.operationCreateService.getWithdrawer(values.profileId).subscribe((res: any) => {
      this.withdrawers.push({
        value: res.id,
        name: res.name
      });
    });

    if ( values && values.profileId && values.savingId ) {
      this.form.controls['savingId'].setValue(values.savingId);
      this.form.controls['profileId'].setValue(values.profileId);
    } else {
      this.form.controls['profileId'].setValue(values.profileId);
    }
  }

  setWithdrawerValue(values) {
    if ( values ) {
      this.form.controls['initiatorId'].setValue(values);
      this.markSelectedFieldLabel(this.withdrawers[0], 'initiatorId');
    }
  }

  private getDepositors(url) {
    return this.httpClient.get<any[]>(environment.API_ENDPOINT + url);
  }

  setLookupProfile(profile) {
    this.markSelectedFieldLabel(profile, 'initiatorId');
    const profileType = profile['type'] === 'PERSON' ? 'people' : 'companies';
    this.profileStore$.dispatch(new fromStore.LoadProfileInfo({id: +profile.id, type: profileType}));
    this.profile = this.profileStore$.pipe(select(fromRoot.getProfileState));

    if ( profileType === 'people' || profileType === 'companies' ) {
      this.url = `${environment.API_ENDPOINT}profiles/${profileType}/${profile.id}/attachments/`;
    }

    this.operationCreateService.getProfile(profile.id).subscribe(profileApps => {
      this.profileData = profileApps;
    })
  }

  openAttachment(attachment) {
    if ( attachment.contentType && this.testIfImage(attachment.contentType) ) {
      this.imageUrl = this.url + attachment.id;
      this.opened = true;
    } else {
      window.open(this.url + attachment.id);
    }
  }

  testIfImage(name: string) {
    const re = new RegExp(/^image/);
    return re.test(name);
  }

  resetModal() {
    this.imageUrl = '';
  }

  getFileExtension(fileName: string) {
    return fileName.split('.').pop();
  }

  clearValues() {
    this.currency = null;
    this.balance = null;
    this.hasBalance = false;
    this.form.controls['savingId'].setValue(null);
    this.form.controls['profileId'].setValue(null);
  }

  useExistingProfile(value) {
    if ( value || this.isProfileExist ) {
      this.form.controls['initiatorId'].setValidators(Validators.required);
      this.form.controls['initiator'].clearValidators();
      this.form.controls['initiator'].setErrors(null);
      this.form.controls['initiator'].setValue(null);
    } else {
      this.form.controls['initiator'].setValidators(Validators.required);
      this.form.controls['initiatorId'].clearValidators();
      this.form.controls['initiatorId'].setErrors(null);
      this.form.controls['initiatorId'].setValue(null);
    }
  }

  handleConfirmModalVisibility(isVisible: boolean) {
    this.showConfirmModal = isVisible;
  }

  markSelectedFieldLabel(selectedData: any, fieldName: string) {
    if ( fieldName === 'profileId' || fieldName === 'initiatorId' ) {
      this.selectedFormFieldLabels[fieldName] = selectedData.name
    }
  }

  saveOperation() {
    this.showConfirmModal = false;
    this.isLoading = false;
    this.date = moment(this.form.controls['date'].value).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19);
    const operationCurrentAccountData = {
      id: this.accountId,
      amount: this.form.controls['amount'].value,
      date: this.date,
      description: this.form.controls['description'].value,
      profileId: this.form.controls['profileId'].value,
      initiatorId: this.form.controls['initiatorId'].value,
      initiator: this.form.controls['initiator'].value,
      isProfileExist: this.form.controls['isProfileExist'].value,
      autoPrint: this.form.controls['autoPrint'].value
    };

    const operationSavingAccountData = {
      id: this.accountId,
      amount: this.form.controls['amount'].value,
      date: this.date,
      description: this.form.controls['description'].value,
      profileId: this.form.controls['profileId'].value,
      savingId: this.form.controls['savingId'].value,
      initiatorId: this.form.controls['initiatorId'].value,
      initiator: this.form.controls['initiator'].value,
      isProfileExist: this.form.controls['isProfileExist'].value,
      autoPrint: this.form.controls['autoPrint'].value
    };

    if ( this.type === 'DEPOSIT_TO_CURRENT_ACCOUNT' ) {
      this.operationCreateService.createDeposit(this.tillId, operationCurrentAccountData)
        .subscribe(
          res => {
            if ( res.error ) {
              this.translate.get('CREATE_ERROR')
                .subscribe(
                  (response: string) => {
                    this.toastrService.error(res.error.message, response, environment.ERROR_TOAST_CONFIG);
                    this.isLoading = false;
                  });
            } else {
              if ( this.form.controls['autoPrint'].value ) {
                const objToSend = {
                  entityId: +res,
                  templateId: this.receiptFormId
                };
                setTimeout(() => {
                  this.printingFormService.downloadForm(objToSend, 'DEPOSIT_CA')
                    .subscribe(
                      resp => {
                        if ( resp.err ) {
                          this.translate.get('CREATE_ERROR')
                            .subscribe(
                              (response: string) => {
                                this.toastrService.error(resp.err, response, environment.ERROR_TOAST_CONFIG);
                                this.isLoading = false;
                              });
                        } else {
                          this.isLoading = false;
                          FileSaver.saveAs(resp, `${this.receiptFormLabel}.docx`)
                        }
                      })
                }, 500)
              }
              this.toastrService.clear();
              this.router.navigate(['/till', this.tillId, 'operations']);
              this.translate.get('DEPOSIT_SUCCESS')
                .subscribe(
                  (message: string) => {
                    this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
                  });
            }
          })
    } else if ( this.type === 'WITHDRAW_FROM_CURRENT_ACCOUNT' ) {
      this.operationCreateService.createWithdraw(this.tillId, operationCurrentAccountData)
        .subscribe(
          res => {
            if ( res.error ) {
              this.translate.get('CREATE_ERROR')
                .subscribe(
                  (response: string) => {
                    this.toastrService.error(res.error.message, response, environment.ERROR_TOAST_CONFIG);
                    this.isLoading = false;
                  });
            } else {
              if ( this.form.controls['autoPrint'].value ) {
                const objToSend = {
                  entityId: +res,
                  templateId: this.receiptFormId
                };
                setTimeout(() => {
                  this.printingFormService.downloadForm(objToSend, 'WITHDRAWAL_CA')
                    .subscribe(
                      resp => {
                        if ( resp.err ) {
                          this.translate.get('CREATE_ERROR')
                            .subscribe(
                              (response: string) => {
                                this.toastrService.error(res.error.message, response, environment.ERROR_TOAST_CONFIG);
                                this.isLoading = false;
                              });
                        } else {
                          this.isLoading = false;
                          FileSaver.saveAs(resp, `${this.receiptFormLabel}.docx`)
                        }
                      })
                }, 500)
              }
              this.toastrService.clear();
              this.router.navigate(['/till', this.tillId, 'operations']);
              this.translate.get('WITHDRAW_SUCCESS')
                .subscribe(
                  (message: string) => {
                    this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
                  });
            }
          })
    } else if ( this.type === 'DEPOSIT_TO_SAVING_ACCOUNT' ) {
      this.operationCreateService.createDepositSaving(this.tillId, operationSavingAccountData)
        .subscribe(
          res => {
            if ( res['error'] ) {
              this.translate.get('CREATE_ERROR')
                .subscribe(
                  (response: string) => {
                    this.toastrService.error(res.error.message, response, environment.ERROR_TOAST_CONFIG);
                    this.isLoading = false;
                  });
            } else {
              if ( this.form.controls['autoPrint'].value ) {
                const objToSend = {
                  entityId: +res,
                  templateId: this.receiptFormId
                };
                setTimeout(() => {
                  this.printingFormService.downloadForm(objToSend, 'TILL_CASH_RECEIPT')
                    .subscribe(
                      resp => {
                        if ( resp.err ) {
                          this.translate.get('CREATE_ERROR')
                            .subscribe(
                              (response: string) => {
                                this.toastrService.error(resp.err, response, environment.ERROR_TOAST_CONFIG);
                                this.isLoading = false;
                              });
                        } else {
                          this.isLoading = false;
                          FileSaver.saveAs(resp, `${this.receiptFormLabel}.docx`)
                        }
                      })
                }, 500)
              }
              this.toastrService.clear();
              this.router.navigate(['/till', this.tillId, 'operations']);
              this.translate.get('DEPOSIT_SUCCESS')
                .subscribe(
                  (message: string) => {
                    this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
                  });
            }
          })
    } else if ( this.type === 'WITHDRAW_FROM_SAVING_ACCOUNT' ) {
      this.operationCreateService.createWithdrawSaving(this.tillId, operationSavingAccountData)
        .subscribe(
          res => {
            if ( res['error'] ) {
              this.translate.get('CREATE_ERROR')
                .subscribe(
                  (response: string) => {
                    this.toastrService.error(res.error.message, response, environment.ERROR_TOAST_CONFIG);
                    this.isLoading = false;
                  });
            } else {
              if ( this.form.controls['autoPrint'].value ) {
                const objToSend = {
                  entityId: +res,
                  templateId: this.receiptFormId
                };
                setTimeout(() => {
                  this.printingFormService.downloadForm(objToSend, 'TILL_CASH_RECEIPT')
                    .subscribe(
                      resp => {
                        if ( resp.err ) {
                          this.translate.get('CREATE_ERROR')
                            .subscribe(
                              (response: string) => {
                                this.toastrService.error(resp.err, response, environment.ERROR_TOAST_CONFIG);
                                this.isLoading = false;
                              });
                        } else {
                          this.isLoading = false;
                          FileSaver.saveAs(resp, `${this.receiptFormLabel}.docx`)
                        }
                      })
                }, 500)
              }
              this.toastrService.clear();
              this.router.navigate(['/till', this.tillId, 'operations']);
              this.translate.get('WITHDRAW_SUCCESS')
                .subscribe(
                  (message: string) => {
                    this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
                  });
            }
          })
    }
    this.isLoading = true;
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
    this.operationCreateSub.unsubscribe();
  }
}

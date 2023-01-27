import { Component, OnDestroy, OnInit } from '@angular/core';
import { ILoanInfo } from '../../../../core/store/loans/loan';
import { select, Store } from '@ngrx/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { WriteOffService } from '../../shared/services/write-off.service';
import { environment } from '../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { ILoanAppState } from '../../../../core/store/loan-application/loan-application';
import { ActualizeLoanService } from '../../shared/services/actualize-loan.service';
import { Subscription } from 'rxjs';
import { ParseDateFormatService } from '../../../../core/services';
import { ReassignLoanService } from '../../shared/services/reassign-loan.service';
import { User } from '../../../../core/store';

const GROUP_LOAN_OPERATIONS = ['BATCH_REPAYMENT'];
const LOAN_OPERATIONS = ['REPAYMENT', 'OTHER_FEES', 'RESCHEDULE', 'WRITE_OFF', 'TOP_UP', 'ACTUALIZE_LOAN', 'PROVISIONING', 'REASSIGN_LOAN'];

@Component({
  selector: 'cbs-special-operations',
  templateUrl: 'special-operations.component.html',
  styleUrls: ['special-operations.component.scss']
})

export class SpecialOperationsComponent implements OnInit, OnDestroy {
  public writeOffForm: FormGroup;
  public userConfig = {
    url: `${environment.API_ENDPOINT}users/lookup`
  };
  public isOpenWriteOffModal = false;
  public arr = [];
  public breadcrumb = [];
  public breadcrumbPart: string;
  public loanDate: any;
  public isOpenActualize = false;
  public isOpenReassignLoan = false;
  public currentLoanOfficer: User;
  public loanOfficer = {};
  public isLoading: boolean;
  public profileType: any;
  public disabledOperationBtn = false;
  public loanType: any;
  public readOnly: false;
  public opened: boolean;
  public currentUser: any;
  public disabledReassignLoanBtn = true;

  private writeOffPrincipalValue: number;
  private writeOffInterestValue: number;
  private writeOffPenaltyValue: number;
  private loanId: number;
  private currentUserSub: Subscription;
  private routeSub: Subscription;
  private loanSub: Subscription;
  private loanApplicationSub: Subscription;

  constructor(private loanStore$: Store<ILoanInfo>,
              private router: Router,
              private translate: TranslateService,
              public route: ActivatedRoute,
              private toastrService: ToastrService,
              private writeOffService: WriteOffService,
              private actualizeLoanService: ActualizeLoanService,
              private reassignLoanService: ReassignLoanService,
              private parseDateFormatService: ParseDateFormatService,
              private store$: Store<fromRoot.State>) {
    this.currentUserSub = this.store$.pipe(select(fromRoot.getCurrentUserState))
      .subscribe(user => {
        if ( user.loaded && user.success && !user.error ) {
          this.currentUser = user;
        }
      });
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params.subscribe((params: { id, loanType }) => {
      if ( params && params.id ) {
        this.loanType = params.loanType;
      }
    });

    this.writeOffForm = new FormGroup({
      date: new FormControl(moment().format(environment.DATE_FORMAT_MOMENT), Validators.required),
      comment: new FormControl('', Validators.required),
      principal: new FormControl('', Validators.required),
      interest: new FormControl('', Validators.required),
      penalty: new FormControl('', Validators.required)
    });

    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loanState => {
        if ( Object.keys(loanState['loan']).length ) {
          const loan = loanState['loan'];
          this.currentLoanOfficer = loan['loanOfficer'];
          this.disabledOperationBtn = loan['status'] === 'CLOSED' || loan['status'] === 'WRITTEN_OFF';
          this.readOnly = loan['readOnly'];
          this.loanId = loan['id'];
          this.loanType = loan['profile']['type'].toLowerCase();
          if ( loanState['loaded'] && !loanState['error'] && loanState['success'] ) {
            this.profileType = loan['profile']['type'] === 'PERSON' ? 'people'
              : loan['profile']['type'] === 'COMPANY' ? 'companies' : 'groups';
            this.breadcrumbPart = this.profileType === 'groups' ? 'LOAN APPLICATION ' + this.loanId : loan['code'];
            this.breadcrumb = [
              {
                name: loan['profile']['name'],
                link: `/profiles/${this.profileType}/${loan['profile']['id']}/info`
              },
              {
                name: 'LOANS',
                link: '/loans'
              },
              {
                name: this.breadcrumbPart,
                link: ''
              },
              {
                name: 'OPERATIONS',
                link: ``
              }
            ];
          }

          this.arr = [
            {
              name: 'OTHER_FEES',
              route: `/loans/${this.loanId}/${this.loanType}/operations/other-fees`,
              icon: {collection: 'standard', name: 'client', className: 'client'},
              disabled: this.readOnly || (this.disabledOperationBtn || this.hasPermission('OTHER_FEE_CHARGE'))
            },
            {
              name: 'RESCHEDULE',
              route: `/loans/${this.loanId}/${this.loanType}/schedule/reschedule`,
              icon: {collection: 'standard', name: 'product_item', className: 'product-item'},
              disabled: (this.disabledOperationBtn || this.hasPermission('LOAN_RESCHEDULE')) || this.readOnly
            },
            {
              name: 'REPAYMENT',
              route: `/loans/${this.loanId}/${this.loanType}/schedule/repayment`,
              icon: {collection: 'standard', name: 'product_request', className: 'product-request'},
              disabled: (this.hasPermissionMakerChecker('MAKER_FOR_LOAN_REPAYMENT') || this.disabledOperationBtn) || this.readOnly
            },
            {
              name: 'BATCH_REPAYMENT',
              route: `/loans/${loan['loanApplicationId']}/${this.loanType}/schedule/group-repayment`,
              icon: {collection: 'standard', name: 'product_request', className: 'product-request'},
              disabled: (this.hasPermissionMakerChecker('MAKER_FOR_LOAN_REPAYMENT') || this.disabledOperationBtn) || this.readOnly
            },
            {
              name: 'WRITE_OFF',
              route: false,
              icon: {collection: 'standard', name: 'timesheet_entry', className: 'timesheet-entry'},
              disabled: (this.disabledOperationBtn || this.hasPermission('LOAN_WRITE_OFF')) || this.readOnly
            },
            {
              name: 'TOP_UP',
              route: `/loans/${this.loanId}/${this.loanType}/operations/top-up`,
              icon: {collection: 'standard', name: 'connected_apps', className: 'connected-apps'},
              disabled: this.readOnly || (this.disabledOperationBtn || this.hasPermission('TOP_UP'))
            },
            {
              name: 'ACTUALIZE_LOAN',
              route: false,
              icon: {collection: 'standard', name: 'announcement', className: 'announcement'},
              disabled: this.readOnly || (this.disabledOperationBtn || this.hasPermission('ACTUALIZE_LOAN'))
            },
            {
              name: 'PROVISIONING',
              route: `/loans/${this.loanId}/${this.loanType}/operations/provisioning`,
              icon: {collection: 'custom', name: 'custom41', className: 'custom41'},
              disabled: this.readOnly || (this.disabledOperationBtn || this.hasPermission('PROVISIONING'))
            },
            {
              name: 'REASSIGN_LOAN',
              route: false,
              icon: {collection: 'standard', name: 'avatar', className: 'avatar'},
              disabled: this.readOnly || (this.disabledOperationBtn || this.hasPermission('REASSIGN_LOAN'))
            }
          ];
          if ( this.profileType === 'groups' ) {
            this.arr = this.arr.filter(navItem => GROUP_LOAN_OPERATIONS.indexOf(navItem.name) >= 0);
          } else {
            this.arr = this.arr.filter(navItem => LOAN_OPERATIONS.indexOf(navItem.name) >= 0);
          }

          this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
            .subscribe((loanAppState: ILoanAppState) => {
              if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
                if ( !loanAppState.loanApplication['loanProduct']['topUpAllow'] ) {
                  this.arr.forEach(item => {
                    if ( item.name === 'TOP_UP' ) {
                      this.arr.splice(this.arr.indexOf(item), 1)
                    }
                  })
                }
              }
            });
        }
      });

    setTimeout(() => {
      this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  hasPermission(permission) {
    return this.currentUser['permissions'].some((a) => {
      if ( a['group'] === 'LOANS' ) {
        return !a['permissions'].includes(permission);
      }
    });
  }

  hasPermissionMakerChecker(permission) {
    return this.currentUser['permissions'].some((a) => {
      if ( a['group'] === 'MAKER_CHECKER' ) {
        return !a['permissions'].includes(permission);
      }
    });
  }

  cancel() {
    this.isOpenWriteOffModal = false;
    this.writeOffForm.reset();
  }

  submitWriteOff() {
    this.isLoading = true;
    this.isOpenWriteOffModal = false;
    const date = this.parseDateFormatService.parseDateValue(this.writeOffForm.value.date);
    this.writeOffForm.controls['date'].setValue(date);
    this.writeOffService.writeOff(this.loanId, this.writeOffForm.value)
      .subscribe(res => {
        if ( res.status === 200 ) {
          this.translate.get('SUCCESS').subscribe((translation: string) => {
            this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
            this.loanStore$.dispatch(new fromStore.LoadLoanInfo({id: this.loanId, loanType: this.loanType}));
          });
        } else {
          this.toastrService.clear();
          this.toastrService.error(res.message ? res.message : 'Error write off', null, environment.ERROR_TOAST_CONFIG);
        }
        this.writeOffForm.reset();
        this.isLoading = false;
      });
  }

  navigate(item) {
    if ( item.name === 'ACTUALIZE_LOAN' ) {
      this.openActualizeModal();
    } else if ( item.name === 'WRITE_OFF' ) {
      this.openWriteOffModal();
    } else if ( item.name === 'REASSIGN_LOAN' ) {
      this.openReassignLoanModal();
    } else {
      this.router.navigateByUrl(item.route);
    }
  }

  openWriteOffModal() {
    const date = moment().format(environment.DATE_FORMAT_MOMENT) + moment().format('THH:mm:ss');
    this.writeOffForm.controls['date'].setValue(date);
    this.calculateWriteOffValue(date);
    this.isOpenWriteOffModal = true;
  }

  calculateWriteOffValue(date) {
    if ( date ) {
      const writeOffDate = moment(this.writeOffForm.controls['date'].value)
        .format(environment.DATE_FORMAT_MOMENT) + moment().format('THH:mm:ss');
      this.writeOffForm.controls['date'].setValue(writeOffDate);
      this.writeOffService.calculateWriteOffValue(this.loanId, this.writeOffForm.value)
        .subscribe(
          (res: any) => {
            this.writeOffPrincipalValue = res.principal;
            this.writeOffInterestValue = res.interest;
            this.writeOffPenaltyValue = res.penalty;
            this.writeOffForm.controls['principal'].setValue(res.principal);
            this.writeOffForm.controls['interest'].setValue(res.interest);
            this.writeOffForm.controls['penalty'].setValue(res.penalty);
          },
          err => {
            this.toastrService.clear();
            this.toastrService.error(err.error.message, '', environment.ERROR_TOAST_CONFIG);
            this.isOpenWriteOffModal = false;
          });
    }
  }

  validateWriteOffValue(value, field) {
    if ( (field === 'principal' && value > this.writeOffPrincipalValue)
      || (field === 'interest' && value > this.writeOffInterestValue)
      || (field === 'penalty' && value > this.writeOffPenaltyValue) ) {
      this.calculateWriteOffValue(this.writeOffForm.controls['date'].value);
    }
  }

  openActualizeModal() {
    this.isOpenActualize = true;
    this.loanDate = moment().format(environment.DATE_FORMAT_MOMENT);
  }

  openReassignLoanModal() {
    this.isOpenReassignLoan = true;
  }

  reassignLoanModal() {
    this.opened = true;
    this.isOpenReassignLoan = false;
  }

  closeModal() {
    this.opened = false;
  }

  submitActualizeLoan() {
    this.isOpenActualize = false;
    this.isLoading = true;
    this.loanDate = this.parseDateFormatService.parseDateValue(this.loanDate);
    this.actualizeLoanService.actualizeLoan(this.loanId, this.loanDate).subscribe(res => {
      if ( res.error ) {
        this.toastrService.clear();
        this.toastrService.error(res.message, '', environment.ERROR_TOAST_CONFIG);
        this.isLoading = false;
      } else {
        this.translate.get('SUCCESS').subscribe((translation: string) => {
          this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.loanStore$.dispatch(new fromStore.LoadLoanInfo({id: this.loanId, loanType: this.loanType}));
        this.isLoading = false;
      }
    });
  }

  selectedUser(value) {
    this.disabledReassignLoanBtn = false;
    this.loanOfficer = value
  }

  setReassignLoan() {
    this.opened = false;
    this.isOpenReassignLoan = false;
    this.isLoading = true;
    this.reassignLoanService.reassignLoan({loanId: this.loanId, userId: this.loanOfficer['id']}).subscribe(res => {
      if ( res.error ) {
        this.toastrService.clear();
        this.toastrService.error(res.message, '', environment.ERROR_TOAST_CONFIG);
        this.isLoading = false;
      } else {
        this.translate.get('SUCCESS').subscribe((translation: string) => {
          this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.loanStore$.dispatch(new fromStore.LoadLoanInfo({id: this.loanId, loanType: this.loanType}));
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.loanSub.unsubscribe();
  }
}

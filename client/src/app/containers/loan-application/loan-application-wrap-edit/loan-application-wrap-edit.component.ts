import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ILoanAppFormState, IPayeeItem, } from '../../../core/store/loan-application';
import { LoanAppSideNavService } from '../shared/services';
import { Observable } from 'rxjs';
import { LoanAppFormExtraService } from '../shared/services';
import { ILoanAppState } from '../../../core/store/loan-application/loan-application';
import { LoanAppSubmitService } from '../shared/services';
import { IEntryFeeItem } from '../../../core/store/loan-application/loan-application-form';
import { ILoanAppUpdateState } from '../../../core/store/loan-application/loan-application-update';
import * as Utils from '../../../core/store/loan-application/loan-application-form/loan-application.utils';
import { Subscription } from 'rxjs/Rx';
import { ParseDateFormatService } from '../../../core/services';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-application-wrap-edit',
  templateUrl: 'loan-application-wrap-edit.component.html'
})

export class LoanAppWrapEditComponent implements OnInit, OnDestroy {
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public loanNavConfig = [];
  public loanAppFormState: ILoanAppFormState;
  public formStatus: Observable<boolean>;
  public breadcrumbLinks = [];
  public loanAppStatus: string;
  public oldAppStatus: string;
  public opened = false;
  public text: any;
  public loanApplication: any;
  public showHeader = true;
  public submitService = this.loanAppSubmitService;
  public loanAppId: number;
  public netAmount: number;

  private canDeactivateGuard = false;
  private routeSub: Subscription;
  private loanApplicationSub: Subscription;
  private loanAppFormStateSub: Subscription;
  private updateLoanAppSub: Subscription;
  private loanAppDataSub: Subscription;

  constructor(private updateLoanAppStore$: Store<ILoanAppUpdateState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2,
              private parseDateFormatService: ParseDateFormatService,
              private loanAppFormStore$: Store<ILoanAppFormState>,
              private loanAppFormStatusService: LoanAppFormExtraService,
              private loanAppSideNavService: LoanAppSideNavService,
              private loanApplicationStore$: Store<ILoanAppState>,
              private route: ActivatedRoute,
              private loanAppSubmitService: LoanAppSubmitService,
              private loanAppExtraService: LoanAppFormExtraService) {
  }

  ngOnInit() {
    this.formStatus = this.loanAppFormStatusService.formStatusSourceChanged$;

    this.loanAppFormStore$.dispatch(new fromStore.FormReset());
    this.loanAppFormStore$.dispatch(new fromStore.SetRoute('edit'));

    this.updateLoanAppSub = this.store$.pipe(select(fromRoot.getLoanApplicationUpdateState)).subscribe(
      (state: ILoanAppUpdateState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.goToViewLoanDetails(+state.response.id);
        } else if ( state.loaded && !state.success && state.error ) {
          this.disableSubmitBtn(false);
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState();
        }
      });

    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if ( params && params.id ) {
        this.loanApplicationStore$.dispatch(new fromStore.LoadLoanApplication(params.id));
      }
    });

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState)).subscribe(
      (loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          this.loanApplication = loanAppState.loanApplication;
          this.loanAppId = loanAppState.loanApplication['id'];
          this.breadcrumbLinks = [
            {
              name: 'LOAN_APPLICATIONS',
              link: '/loan-applications'
            },
            {
              name: this.loanApplication.code,
              link: ''
            },
            {
              name: 'EDIT',
              link: ''
            }
          ];
          this.loanAppStatus = this.oldAppStatus = loanAppState.loanApplication['status'];
          this.loanNavConfig = this.loanAppSideNavService.getNavList('loan-applications', {
            editMode: true,
            createMode: false,
            loanAppId: this.loanApplication.id,
            status: this.loanApplication['status']
          });

          this.netAmount = this.loanApplication.amounts.reduce(function (prev, cur) {
            return prev + cur.amount;
          }, 0);

          const formData = {
            amounts: this.netAmount,
            code: this.loanApplication.code,
            disbursementDate: this.loanApplication.disbursementDate,
            preferredRepaymentDate: this.loanApplication.preferredRepaymentDate,
            gracePeriod: this.loanApplication.gracePeriod,
            installments: this.loanApplication.installments,
            interestRate: this.loanApplication.interestRate,
            creditLine: this.loanApplication.creditLineInfoDto ? this.loanApplication.creditLineInfoDto : '',
            creditLineId: this.loanApplication.creditLineInfoDto ? this.loanApplication.creditLineInfoDto.id : '',
            loanProduct: this.loanApplication.loanProduct,
            loanProductId: this.loanApplication.loanProduct.id,
            maturity: this.loanApplication.maturity,
            maturityDate: this.loanApplication.maturityDate,
            profile: this.loanApplication.profile,
            profileId: this.loanApplication.profile.id,
            userId: this.loanApplication.profile.loanOfficer.id,
            scheduleType: this.loanApplication.scheduleType,
            scheduleBasedType: this.loanApplication.scheduleBasedType,
            currencyId: this.loanApplication.currencyId,
            currencyName: this.loanApplication.currencyName
          };

          this.loanAppFormStore$.dispatch(new fromStore.Populate({
              data: formData,
              total: this.loanApplication.amount,
              valid: true,
              creditLine: this.loanApplication.creditLineInfoDto,
              loanProduct: this.loanApplication.loanProduct,
              payees: Utils.addLocalId(this.loanApplication.payees),
              entryFees: this.formatEntryFees(this.loanApplication.entryFees),
              loanAppId: this.loanApplication.id,
              members: this.loanApplication.amounts
            }
          ));
        } else if ( loanAppState.loaded && !loanAppState.success && loanAppState.error ) {
          this.toastrService.error(`ERROR: ${loanAppState.errorMessage}`, '', environment.ERROR_TOAST_CONFIG);
          this.resetState();
          this.router.navigateByUrl('loan-applications');
        }
      });

    this.loanAppDataSub = this.loanAppExtraService.loanAppStateSourceChange$.subscribe(data => {
      this.loanAppFormState = data;
    });

    this.loanAppFormStateSub = this.store$.pipe(select(fromRoot.getLoanAppFormState))
      .subscribe((state: ILoanAppFormState) => {
        if ( state.loaded ) {
          this.showHeader = !(state.state === 'attachments'
            || state.state === 'guarantors'
            || state.state === 'collaterals');
        }
      });
  }

  canDeactivate() {
    if ( !this.canDeactivateGuard && this.loanAppFormState.changed ) {
      this.opened = true;
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.updateLoanAppSub.unsubscribe();
    this.loanAppFormStateSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.loanAppDataSub.unsubscribe();
    this.loanAppFormStore$.dispatch(new fromStore.FormReset());
    this.loanApplicationStore$.dispatch(new fromStore.ResetLoanApplication());
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.updateLoanAppStore$.dispatch(new fromStore.UpdateLoanApplicationReset());
  }

  goToViewLoanDetails(id) {
    this.router.navigate(['/loan-applications', `${id}`]);
  }

  formatEntryFees(entryFees: any[]): IEntryFeeItem[] {
    const formatted = [];
    entryFees.map(fee => {
      formatted.push({
        id: fee.entryFee.id,
        name: fee.entryFee.name,
        amount: fee.amount,
        code: fee.entryFee.name.toLowerCase().trim().split(' ').join('_').replace(/\'/g, ''),
        edited: false,
        maxValue: fee.entryFee.maxValue,
        minValue: fee.entryFee.minValue,
        percentage: fee.entryFee.percentage,
        minLimit: fee.entryFee.minLimit,
        maxLimit: fee.entryFee.maxLimit,
        validate: true
      });
    });
    return formatted;
  }

  submitForm() {
    if ( this.loanAppFormState.valid ) {
      this.disableSubmitBtn(true);
      const entryFees = [];
      const payees = [];
      const membersAmount = [];

      if ( this.loanAppFormState.entryFees && this.loanAppFormState.entryFees.length ) {
        this.loanAppFormState.entryFees.map(fee => {
          entryFees.push({
            entryFeeId: fee.id,
            amount: fee.amount
          });
        });
      }

      if ( this.loanAppFormState.payees && this.loanAppFormState.payees.length ) {
        this.loanAppFormState.payees.map((payee: IPayeeItem) => {
          payees.push({
            payeeId: payee.payeeId,
            amount: payee.amount,
            plannedDisbursementDate: payee.plannedDisbursementDate,
            description: payee.description
          });
        });
      }

      if ( this.loanAppFormState.data.members && this.loanAppFormState.data.members.length ) {
        this.loanAppFormState.data.members.map(member => {
          let key;
          for (key in member) {
            membersAmount.push({
              memberId: key,
              amount: member[key]
            });
          }

        });
      } else {
        membersAmount.push({
          memberId: this.loanAppFormState.data.profileId,
          amount: this.loanAppFormState.data.amounts
        });
      }

      const scheduleBasedType = this.loanAppFormState.data.scheduleBasedType
        ? this.loanAppFormState.data.scheduleBasedType
        : this.loanAppFormState.data.loanProduct.scheduleBasedType;

      const objectToSend = Object.assign({}, {
        amounts: membersAmount,
        disbursementDate: this.parseDateFormatService.parseDateValue(this.loanAppFormState.data.disbursementDate),
        preferredRepaymentDate: this.parseDateFormatService.parseDateValue(this.loanAppFormState.data.preferredRepaymentDate),
        gracePeriod: this.loanAppFormState.data.gracePeriod,
        interestRate: this.loanAppFormState.data.interestRate,
        creditLineId: this.loanAppFormState.data.creditLineId,
        loanProductId: this.loanAppFormState.data.loanProductId,
        maturity: this.loanAppFormState.data.maturity,
        maturityDate: this.parseDateFormatService.parseDateValue(this.loanAppFormState.data.maturityDate),
        profileId: this.loanAppFormState.data.profileId,
        userId: this.loanAppFormState.data.userId,
        scheduleType: this.loanAppFormState.data.scheduleType,
        scheduleBasedType: scheduleBasedType,
        currencyId: this.loanAppFormState.data.currencyId,
        payees: payees,
        entryFees: entryFees
      });

      this.updateLoanAppStore$.dispatch(new fromStore.UpdateLoanApplication({
        data: objectToSend,
        loanAppId: this.loanAppId
      }));
    }
  }

  previewSchedule() {
    this.router.navigate(['/loan-applications', this.loanAppId, 'edit', 'schedule']);
  }
}

import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';

import { ILoanAppCreateState, ILoanAppFormState, IPayeeItem } from '../../../core/store/loan-application';
import { LoanAppFormExtraService, LoanAppSideNavService } from '../shared/services';
import { Observable, Subscription } from 'rxjs';
import { ParseDateFormatService } from '../../../core/services';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom41',
  name: 'custom41'
};

@Component({
  selector: 'cbs-loan-application-wrap-create',
  templateUrl: 'loan-application-wrap-create.component.html'
})

export class LoanAppWrapCreateComponent implements OnInit, OnDestroy {
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public loanNavConfig = [];
  public isLoading = false;
  public showButtonPreview = true;
  public loanAppFormState: ILoanAppFormState;
  public formStatus: Observable<boolean>;
  public breadcrumb = [
    {
      name: 'LOAN_APPLICATIONS',
      link: '/loan-applications'
    },
    {
      name: 'LOAN_APPLICATIONS_ADD',
      link: '/loan-applications/create'
    }
  ];

  private createLoanAppSub: Subscription;
  private loanAppFormSub: Subscription;

  constructor(private createLoanAppStore$: Store<ILoanAppCreateState>,
              private router: Router,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private loanAppFormExtraService: LoanAppFormExtraService,
              private renderer2: Renderer2,
              private store$: Store<fromRoot.State>,
              private loanAppFormStore$: Store<ILoanAppFormState>,
              private loanAppSideNavService: LoanAppSideNavService,
              private parseDateFormatService: ParseDateFormatService) {
  }

  ngOnInit() {
    this.loanNavConfig = this.loanAppSideNavService.getNavList('loan-applications', {
      editMode: false,
      createMode: true,
      profileType: this.showButtonPreview === true ? 'GROUP' : 'PERSON'
    });

    this.formStatus = this.loanAppFormExtraService.formStatusSourceChanged$;
    this.loanAppFormStore$.dispatch(new fromStore.FormReset());
    this.loanAppFormStore$.dispatch(new fromStore.SetRoute('create'));

    this.loanAppFormSub = this.loanAppFormExtraService.loanAppStateSourceChange$.subscribe(
      (loanAppFormState: ILoanAppFormState) => {
        this.loanAppFormState = loanAppFormState;
        if (this.loanAppFormState.data.members) {
          this.loanAppFormState.data.members.length > 1 ? this.showButtonPreview = true : this.showButtonPreview = false;
          this.loanNavConfig = this.loanAppSideNavService.getNavList('loan-applications', {
            editMode: false,
            createMode: true,
            profileType: this.showButtonPreview === true ? 'GROUP' : 'PERSON'
          });
        }
      });

    this.createLoanAppSub = this.store$.select(fromRoot.getLoanApplicationCreateState).subscribe(
      (state: ILoanAppCreateState) => {
        if (state.loaded && state.success && !state.error) {
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.goToViewLoanDetails(+state.response.id);
        } else if (state.loaded && !state.success && state.error) {
          this.disableSubmitBtn(false);
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState();
        }
      });
  }

  ngOnDestroy() {
    this.createLoanAppSub.unsubscribe();
    this.loanAppFormSub.unsubscribe();
    this.loanAppFormStore$.dispatch(new fromStore.FormReset());
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.createLoanAppStore$.dispatch(new fromStore.CreateLoanApplicationReset());
    this.isLoading = false;
  }

  goToViewLoanApps() {
    this.router.navigate(['/loan-applications']);
  }

  goToViewLoanDetails(id) {
    this.router.navigate(['loan-applications', `${id}`]);
  }

  submitForm() {
    if (this.loanAppFormState.valid) {
      this.isLoading = true;
      this.disableSubmitBtn(true);
      const entryFees = [];
      const payees = [];
      const membersAmount = [];

      if (this.loanAppFormState.entryFees.length) {
        this.loanAppFormState.entryFees.map(fee => {
          entryFees.push({
            entryFeeId: fee['id'],
            amount: fee['amount']
          });
        });
      }

      if (this.loanAppFormState.payees.length) {
        this.loanAppFormState.payees.map((payee: IPayeeItem) => {
          payees.push({
            payeeId: payee.payee.id,
            amount: payee.amount,
            plannedDisbursementDate: payee.plannedDisbursementDate,
            description: payee.description
          });
        });
      }

      if (this.loanAppFormState.data.members.length) {
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

      const objectToSend = Object.assign({}, {
        amounts: membersAmount,
        disbursementDate: this.parseDateFormatService.parseDateValue(this.loanAppFormState.data['disbursementDate']),
        preferredRepaymentDate: this.parseDateFormatService.parseDateValue(this.loanAppFormState.data['preferredRepaymentDate']),
        gracePeriod: this.loanAppFormState.data['gracePeriod'],
        interestRate: this.loanAppFormState.data['interestRate'],
        creditLineId: this.loanAppFormState.data['creditLineId'],
        loanProductId: this.loanAppFormState.data['loanProductId'],
        maturityDate: this.parseDateFormatService.parseDateValue(this.loanAppFormState.data['maturityDate']),
        maturity: this.loanAppFormState.data['maturity'],
        profileId: this.loanAppFormState.data['profileId'],
        userId: this.loanAppFormState.data['userId'],
        scheduleType: this.loanAppFormState.data['scheduleType'],
        scheduleBasedType: this.loanAppFormState.data['scheduleBasedType'],
        currencyId: this.loanAppFormState.data['currencyId'],
        payees: payees,
        entryFees: entryFees
      });
      this.createLoanAppStore$.dispatch(new fromStore.CreateLoanApplication(objectToSend));
    }
  }

  previewSchedule() {
    this.router.navigate(['/loan-applications', 'create', 'schedule']);
  }
}

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import {
  ILoanAppState,
  ILoanAppFormState
} from '../../../core/store/loan-application';
import { environment } from '../../../../environments/environment';
import {
  IEntryFeeItem
} from '../../../core/store/loan-application/loan-application-form/loan-application-form.interfaces';
import * as Utils from '../../../core/store/loan-application/loan-application-form/loan-application.utils';
import { LoanAppStatus } from '../../../core/loan-application-status.enum';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ILoanAppMakerCheckerDisburseState, LoanAppMakerCheckerDisburseService } from '../../../core/store';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom41',
  name: 'custom41'
};

@Component({
  selector: 'cbs-loan-app-maker-checker-wrap',
  templateUrl: 'loan-app-maker-checker-wrap.component.html',
  styleUrls: ['loan-app-maker-checker-wrap.component.scss']
})
export class LoanAppMakerCheckerWrapComponent implements OnInit, OnDestroy {
  public LoanAppStatus = LoanAppStatus;
  public loanAppStatus: string;
  public oldAppStatus: string;
  public opened = false;
  public text: any;
  public breadcrumb = [];
  public svgData = SVG_DATA;
  public isLoading = false;
  public loanApplication: any;
  public approveRequest = false;
  public deleteRequest = false;
  public loanAppId: number;
  public loanAppMakerCheckerId: any;

  private routeSub: any;
  private loanApplicationSub: any;
  private loanAppFormStateSub: any;
  private loanApplicationMakerCheckerSub: any;

  constructor(public loanAppMakerCheckerDisburseStateStore$: Store<ILoanAppMakerCheckerDisburseState>,
              public loanApplicationStore$: Store<ILoanAppState>,
              public route: ActivatedRoute,
              public loanAppFormStore$: Store<ILoanAppFormState>,
              public toastrService: ToastrService,
              public translate: TranslateService,
              public store$: Store<fromRoot.State>,
              public loanAppMakerCheckerDisburseService: LoanAppMakerCheckerDisburseService,
              public router: Router) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if ( params && params.id ) {
        this.loanAppMakerCheckerId = params.id;
        this.loanAppMakerCheckerDisburseStateStore$.dispatch(new fromStore.LoadLoanAppMakerCheckerDisburse(params.id));
      }
    });

    setTimeout(() => {
      this.loanApplicationMakerCheckerSub = this.store$.pipe(select(fromRoot.getLoanAppMakerCheckerDisburseState))
        .subscribe(
          (loanAppState: ILoanAppMakerCheckerDisburseState) => {
            if ( loanAppState.loaded && loanAppState.success ) {
              this.loanAppId = loanAppState.loanApplication['id'];
              this.loanApplicationStore$.dispatch(new fromStore.LoadLoanApplication(this.loanAppId));
            }
          });

      this.loanApplicationSub = this.loanApplicationStore$.pipe(select(fromRoot.getLoanApplicationState)).subscribe(
        (loanAppState: ILoanAppState) => {
          if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
            this.loanApplication = loanAppState.loanApplication;
            this.loanAppStatus = this.oldAppStatus = loanAppState.loanApplication['status'];
            const formData = {
              amounts: this.loanApplication.amounts,
              code: this.loanApplication.code,
              disbursementDate: this.loanApplication.disbursementDate,
              preferredRepaymentDate: this.loanApplication.preferredRepaymentDate,
              gracePeriod: this.loanApplication.gracePeriod,
              installments: this.loanApplication.installments,
              interestRate: this.loanApplication.interestRate,
              loanProduct: this.loanApplication.loanProduct,
              loanProductId: this.loanApplication.loanProduct.id,
              maturity: this.loanApplication.maturity,
              profile: this.loanApplication.profile,
              profileId: this.loanApplication.profile.id,
              scheduleType: this.loanApplication.scheduleType,
              currencyId: this.loanApplication.currencyId,
              currencyName: this.loanApplication.currencyName
            };
            this.loanAppFormStore$.dispatch(new fromStore.Populate({
                data: formData,
                total: this.loanApplication.amounts,
                valid: true,
                loanProduct: this.loanApplication.loanProduct,
                payees: Utils.addLocalId(this.loanApplication.payees),
                entryFees: this.formatEntryFees(this.loanApplication.entryFees),
                loanAppId: this.loanApplication.id
              }
            ));
            this.isLoading = false;
          } else if ( loanAppState.loaded && !loanAppState.success && loanAppState.error ) {
            this.toastrService.error(`ERROR: ${loanAppState.errorMessage}`, '', environment.ERROR_TOAST_CONFIG);
            this.resetState();
            this.isLoading = false;
            this.router.navigateByUrl('loan-applications');
          }
        });

      this.loanAppFormStateSub = this.store$.pipe(select(fromRoot.getLoanAppFormState)).subscribe(
        (state: ILoanAppFormState) => {
          if ( state.loaded && state.valid ) {
            this.breadcrumb = state.breadcrumb;
          }
        });
    }, 300);
  }

  resetState() {
    this.loanAppMakerCheckerDisburseStateStore$.dispatch(new fromStore.ResetLoanAppMakerCheckerDisburse());
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

  approveLoanProductRequest() {
    this.loanAppMakerCheckerDisburseService.approveMakerChecker(this.loanAppMakerCheckerId)
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

  deleteLoanProductRequest() {
    this.loanAppMakerCheckerDisburseService.deleteMakerChecker(this.loanAppMakerCheckerId)
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

  ngOnDestroy() {
    this.loanAppFormStateSub.unsubscribe();
    this.loanApplicationMakerCheckerSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.loanAppMakerCheckerDisburseStateStore$.dispatch(new fromStore.ResetLoanAppMakerCheckerDisburse());
    this.loanAppFormStore$.dispatch(new fromStore.FormReset());
  }

  formatEntryFees(entryFees: any[]): IEntryFeeItem[] {
    const formatted = [];
    entryFees.map(fee => {
      formatted.push({
        id: fee.entryFee.id,
        name: fee.entryFee.name,
        amount: fee.amount,
        code: fee.entryFee.name.toLowerCase().trim().split(' ').join('_').replace(/\'/g, ''),
        edited: false
      });
    });
    return formatted;
  }
}

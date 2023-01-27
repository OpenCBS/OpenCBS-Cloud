import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { LoanAppSideNavService } from '../shared/services/loan-app-side-nav.service';
import { environment } from '../../../../environments/environment';
import { LoanAppSubmitService } from '../shared/services/loan-app-submit.service';
import {
  IEntryFeeItem
} from '../../../core/store/loan-application/loan-application-form/loan-application-form.interfaces';
import * as Utils from '../../../core/store/loan-application/loan-application-form/loan-application.utils';
import { LoanAppStatus } from '../../../core/loan-application-status.enum';
import { Subscription } from 'rxjs';
import { endsWith } from 'lodash';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-application-wrap',
  templateUrl: 'loan-application-wrap.component.html',
  styles: [`.slds-progress { margin-top: 18px }`]
})
export class LoanAppWrapComponent implements OnInit, OnDestroy {
  public LoanAppStatus = LoanAppStatus;
  public loanAppStatus: string;
  public oldAppStatus: string;
  public opened = false;
  public text: any;
  public breadcrumb = [];
  public svgData = SVG_DATA;
  public isLoading = false;
  public loanNavConfig = [];
  public loanApplication: any;
  public showHeader = true;
  public submitService = this.loanAppSubmitService;
  public readOnly = false;
  public currentRoute: string;
  public progressValue: any;

  public routeSub: Subscription;
  public loanApplicationSub: Subscription;
  public loanAppFormStateSub: Subscription;

  constructor(public loanApplicationStore$: Store<ILoanAppState>,
              public route: ActivatedRoute,
              public loanAppFormStore$: Store<ILoanAppFormState>,
              public loanAppSideNavService: LoanAppSideNavService,
              public toastrService: ToastrService,
              public translate: TranslateService,
              public store$: Store<fromRoot.State>,
              public loanAppSubmitService: LoanAppSubmitService,
              public router: Router) {
    this.router.events.subscribe((url: any) => {
      if ( url && url.url ) {
        this.currentRoute = endsWith(url.url, 'schedule') ? 'schedule' : '';
      }
    });
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if ( params && params.id ) {
        this.loanApplicationStore$.dispatch(new fromStore.LoadLoanApplication(params.id));
      }
    });

    this.loanApplicationSub = this.loanApplicationStore$.pipe(select(fromRoot.getLoanApplicationState)).subscribe(
      (loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          this.loanApplication = loanAppState.loanApplication;
          this.readOnly = this.loanApplication.readOnly;
          this.loanAppStatus = this.oldAppStatus = loanAppState.loanApplication['status'];
          switch (this.loanAppStatus) {
            case 'IN_PROGRESS':
              this.progressValue = 25 + '%';
              break;
            case 'PENDING':
              this.progressValue = 50 + '%';
              break;
            case 'APPROVED':
              this.progressValue = 75 + '%';
              break;
            default:
              this.progressValue = 100 + '%';
          }

          const formData = {
            amounts: this.loanApplication.amounts,
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
            scheduleType: this.loanApplication.scheduleType,
            currencyId: this.loanApplication.currencyId,
            currencyName: this.loanApplication.currencyName
          };
          this.loanAppFormStore$.dispatch(new fromStore.Populate({
              data: formData,
              total: this.loanApplication.amounts,
              valid: true,
              loanProduct: this.loanApplication.loanProduct,
              creditLine: this.loanApplication.creditLineInfoDto,
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
          this.loanNavConfig = this.loanAppSideNavService.getNavList('loan-applications', {
            loanAppId: this.loanApplication['id'],
            editMode: false,
            createMode: false,
            status: this.loanApplication['status'],
            profileType: this.loanApplication.profile.type
          });

          this.showHeader = !(state.state === 'attachments'
            || state.state === 'guarantors'
            || state.state === 'collaterals');
        }
      });
  }

  resetState() {
    this.loanApplicationStore$.dispatch(new fromStore.ResetLoanApplication());
  }

  ngOnDestroy() {
    this.loanAppFormStateSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.loanApplicationStore$.dispatch(new fromStore.ResetLoanApplication());
    this.loanAppFormStore$.dispatch(new fromStore.FormReset());
  }

  openModal(text) {
    this.text = text;
    this.opened = true;
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

  closeModal() {
    this.opened = false;
  }
}

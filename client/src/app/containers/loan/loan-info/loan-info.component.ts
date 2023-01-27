import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ILoanAppState, ILoanInfo } from '../../../core/store';
import { ActivatedRoute, Router } from '@angular/router';
import { PayeeFormModalComponent } from '../../../shared/components/payee-form-modal/payee-form-modal.component';
import { LoanPayeeService } from './service/loan-payees.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'cbs-loan-info',
  templateUrl: 'loan-info.component.html',
  styleUrls: ['loan-info.component.scss']
})

export class LoanInfoComponent implements OnInit, OnDestroy {
  @ViewChild(PayeeFormModalComponent, {static: false}) payeeFormComponent: PayeeFormModalComponent;
  public loanApp: any;
  public loanApplicationState: any;
  public breadcrumbPart: string;
  public entryFees: any;
  public totalEntryFees = 0;
  public isOpen = false;
  public breadcrumb = [];
  public members = [];
  public isVisible = false;
  public selectedPayeeId: any;
  public isLoading: any;
  public loanProfile: any;
  public profileType: any;

  public loan: Observable<ILoanInfo>;
  public routeSub: Subscription;
  private loanApplicationSub: Subscription;
  private loanInfoSub: Subscription;

  constructor(private loanStore$: Store<ILoanInfo>,
              private store$: Store<fromRoot.State>,
              private loanPayeeService: LoanPayeeService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              public route: ActivatedRoute,
              private loanApplicationStore$: Store<ILoanAppState>,
              private router: Router) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params.subscribe((params: { id, loanType }) => {
      if ( params && params.id ) {
        this.loanStore$.dispatch(new fromStore.LoadLoanInfo({id: params.id, loanType: params.loanType}));
      }
    });

    this.loan = this.store$.pipe(select(fromRoot.getLoanInfoState));
    this.loanInfoSub = this.store$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loan => {
        if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
          const loanId = loan['loan']['loanApplicationId'];
          this.members = loan['loan']['members'];
          this.loanProfile = loan['loan']['profile'];
          this.profileType = this.loanProfile['type'] === 'PERSON' ? 'people'
            : this.loanProfile['type'] === 'COMPANY' ? 'companies'
              : 'groups';
          this.breadcrumbPart = this.profileType === 'groups' ? 'LOAN APPLICATION ' + loanId : loan['loan']['code'];

          this.breadcrumb = [
            {
              name: this.loanProfile['name'],
              link: `/profiles/${this.profileType}/${this.loanProfile['id']}/info`
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
              name: 'INFORMATION',
              link: ''
            }
          ];
        }
      });

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          this.loanApplicationState = loanAppState;
          this.loanApp = loanAppState.loanApplication;
          this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
          if ( !!this.loanApp.entryFees.length ) {
            this.totalEntryFees = this.getTotal(this.loanApp.entryFees);
          }
        }
      });
  }

  goToProfile() {
    this.router.navigate(['/profiles', this.profileType, this.loanProfile['id'], 'info']);
  }

  goToLoanApplication() {
    this.router.navigate(['/loan-applications', this.loanApp.id, 'info']);
  }

  openAddPayeeModal() {
    this.payeeFormComponent.openCreateModal();
  }

  submitPayee(payee) {
    this.isLoading = true;
    this.loanPayeeService.addPayee(this.loanApp['id'], payee)
      .subscribe(res => {
        if ( res.status !== 200 ) {
          this.toastrService.clear();
          this.toastrService.error(res.message, '', environment.ERROR_TOAST_CONFIG);
          this.isLoading = false;
        } else {
          this.loanApplicationStore$.dispatch(new fromStore.LoadLoanApplication(this.loanApp['id']));
          this.toastrService.clear();
          this.translate.get('PAYEE_ADD_SUCCESS')
            .subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
          this.isLoading = false;
        }
      });
  }

  showConfirmPopup(loanAppPayee) {
    this.isVisible = true;
    this.selectedPayeeId = loanAppPayee['id'];
  }

  deleteCurrentPayee() {
    this.isLoading = true;
    this.loanPayeeService.deletePayee(this.loanApp['id'], this.selectedPayeeId)
      .subscribe(res => {
        if ( res.status !== 200 ) {
          this.toastrService.clear();
          this.toastrService.error(res.message, '', environment.ERROR_TOAST_CONFIG);
          this.isLoading = false;
        } else {
          this.loanApplicationStore$.dispatch(new fromStore.LoadLoanApplication(this.loanApp['id']));
          this.translate.get('DELETE_SUCCESS')
            .subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
          this.isLoading = false;
        }
      });
  }

  closeConfirmPopup() {
    this.isVisible = false;
  }

  getTotal(data = []) {
    let total = 0;
    if ( data && data['length'] ) {
      data.map((item) => {
        total += item.amount;
      });
    }
    return total;
  }

  openEntryFees() {
    this.isOpen = true;
  }

  ngOnDestroy() {
    this.loanInfoSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
    this.routeSub.unsubscribe();
  }
}

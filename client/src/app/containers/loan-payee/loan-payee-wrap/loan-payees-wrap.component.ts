import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import * as fromStore from '../../../core/store';
import * as fromRoot from '../../../core/core.reducer';
import { LoanPayeeUpdateService } from '../../../core/store';
import { ILoanPayeeUpdateState } from '../../../core/store/loan-payees/loan-payee-update';
import { LoanPayeesSideNavService } from '../shared/services';
import { ILoanPayee } from '../../../core/store/loan-payees/loan-payee';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'standard', class: 'task', name: 'task'};

@Component({
  selector: 'cbs-loan-payees-wrap',
  templateUrl: 'loan-payees-wrap.component.html',
  styleUrls: ['loan-payees-wrap.component.scss']
})

export class LoanPayeesWrapComponent implements OnInit, OnDestroy {
  public loanPayeeStatus: string;
  public svgData = SVG_DATA;
  public payeeId: number;
  public loanAppId: number;
  public loanPayee: any;
  public profileType: any;
  public text: any;
  public breadcrumbLinks = [
    {
      name: 'PAYEES',
      link: '/payees'
    }
  ];
  public dateNow = moment().format(environment.DATE_FORMAT_MOMENT);
  public showRefund = false;
  public loanPayeeLoaded = false;
  public isLoading = false;
  public payee: any;
  public openedDisburse = false;
  public openedRefund = false;
  public form: FormGroup;
  public formRefund: FormGroup;
  public breadcrumb: any;
  public loan: any;
  public loanPayeeNavConfig: any;

  private routeSub: Subscription;
  private payeeSub: Subscription;
  private loanPayeeUpdateSub: Subscription;
  private firstChildRouteSub: Subscription;

  constructor(public loanPayeesSideNavService: LoanPayeesSideNavService,
              public translate: TranslateService,
              private loanPayeeUpdateService: LoanPayeeUpdateService,
              private route: ActivatedRoute,
              private loanPayeeStore$: Store<ILoanPayee>,
              private loanPayeeUpdateStore$: Store<ILoanPayeeUpdateState>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private router: Router) {
    this.form = new FormGroup({
      disbursementDate: new FormControl('', Validators.required),
      chequeNumber: new FormControl('', Validators.required),
    });

    this.formRefund = new FormGroup({
      disbursementDate: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if ( params && params.id ) {
        this.payeeId = params.id;
        this.store$.dispatch(new fromStore.LoadLoanPayee(params.id));
      }
    });

    this.payeeSub = this.store$.pipe(select(fromRoot.getLoanPayeeState)).subscribe(
      (loanPayeeState: ILoanPayee) => {
        if ( loanPayeeState.success && loanPayeeState.loaded && loanPayeeState['payee'] ) {
          this.loanPayee = loanPayeeState['payee'];
          this.loanPayeeLoaded = true;
          this.loanPayeeStatus = loanPayeeState['payee']['status'];
          this.breadcrumbLinks = loanPayeeState['breadcrumb'];
          this.payeeId = this.loanPayee['id'];
          this.loanAppId = this.loanPayee['loanApplicationId'];
          this.loanPayeeNavConfig = this.loanPayeesSideNavService.getNavList('payees', {
            payeeId: this.loanPayee['id'],
            status: this.loanPayeeStatus
          });
          this.isLoading = false;
        } else if ( loanPayeeState.loaded && !loanPayeeState.success && loanPayeeState.error ) {
          this.toastrService.error(`ERROR: ${loanPayeeState.errorMessage}`, '', environment.ERROR_TOAST_CONFIG);
          this.resetState();
          this.isLoading = false;
        }
      }
    );

    this.loanPayeeUpdateSub = this.store$.pipe(select(fromRoot.getLoanPayeeUpdateState))
      .subscribe((loanPayeeUpdateState: ILoanPayeeUpdateState) => {
        if ( loanPayeeUpdateState.loaded && loanPayeeUpdateState.success && !loanPayeeUpdateState.error ) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.loanPayeeStore$.dispatch(new fromStore.LoadLoanPayee(this.payeeId));
          this.router.navigate(['payees', this.payeeId, 'info']);
        } else if ( loanPayeeUpdateState.loaded && !loanPayeeUpdateState.success && loanPayeeUpdateState.error ) {
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(loanPayeeUpdateState.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState();
        }
      });

    // Initial children route check
    this.route.firstChild.url.subscribe((data: UrlSegment[]) => {
      this.showRefund = data[0].path === 'events';
    });

    this.firstChildRouteSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe((val: NavigationEnd) => {
        const url = val.url.split('/');
        this.showRefund = url[url.length - 1] === 'events';
      });
  }

  disbursePayee(payee) {
    this.openedRefund = false;
    this.payee = payee;
    this.form.reset();
    this.openedDisburse = true;
    this.form.controls['disbursementDate'].setValue(this.dateNow, {emitEvent: false});
  }

  submitDisburse() {
    this.isLoading = true;
    this.loanPayeeUpdateStore$.dispatch(new fromStore.DisbursePayee({
      loanApplicationId: this.loanAppId,
      payeeId: this.payeeId,
      data: this.form.value,
    }));
    this.openedDisburse = false;
  }

  refund(payeeId) {
    this.openedDisburse = false;
    this.payeeId = payeeId;
    this.formRefund.reset();
    this.openedRefund = true;
    this.formRefund.controls['disbursementDate'].setValue(this.dateNow, {emitEvent: false});
  }

  submitRefund() {
    this.isLoading = true;
    this.loanPayeeUpdateStore$.dispatch(new fromStore.RefundLoanPayee({
      payeeId: this.payeeId,
      data: this.formRefund.value
    }));
    this.openedRefund = false;
  }

  resetState() {
    this.loanPayeeUpdateStore$.dispatch(new fromStore.UpdateLoanPayeeReset());
    this.isLoading = false;
  }

  cancel() {
    this.openedDisburse = false;
    this.openedRefund = false;
  }

  closeModal() {
    this.openedDisburse = false;
    this.openedRefund = false;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.payeeSub.unsubscribe();
    this.loanPayeeUpdateSub.unsubscribe();
    this.firstChildRouteSub.unsubscribe();
  }
}

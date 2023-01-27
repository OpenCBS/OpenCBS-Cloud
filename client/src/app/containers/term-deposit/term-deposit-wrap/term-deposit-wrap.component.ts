import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { environment } from '../../../../environments/environment';
import { TermDepositSideNavService } from '../shared/services/term-deposit-side-nav.service';
import { TermDepositService } from '../../../core/store/term-deposit/term-deposit/term-deposit.service';
import { ITermDepositState } from '../../../core/store';
import * as moment from 'moment';
import { ParseDateFormatService } from '../../../core/services';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom17',
  name: 'custom17'
};

@Component({
  selector: 'cbs-term-deposit-wrap',
  templateUrl: 'term-deposit-wrap.component.html',
  styleUrls: ['./term-deposit-wrap.component.scss']
})
export class TermDepositWrapComponent implements OnInit, OnDestroy {
  public termDepositStatus: string;
  public breadcrumb = [];
  public svgData = SVG_DATA;
  public isLoading = false;
  public termDepositNavConfig = [];
  public termDeposit: any;
  public opened = false;
  public fieldEmpty = false;
  public amount: any;
  public termDepositState: any;
  public amountMin: any;
  public amountMax: any;
  public operationDate = '';

  private routeSub: any;
  private termDepositSub: any;

  constructor(public termDepositStore$: Store<ITermDepositState>,
              public route: ActivatedRoute,
              public termDepositSideNavService: TermDepositSideNavService,
              public toastrService: ToastrService,
              public translate: TranslateService,
              public parseDateFormatService: ParseDateFormatService,
              public store$: Store<fromRoot.State>,
              private termDepositService: TermDepositService,
              public router: Router) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      this.termDeposit = params;
      if ( params && params.id ) {
        this.termDepositStore$.dispatch(new fromStore.LoadTermDeposit(params.id));
      }
    });

    this.termDepositSub = this.termDepositStore$.pipe(select(fromRoot.getTermDepositState)).subscribe(
      (termDepositState: ITermDepositState) => {
        this.termDepositState = termDepositState;
        if ( termDepositState.loaded && termDepositState.success && termDepositState.termDeposit ) {
          this.breadcrumb = termDepositState['breadcrumb'];
          this.termDeposit = termDepositState.termDeposit;
          this.termDepositStatus = this.termDeposit.status;
          this.amountMin = this.termDeposit.termDepositProductAmountMin;
          this.amountMax = this.termDeposit.termDepositProductAmountMax;
          this.termDepositNavConfig = this.termDepositSideNavService.getNavList('term-deposits', {
            termDepositId: this.termDeposit.id,
            editMode: false,
            createMode: false,
            status: this.termDepositStatus
          });
          this.isLoading = false;

        } else if ( termDepositState.loaded && !termDepositState.success && termDepositState.error ) {
          this.toastrService.error(`ERROR: ${termDepositState.errorMessage}`, '', environment.ERROR_TOAST_CONFIG);
          this.resetState();
          this.isLoading = false;
          this.router.navigateByUrl('term-deposits');
        }
      })
  }

  openModal() {
    this.opened = true;
    this.fieldEmpty = true;
  }

  closeModal() {
    this.opened = false;
    this.amount = '';
    this.operationDate = '';
  }

  resetState() {
    this.termDepositStore$.dispatch(new fromStore.ResetTermDeposit());
  }

  sendTermDeposit() {
    this.operationDate = this.parseDateFormatService.parseDateValue(this.operationDate);
    this.termDepositService.openTermDeposit(this.termDeposit.id, this.amount, this.operationDate).subscribe(data => {
      if ( data.error ) {
        this.toastrService.clear();
        this.toastrService.error(`ERROR: ${data.message}`, '', environment.ERROR_TOAST_CONFIG);
      } else {
        this.opened = false;
        this.translate.get('OPEN_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.termDepositStore$.dispatch(new fromStore.LoadTermDeposit(this.termDeposit.id));
        this.operationDate = '';
      }
    })
  }

  checkField() {
    if ( this.amount && this.operationDate ) {
      this.fieldEmpty = false
    }
  }

  ngOnDestroy() {
    this.termDepositSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.termDepositStore$.dispatch(new fromStore.ResetTermDeposit());
  }
}

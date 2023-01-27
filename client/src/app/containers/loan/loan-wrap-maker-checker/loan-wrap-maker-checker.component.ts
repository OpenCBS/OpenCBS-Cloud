import { catchError } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {
  ILoanInfo,
  LoanMakerCheckerRollbackService,
  ILoanMakerCheckerRollback,
  ILoanEvents,
  ILoanMakerCheckerRepayment,
} from '../../../core/store';
import { RepaymentService } from '../shared/services/repayment.service';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { environment } from '../../../../environments/environment';
import { LoanAttachmentsExtraService } from '../shared/services/loan-attachments-extra.service';
import { throwError } from 'rxjs/internal/observable/throwError';
import * as LoanEventsActions from '../../../core/store';

const SVG_DATA = {
  collection: 'standard',
  class: 'task',
  name: 'task'
};

@Component({
  selector: 'cbs-loan-wrap-maker-checker',
  templateUrl: 'loan-wrap-maker-checker.component.html',
  styleUrls: ['loan-wrap-maker-checker.component.scss']
})
export class LoanWrapMakerCheckerComponent implements OnInit, AfterViewInit, OnDestroy {
  public loanLoaded = false;
  public svgData = SVG_DATA;
  public breadcrumb = [
    {
      name: 'LOANS',
      link: '/loans'
    }
  ];
  public loanStatus: any;
  public loan: any;
  public routeSub: any;
  public loanId: number;
  public showHeader = true;
  public approveRequest = false;
  public deleteRequest = false;
  public loanMakerCheckerId: number;
  public isLoading = false;
  public showSystemAndDeletedEvents = false;
  public queryType: string;

  private loanSub: any;
  private repaymentChangeSub: any;
  private loanRollbackMakerCheckerSub: any;
  private loanRepayMakerCheckerSub: any;
  private paramsSub: any;

  constructor(private route: ActivatedRoute,
              private loanMakerCheckerRollbackStore$: Store<ILoanMakerCheckerRollback>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private router: Router,
              private translate: TranslateService,
              private loanInfoStore$: Store<ILoanInfo>,
              private repaymentService: RepaymentService,
              private loanMakerCheckerRollbackService: LoanMakerCheckerRollbackService,
              private loanEventsStore$: Store<ILoanEvents>,
              private loanExtraService: LoanAttachmentsExtraService,
              private loanMakerCheckerRepaymentStore$: Store<ILoanMakerCheckerRepayment>) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if ( params && params.id ) {
        this.loanMakerCheckerId = params.id;
      }
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryType = query.type;
      if ( query.type === 'maker-checker-repayment' ) {
        this.loanMakerCheckerRepaymentStore$.dispatch(new fromStore.LoadLoanMakerCheckerRepayment(this.loanMakerCheckerId));
      } else {
        this.loanMakerCheckerRollbackStore$.dispatch(new fromStore.LoadLoanMakerCheckerRollback({id: this.loanMakerCheckerId}));
      }
    });

    setTimeout(() => {
      if ( this.queryType === 'maker-checker-repayment' ) {
        this.loanRepayMakerCheckerSub = this.store$.pipe(select(fromRoot.getLoanMakerCheckerRepaymentState))
          .subscribe(
            (loanMakerCheckerRepaymentState: ILoanMakerCheckerRepayment) => {
              if ( loanMakerCheckerRepaymentState.loaded && loanMakerCheckerRepaymentState.success ) {
                this.loanId = loanMakerCheckerRepaymentState.loanMakerCheckerRepayment['id'];
                this.store$.dispatch(new fromStore.LoadLoanInfo({id: this.loanId}));
              }
            });
      } else {
        this.showSystemAndDeletedEvents = true;
        this.loanRollbackMakerCheckerSub = this.store$.pipe(select(fromRoot.getLoanMakerCheckerRollbackState))
          .subscribe(
            (loanMakerCheckerRollbackState: ILoanMakerCheckerRollback) => {
              if ( loanMakerCheckerRollbackState.loaded && loanMakerCheckerRollbackState.success ) {
                this.loanId = loanMakerCheckerRollbackState.loanMakerCheckerRollback['id'];
                this.loanEventsStore$.dispatch(new LoanEventsActions.LoadLoanEvents({id: this.loanId}));
                this.store$.dispatch(new fromStore.LoadLoanInfo({id: this.loanId}));
              }
            });
      }

      this.loanSub = this.store$.pipe(select(fromRoot.getLoanInfoState))
        .subscribe((loanState: ILoanInfo) => {
          if ( loanState.success && loanState.loaded && loanState['loan'] ) {
            this.loan = loanState['loan'];
            this.loanLoaded = true;
            this.loanStatus = loanState['loan']['status'];
            this.breadcrumb = loanState['breadcrumb'];
            this.isLoading = false;
          } else if ( loanState.loaded && !loanState.success && loanState.error ) {
            this.translate.get('CREATE_ERROR').subscribe((res: string) => {
              this.toastrService.error(loanState.errorMessage, res, environment.ERROR_TOAST_CONFIG);
              this.router.navigate(['loans']);
            });
          }
        });

    }, 300);
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
    this.isLoading = true;
    this.loanMakerCheckerRollbackService.approveMakerChecker(this.loanMakerCheckerId)
      .subscribe(res => {
        if (res.error) {
          this.isLoading = false;
          this.toastrService.clear();
          this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
        } else {
          this.toastrService.clear();
          this.toastrService.success('Successfully approved', '', environment.SUCCESS_TOAST_CONFIG);
          this.router.navigate(['/requests']);
          this.isLoading = false;
        }
      });
  }

  deleteLoanProductRequest() {
    this.loanMakerCheckerRollbackService.deleteMakerChecker(this.loanMakerCheckerId)
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

  showSystemEvents() {
    this.loanExtraService.announceShowSystemEventsStatusChange(true);
  }

  showDeletedEvents() {
    this.loanExtraService.announceShowDeletedEventsStatusChange(true);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.repaymentChangeSub = this.repaymentService.repaymentActiveSourceChanged$.subscribe(
        (change: boolean) => {
          this.showHeader = !change;
        }
      );
    });
  }

  resetState() {
    this.loanInfoStore$.dispatch(new fromStore.ResetLoanInfo());
  }

  ngOnDestroy() {
    if ( this.queryType === 'maker-checker-repayment' ) {
      this.loanRepayMakerCheckerSub.unsubscribe();
    } else {
      this.loanRollbackMakerCheckerSub.unsubscribe();
    }
    this.paramsSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.loanSub.unsubscribe();
    if ( this.repaymentChangeSub ) {
      this.repaymentChangeSub.unsubscribe();
    }
    this.resetState();
  }
}

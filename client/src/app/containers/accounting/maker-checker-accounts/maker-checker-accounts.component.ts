import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromRoot from '../../../core/core.reducer';
import { AccountMakerCheckerService, AccountMakerCheckerState } from '../../../core/store/chart-of-accounts-maker-checker';
import * as fromStore from '../../../core/store';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'standard', class: 'client', name: 'client'};

@Component({
  selector: 'cbs-maker-checker-accounts',
  templateUrl: 'maker-checker-accounts.component.html'
})

export class MakerCheckerAccountsComponent implements OnInit, OnDestroy {
  public breadcrumb = [
    {
      name: 'CHART OF ACCOUNTS MAKER/CHECKER',
      link: '/configuration/tills'
    }
  ];
  public svgData = SVG_DATA;
  public accountMakerCheckerState: AccountMakerCheckerState;
  public account: any;
  public approveRequest = false;
  public deleteRequest = false;
  public accountId: number;

  private routeSub: Subscription;
  private makerCheckerSub: Subscription;

  constructor(private accountMakerCheckerStateStore: Store<AccountMakerCheckerState>,
              private accountMakerCheckerService: AccountMakerCheckerService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if ( params.id ) {
        this.accountId = params.id;
        this.accountMakerCheckerStateStore.dispatch(new fromStore.LoadAccountMakerChecker(this.accountId));
      }
    });

    this.makerCheckerSub = this.accountMakerCheckerStateStore.pipe(select(fromRoot.getAccountMakerCheckerState))
      .subscribe((accountMakerCheckerState: AccountMakerCheckerState) => {
        this.accountMakerCheckerState = accountMakerCheckerState;
        this.account = accountMakerCheckerState.account;
        if ( accountMakerCheckerState.success && accountMakerCheckerState.loaded && accountMakerCheckerState.account ) {
          this.breadcrumb = [
            {
              name: 'CHART OF ACCOUNTS MAKER/CHECKER',
              link: ''
            }
          ];
        }
      });
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

  approveAccountRequest() {
    this.accountMakerCheckerService.approveMakerChecker(this.accountId)
      .pipe(catchError((res: HttpErrorResponse) => {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        return throwError(res);
      }))
      .subscribe(res => {
        this.toastrService.clear();
        this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        this.router.navigate(['/requests'])
      });
  }

  deleteAccountRequest() {
    this.accountMakerCheckerService.deleteMakerChecker(this.accountId)
      .pipe(catchError((res: HttpErrorResponse) => {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        return throwError(res);
      }))
      .subscribe(res => {
        this.toastrService.clear();
        this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        this.router.navigate(['/requests'])
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.makerCheckerSub.unsubscribe();
  }
}

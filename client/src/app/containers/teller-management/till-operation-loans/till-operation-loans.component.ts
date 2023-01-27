import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ILoanList } from '../../../core/store/loans';
import { LoanAppStatus } from '../../../core/loan-application-status.enum';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../core/services';

const SVG_DATA = {
  collection: 'standard',
  class: 'task',
  name: 'task'
};

@Component({
  selector: 'cbs-till-operation-loans',
  templateUrl: 'till-operation-loans.component.html',
  styles: [`
    :host .cbs-pagination {
      margin-top: 20px;
      margin-bottom: 20px;
    }
  `]
})

export class TillOperationLoansComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public loansData: any;
  public searchQuery = '';
  public queryObject = {
    search: '',
    page: 1
  };
  public loans = [];
  public tillId: number;
  public breadcrumbLinks = [];
  public typeInstance: string;

  private currentPageSub: Subscription;
  private paramsSub: Subscription;
  private loansSub: Subscription;
  private routeSub: Subscription;

  constructor(private loanListStore: Store<ILoanList>,
              private route: ActivatedRoute,
              private commonService: CommonService,
              private store$: Store<fromRoot.State>,
              private router: Router) {
  }

  ngOnInit() {
    this.typeInstance = this.commonService.getData();
    this.routeSub = this.route.parent.params.subscribe(
      params => {
        this.tillId = params.id;
        this.breadcrumbLinks = [
          {
            name: 'TELLER_MANAGEMENT',
            link: '/till'
          },
          {
            name: 'OPERATIONS',
            link: `/till/${this.tillId}/operations`
          },
          {
            name: 'LOANS',
            link: ''
          }
        ]
      });

    this.loansSub = this.store$.select(fromRoot.getLoanListState).subscribe(
      (loanState: ILoanList) => {
        if ( loanState.loaded && loanState.success && !loanState.error ) {
          this.loans = loanState.loans.filter(loan => {
            return loan['status'] !== LoanAppStatus[LoanAppStatus.PENDING]
          });
        }
      });

    this.loansData = this.store$.select(fromRoot.getLoanListState);
    this.currentPageSub = this.loansData.pipe(this.getLoansCurrentPage()).subscribe(
      (page: number) => {
        this.queryObject = Object.assign({}, this.queryObject, {
          page: page + 1
        });
      });

    this.paramsSub = this.route.queryParams.subscribe(
      query => {
        this.queryObject.search = query['search'] ? query['search'] : '';
        this.queryObject.page = query['page'] ? query['page'] : 1;

        this.searchQuery = query['search'] ? query['search'] : '';
        if ( this.queryObject.page !== 1 && this.searchQuery.search ) {
          this.loanListStore.dispatch(new fromStore.LoadLoanList(this.queryObject));
        } else {
          this.loanListStore.dispatch(new fromStore.LoadLoanList());
        }
      });
  }

  getLoansCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  clearSearch() {
    this.search();
  }

  search(query?) {
    this.queryObject.search = query || '';
    this.queryObject.page = 1;

    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject.search ? this.queryObject : {}
    };

    this.router.navigate(['/till', this.tillId, 'loans'], navigationExtras);
  }

  goToRepayLoan(loan: any) {
    const urlRepay = this.typeInstance === 'kazmicro' ? 'repay-for-kazmicro' : 'repay'
    this.router.navigate(['/till', this.tillId, 'loans', loan.data.id, urlRepay]);
  }

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/till', this.tillId, 'loans'], navigationExtras);
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.loansSub.unsubscribe();
    this.currentPageSub.unsubscribe();
    this.routeSub.unsubscribe();
  }
}

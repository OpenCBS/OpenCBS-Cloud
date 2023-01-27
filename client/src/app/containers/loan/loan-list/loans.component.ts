import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ILoanList } from '../../../core/store/loans';
import { LoanAppStatus } from '../../../core/loan-application-status.enum';
import { Subscription } from 'rxjs/Rx';
import { map } from 'rxjs/operators';

const SVG_DATA = {collection: 'standard', class: 'task', name: 'task'};

@Component({
  selector: 'cbs-loans',
  templateUrl: 'loans.component.html',
  styleUrls: ['loans.component.scss']
})

export class LoansComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public loansData: any;
  public searchQuery = '';
  public queryObject = {
    search: '',
    page: 1
  };
  public loans = [];
  public loanState: ILoanList;

  private loanId: any;
  private loanType: any;
  private currentPageSub: Subscription;
  private paramsSub: Subscription;
  private loansSub: Subscription;

  constructor(private loanListStore: Store<ILoanList>,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private router: Router) {
  }

  ngOnInit() {
    this.loansSub = this.store$.pipe(select(fromRoot.getLoanListState))
      .subscribe((loanState: ILoanList) => {
        if ( loanState.loaded && loanState.success && !loanState.error ) {
          this.loanState = loanState;
          this.loans = loanState.loans.filter(loan => {
            return loan['status'] !== LoanAppStatus[LoanAppStatus.PENDING]
          });
        }
      });

    this.loansData = this.store$.pipe(select(fromRoot.getLoanListState));
    this.currentPageSub = this.loansData.pipe(this.getLoansCurrentPage())
      .subscribe((page: number) => {
        this.queryObject = Object.assign({}, this.queryObject, {
          page: page + 1
        });
      });

    this.paramsSub = this.route.queryParams.subscribe(query => {
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

    this.router.navigate(['/loans'], navigationExtras);
  }

  goToLoan(loan: any) {
    if ( loan.data.type === 'GROUP' ) {
      this.loanId = loan.data.applicationId;
      this.loanType = 'GROUP';
    } else {
      this.loanId = loan.data.id;
      this.loanType = loan.data.type;
    }
    this.router.navigate(['/loans', this.loanId, `${this.loanType}`.toLowerCase(), 'info']);
  }

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/loans'], navigationExtras);
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.loansSub.unsubscribe();
    this.currentPageSub.unsubscribe();
  }
}

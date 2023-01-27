import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as fromStore from '../../../core/store';
import { ITermDepositEntries, ITermDepositState, TermDepositEntriesActions } from '../../../core/store/term-deposit';
import * as fromRoot from '../../../core/core.reducer';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cbs-term-deposit-entries',
  templateUrl: 'term-deposit-entries.component.html',
  styleUrls: ['./term-deposit-entries.component.scss']
})

export class TermDepositEntriesComponent implements OnInit, OnDestroy {
  public queryObject = {
    page: 1
  };
  @ViewChild('dt', {static: false}) dataTable: Table;
  public breadcrumb = [];
  public entriesState: Observable<ITermDepositEntries>;

  private termDepositId: number;
  private termDepositSub: any;
  private routeSub: any;
  private currentPageSub: any;
  private paramsSub: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private termDepositStore$: Store<ITermDepositState>,
              private termDepositEntriesActions: TermDepositEntriesActions,
              private termDepositEntriesStore$: Store<ITermDepositEntries>) {
  }

  ngOnInit() {
    this.entriesState = this.store$.pipe(select(fromRoot.getTermDepositEntriesState));
    this.routeSub = this.route.parent.params.subscribe((params: { id }) => {
      if ( params && params.id ) {
        this.termDepositId = params.id;
      }
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? query['page'] : 1;

      if ( this.queryObject.page !== 1 ) {
        this.termDepositEntriesStore$.dispatch(this.termDepositEntriesActions.fireInitialAction({
          id: this.termDepositId,
          ...this.queryObject
        }));
      } else {
        this.termDepositEntriesStore$.dispatch(this.termDepositEntriesActions.fireInitialAction({
          id: this.termDepositId
        }));
      }
    });

    this.currentPageSub = this.entriesState.pipe((this.getCurrentPage())).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {
        page: page + 1
      });
    });

    this.termDepositSub = this.termDepositStore$.pipe(select(fromRoot.getTermDepositState)).subscribe(
      (termDepositState: ITermDepositState) => {
        if ( termDepositState['loaded'] && !termDepositState['error'] && termDepositState['success'] ) {
          const termDeposits = termDepositState.termDeposit;
          const profileType = termDeposits['profileType'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: termDeposits['profileName'],
              link: `/profiles/${profileType}/${termDeposits['profileId']}/info`
            },
            {
              name: 'TERM_DEPOSITS',
              link: `/profiles/${profileType}/${termDeposits['id']}/term-deposits`
            },
            {
              name: 'ENTRIES',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.termDepositStore$.dispatch(new fromStore.SetTermDepositBreadcrumb(this.breadcrumb));
    }, 700);
  }

  getCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/term-deposits', this.termDepositId, 'entries'], navigationExtras);
  }

  resetState() {
    this.termDepositEntriesStore$.dispatch(this.termDepositEntriesActions.fireResetAction());
  }

  ngOnDestroy() {
    this.resetState();
    this.routeSub.unsubscribe();
    this.termDepositSub.unsubscribe();
    this.paramsSub.unsubscribe();
    this.currentPageSub.unsubscribe();
  }
}

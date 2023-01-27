import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { TransactionTemplatesListState } from '../../../../../core/store/transaction-templates/transaction-templates-list';
import { Subscription } from 'rxjs/Rx';
import {map} from 'rxjs/operators';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom17',
  name: 'custom17'
};

@Component({
  selector: 'cbs-transaction-templates',
  templateUrl: 'transaction-templates.component.html',
  styleUrls: ['transaction-templates.component.scss']
})

export class TransactionTemplatesComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public queryObject = {
    page: 1
  };
  public transactionTemplatesList: any;
  public transactionTemplatesListData: any;
  public open = false;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'TRANSACTION_TEMPLATES',
      link: '/configuration/transaction-templates'
    }
  ];

  private paramsSub: Subscription;
  private transactionTemplatesSub: Subscription;
  private currentPageSub: Subscription;

  constructor(private transactionTemplatesListStateStore: Store<TransactionTemplatesListState>,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private router: Router) {
  }

  ngOnInit() {
    this.transactionTemplatesSub = this.store$.pipe(select(fromRoot.getTransactionTemplatesListState))
      .subscribe((transactionTemplatesList: TransactionTemplatesListState) => {
        this.transactionTemplatesList = transactionTemplatesList;
      });

    this.transactionTemplatesListData = this.store$.pipe(select(fromRoot.getTransactionTemplatesListState));
    this.currentPageSub = this.transactionTemplatesListData.pipe(this.getTransactionTemplatesCurrentPage())
      .subscribe((page: number) => {
        this.queryObject.page = page + 1;
      });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? +query['page'] : 1;
      if ( this.queryObject.page !== 1 ) {
        this.transactionTemplatesListStateStore.dispatch(new fromStore.LoadTransactionTemplatesList(this.queryObject));
      } else {
        this.transactionTemplatesListStateStore.dispatch(new fromStore.LoadTransactionTemplatesList());
      }
    });
  }

  getTransactionTemplatesCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  gotToCreateTransactionTemplate(accountType) {
    this.router.navigate(['/create', accountType]);
  }

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/configuration/transaction-templates'], navigationExtras);
  }

  goToTransactionTemplatesDetails(transactionTemplates) {
    this.router.navigate(['/configuration', 'transaction-templates', transactionTemplates.id])
  }

  ngOnDestroy() {
    this.transactionTemplatesSub.unsubscribe();
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}

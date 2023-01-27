import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { TransactionTemplatesInfoState } from '../../../../../core/store';
import { Subscription } from 'rxjs/Rx';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom17',
  name: 'custom17'
};

@Component({
  selector: 'cbs-transaction-templates-info',
  templateUrl: 'transaction-templates-info.component.html'
})

export class TransactionTemplatesInfoComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public breadcrumbLinks = [

    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'TRANSACTION TEMPLATES',
      link: '/configuration/transaction-templates'
    }
  ];
  public transactionTemplates: TransactionTemplatesInfoState;
  public isLoading = false;

  private routeSub: Subscription;
  private transactionTemplatesInfoSub: Subscription;

  constructor(private transactionTemplatesInfoStateStore: Store<TransactionTemplatesInfoState>,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if (params.id) {
        this.transactionTemplatesInfoStateStore.dispatch(new fromStore.LoadTransactionTemplatesInfo(params.id));
      }
    });

    this.transactionTemplatesInfoSub = this.store$.pipe(select(fromRoot.getTransactionTemplatesInfoState))
    .subscribe((info: TransactionTemplatesInfoState) => {
      if (info.loaded && info.success && !info.error) {
        this.transactionTemplates = info;
        this.breadcrumbLinks[2] = {
          name: info.transactionTemplatesInfo['name'],
          link: ''
        };
        this.isLoading = false;
      }
    })
  };

  resetState() {
    this.transactionTemplatesInfoStateStore.dispatch(new fromStore.ResetTransactionTemplatesInfo());
  }

  ngOnDestroy() {
    this.resetState();
    this.routeSub.unsubscribe();
    this.transactionTemplatesInfoSub.unsubscribe();
  }
}

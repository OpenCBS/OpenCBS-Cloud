import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../core/store';
import { TellerListState } from '../../../../core/store/tellers/teller-list';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../core/services';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'cbs-special-operations',
  templateUrl: 'special-operations.component.html',
  styleUrls: ['special-operations.component.scss']
})

export class TellerSpecialOperationComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public currentInstance: string;
  public tillId: number
  public repayIcon = {collection: 'standard', name: 'product_request', className: 'product-request'};
  public depositToCurrentAccountIcon = {collection: 'custom', name: 'custom17', className: 'custom17'};
  public withdrawFromCurrentAccountIcon = {collection: 'standard', name: 'client', className: 'client'};
  public depositToSavingAccountIcon = {collection: 'custom', name: 'custom41', className: 'custom41'};
  public withdrawFromSavingAccountIcon = {
    collection: 'standard', name: 'product_request_line_item', className: 'product-request-line-item'
  };

  private routeSub: Subscription;

  constructor(private tellerStore$: Store<TellerListState>,
              private route: ActivatedRoute,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.currentInstance = this.commonService.getData();
    this.routeSub = this.route.parent.parent.params.subscribe(params => {
      this.tillId = params.id;
      this.breadcrumb = [
        {
          name: 'TELLER_MANAGEMENT',
          link: '/till'
        },
        {
          name: this.tillId,
          link: ''
        },
        {
          name: 'OPERATIONS',
          link: ''
        }
      ];
      this.tellerStore$.dispatch(new fromStore.SetTellerBreadcrumb(this.breadcrumb));
    })
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}

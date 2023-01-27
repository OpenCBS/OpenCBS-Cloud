import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { Subscription } from 'rxjs';

const SVG_DATA = {
  collection: 'standard',
  class: 'folder',
  name: 'folder'
};

@Component({
  selector: 'cbs-audit-trails',
  templateUrl: 'integration-with-bank.component.html',
  styleUrls: ['./integration-with-bank.component.scss']
})
export class IntegrationWithBankComponent {
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'SETTINGS',
      link: '/settings'
    },
    {
      name: 'INTEGRATION_WITH_BANK',
      link: '/settings/integration-with-bank'
    }
  ];
  public list = [];

  private currentUser: any;
  private currentUserSub: Subscription;

  constructor(private store$: Store<fromRoot.State>) {
    this.currentUserSub = this.store$.pipe(select(fromRoot.getCurrentUserState))
      .subscribe(user => {
        if ( user.loaded && user.success && !user.error ) {
          this.currentUser = user;
        }
      });
  }

  ngOnInit() {
    this.list = [{
      name: 'EXPORT',
      link: '/integration-with-bank/integration-with-bank-export-file-list',
      disabled: this.hasPermission('SEPA'),
      icon: {collection: 'standard', name: 'sales_path', className: 'sales-path'},
    }, {
      name: 'IMPORT',
      link: '/integration-with-bank/integration-with-bank-import-file-list',
      disabled: this.hasPermission('SEPA'),
      icon: {collection: 'standard', name: 'product_consumed', className: 'product-consumed'}
    }];
  }

  hasPermission(permission) {
    return this.currentUser['permissions'].some((a) => {
      if ( a['group'] === 'SEPA' ) {
        return !a['permissions'].includes(permission);
      }
    });
  }
}

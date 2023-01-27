import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChildrenAccountsService } from '../services/children-accounts.service';
import { LoadingService } from '../services/loading-service';

@Component({
  selector: 'cbs-accounts-tree-table',
  templateUrl: 'accounts-tree-table.component.html',
  styleUrls: ['accounts-tree-table.component.scss']
})

export class AccountsTreeTableComponent {
  @Input() childrenNodes;
  @Input() currentNode;
  @Input() padding;
  @Input() total;
  @Input() branchId;
  @Output() onIconClick = new EventEmitter();

  public page = 0;

  constructor(private childrenAccountsService: ChildrenAccountsService,
              private loadingService: LoadingService) {
  }

  toggle(node) {
    node.expanded = !node.expanded;
    if (node.expanded && node.hasChildren && !node.data) {
      this.loadingService.showLoader(true);
      const params = this.branchId > 0 ? {accountId: node['id'], branchId: this.branchId} : {accountId: node['id']};
      this.childrenAccountsService.getAccounts(params)
      .subscribe(data => {
        node.data = data;
        this.loadingService.showLoader(false);
      });
    }
  }

  goToPage(page) {
    this.loadingService.showLoader(true);
    this.childrenAccountsService.getChildrenByPage(this.currentNode['id'], page - 1)
    .subscribe(data => {
      this.childrenNodes.content = data.content;
      this.loadingService.showLoader(false);
    });
  }
}

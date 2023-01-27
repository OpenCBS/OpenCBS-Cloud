import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CCRulesListState } from '../../../../../core/store/credit-committee';
import { Router } from '@angular/router';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

@Component({
  selector: 'cbs-credit-committee-rules',
  templateUrl: 'credit-committee-list.component.html',
  styleUrls: ['credit-committee-list.component.scss']
})

export class CCRulesComponent implements OnInit {
  public ccRules: any;
  public svgData = {
    collection: 'standard',
    class: 'team-member',
    name: 'team_member'
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'CREDIT_COMMITTEE',
      link: '/configuration/credit-committee-rules'
    }
  ];

  constructor(private ccRulesListStore$: Store<CCRulesListState>,
              private store$: Store<fromRoot.State>,
              private router: Router) {

  }

  ngOnInit() {
    this.ccRules = this.store$.select(fromRoot.getCcRulesListState);
    this.ccRulesListStore$.dispatch(new fromStore.LoadCCRules);
  }

  goToCreditCommitee(creditCom) {
    this.router.navigate(['/configuration', 'credit-committee-rules-info', creditCom.id])
  }
}

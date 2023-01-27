import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CCRulesInfoState, CCRulesInfoActions } from '../../../../../core/store/credit-committee';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

@Component({
  selector: 'cbs-credit-committee-info',
  templateUrl: 'credit-committee-info.component.html',
  styleUrls: ['credit-committee-info.component.scss']
})

export class CCRulesInfoComponent implements OnInit, OnDestroy {
  public ccRules: any;
  public svgData = {
    collection: 'standard',
    class: 'team-member',
    name: 'team_member'
  };
  public ccId: number;
  public breadcrumbLinks = [
    {
      name: 'CREDIT_COMMITTEE',
      link: '/configuration/credit-committee-rules'
    },
    {
      name: 'DETAILS',
      link: ''
    }
  ];
  public info: any;

  private routeSub: any;

  constructor(private route: ActivatedRoute,
              private ccRulesInfoStore$: Store<CCRulesInfoState>,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.ccId = params['id'];
      this.ccRules = this.store$.select(fromRoot.getCcRulesInfoState);
      this.loadCCRulesInfo(this.ccId);
    });
    this.info = this.store$.select(fromRoot.getCcRulesInfoState);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.ccRulesInfoStore$.dispatch(new fromStore.ResetCCRulesInfo());
  }

  loadCCRulesInfo(id) {
    this.ccRulesInfoStore$.dispatch(new fromStore.LoadCCRulesInfo(id));
  }

}

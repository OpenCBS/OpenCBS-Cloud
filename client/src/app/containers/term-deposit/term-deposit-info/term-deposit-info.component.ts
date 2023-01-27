import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ActivatedRoute } from '@angular/router';
import { ITermDepositState } from '../../../core/store/term-deposit/term-deposit';

@Component({
  selector: 'cbs-term-deposit-info',
  templateUrl: 'term-deposit-info.component.html',
  styleUrls: ['term-deposit-info.component.scss']
})
export class TermDepositInfoComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public termDepositId: number;
  public termDeposits: any;
  public termDepositLoaded: any;
  public termDepositStatus: string;

  private termDepositStateSub: any;

  constructor(private store$: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private termDepositStore$: Store<ITermDepositState>) {
  }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.termDepositId = params.id;
      this.termDepositStore$.dispatch(new fromStore.LoadTermDeposit(this.termDepositId));
    });

    this.termDepositStateSub = this.store$.select(fromRoot.getTermDepositState).subscribe(
      (termDepositState: ITermDepositState) => {
        if (termDepositState.loaded && termDepositState.success) {
          this.termDepositLoaded = termDepositState;
          this.termDeposits = termDepositState.termDeposit;
          this.termDepositStatus = this.termDeposits.status;
          const profileType = this.termDeposits.profileType === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: this.termDeposits.profileName,
              link: `/profiles/${profileType}/${this.termDeposits.profileId}/info`
            },
            {
              name: 'TERM_DEPOSITS',
              link: `/profiles/${profileType}/${this.termDeposits.profileId}/term-deposits`
            },
            {
              name: 'INFO',
              link: ''
            }
          ];

        }
      });

    setTimeout(() => {
      this.termDepositStore$.dispatch(new fromStore.SetTermDepositBreadcrumb(this.breadcrumb));
    }, 1500)
  }

  ngOnDestroy() {
    this.termDepositStateSub.unsubscribe();
  }
}

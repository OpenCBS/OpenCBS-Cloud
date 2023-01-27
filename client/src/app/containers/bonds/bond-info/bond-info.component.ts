import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ActivatedRoute } from '@angular/router';
import { BondState } from '../../../core/store/bond/bond';

@Component({
  selector: 'cbs-bond-info',
  templateUrl: 'bond-info.component.html',
  styleUrls: ['bond-info.component.scss']
})
export class BondInfoComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public bondId: number;
  public bonds: any;
  public bondLoaded: any;
  private bondStateSub: any;

  constructor(private store$: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private bondStore$: Store<BondState>) {
  }

  ngOnInit() {
    this.route.parent.params
      .subscribe(params => {
        this.bondId = params.id;
        this.bondStore$.dispatch(new fromStore.LoadBond(this.bondId));
      });

    this.bondStateSub = this.store$.select(fromRoot.getBondState)
      .subscribe((bondState: BondState) => {
        if (bondState.loaded && bondState.success) {
          this.bonds = bondState.bond;
          this.bondLoaded = bondState;
          const bondProfile = this.bonds['profile'];
          const profileType = bondProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: bondProfile['name'],
              link: `/profiles/${profileType}/${bondProfile['id']}/info`
            },
            {
              name: 'BONDS',
              link: `/profiles/${profileType}/${bondProfile['id']}/bonds`
            },
            {
              name: 'INFO',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.bondStore$.dispatch(new fromStore.SetBondBreadcrumb(this.breadcrumb));
    }, 1500)
  }

  ngOnDestroy() {
    this.bondStateSub.unsubscribe();
  }
}

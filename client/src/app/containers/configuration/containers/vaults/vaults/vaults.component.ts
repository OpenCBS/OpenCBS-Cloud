import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { VaultListActions, IVaultList, } from '../../../../../core/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as fromRoot from '../../../../../core/core.reducer';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

const SVG_DATA = {  collection: 'custom',  class: 'custom17',  name: 'custom17'};

@Component({
  selector: 'cbs-vaults',
  templateUrl: 'vaults.component.html',
  styleUrls: ['vaults.component.scss']
})

export class VaultsComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public vaults: any;
  public queryObject = {
    page: 1
  };

  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'VAULTS',
      link: '/configuration/vaults'
    }
  ];

  private currentPageSub: Subscription;
  private paramsSub: Subscription;

  constructor(private vaultListStore$: Store<IVaultList>,
              private vaultListActions: VaultListActions,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private router: Router) {
  }

  ngOnInit() {
    this.vaults = this.store$.pipe(select(fromRoot.getVaultListState));
    this.currentPageSub = this.vaults.pipe(this.getVaultsCurrentPage()).subscribe((page: number) => {
      this.queryObject.page = page + 1;
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? +query['page'] : 1;
      if (this.queryObject.page !== 1) {
        this.vaultListStore$.dispatch(this.vaultListActions.fireInitialAction(this.queryObject));
      } else {
        this.vaultListStore$.dispatch(this.vaultListActions.fireInitialAction());
      }
    });
  }

  getVaultsCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/configuration/vaults'], navigationExtras);
  }

  goToVaultDetails(vault) {
    this.router.navigate(['/configuration', 'vaults', vault.id])
  }

  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}

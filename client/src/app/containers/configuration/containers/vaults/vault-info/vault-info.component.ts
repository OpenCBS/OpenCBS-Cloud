import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { VaultInfoActions, IVaultInfo } from '../../../../../core/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom17', name: 'custom17'};

@Component({
  selector: 'cbs-vault-info',
  templateUrl: 'vault-info.component.html'
})

export class VaultInfoComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public vault: any;
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

  private routeSub: Subscription;
  private vaultInfoSub: Subscription;

  constructor(private vaultInfoStore$: Store<IVaultInfo>,
              private vaultInfoActions: VaultInfoActions,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if ( params.id ) {
        this.vaultInfoStore$.dispatch(this.vaultInfoActions.fireInitialAction(params.id))
      }
    });
    this.vault = this.store$.pipe(select(fromRoot.getVaultInfoState));

    this.vaultInfoSub = this.store$.pipe(select(fromRoot.getVaultInfoState))
      .subscribe((info: IVaultInfo) => {
        if ( info.loaded && info.success && !info.error ) {
          this.breadcrumbLinks[2] = {
            name: info.data.name,
            link: ''
          }
        }
      })
  };

  resetState() {
    this.vaultInfoStore$.dispatch(this.vaultInfoActions.fireResetAction());
  }

  ngOnDestroy() {
    this.resetState();
    this.vaultInfoSub.unsubscribe();
    this.routeSub.unsubscribe();
  }
}

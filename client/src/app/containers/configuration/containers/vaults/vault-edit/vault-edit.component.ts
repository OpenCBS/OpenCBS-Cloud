import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import * as fromRoot from '../../../../../core/core.reducer';
import {
  IVaultInfo,
  VaultInfoActions,
  IUpdateVault,
  VaultUpdateActions
} from '../../../../../core/store';
import { VaultFormComponent } from '../vault-form/vault-form.component';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom17', name: 'custom17'};

@Component({
  selector: 'cbs-vault-edit',
  templateUrl: 'vault-edit.component.html'
})

export class VaultEditComponent implements OnInit, OnDestroy {
  @ViewChild(VaultFormComponent, {static: false}) vaultForm: VaultFormComponent;
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'VAULTS',
      link: '/configuration/vaults'
    },
    {
      name: '',
      link: ''
    },
    {
      name: 'EDIT',
      link: ''
    }
  ];

  private vaultId: number;
  private vaultUpdateSub: Subscription;
  private routeSub: Subscription;
  private vaultSub: Subscription;

  constructor(private toastrService: ToastrService,
              private translate: TranslateService,
              private vaultInfoStore$: Store<IVaultInfo>,
              private vaultInfoActions: VaultInfoActions,
              private vaultUpdateStore$: Store<IUpdateVault>,
              private vaultUpdateActions: VaultUpdateActions,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.vaultUpdateSub = this.store$.pipe(select(fromRoot.getVaultUpdateState))
      .subscribe((vaultUpdate) => {
        if ( vaultUpdate.loaded && vaultUpdate.success && !vaultUpdate.error ) {
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.goToViewInfo();
        } else if ( vaultUpdate.loaded && !vaultUpdate.success && vaultUpdate.error ) {
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState();
        }
      });

    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if ( params.id ) {
        this.vaultId = params.id;
        this.vaultInfoStore$.dispatch(this.vaultInfoActions.fireInitialAction(params.id))
      }
    });
    this.vaultSub = this.store$.pipe(select(fromRoot.getVaultInfoState))
      .subscribe((vaultInfo: IVaultInfo) => {
        if ( vaultInfo.loaded && vaultInfo.success && !vaultInfo.error ) {
          this.vaultForm.loadCurrencies(vaultInfo);
          this.breadcrumbLinks[2] = {
            name: vaultInfo.data.name,
            link: ''
          }
        }
      });
  }

  goToViewInfo() {
    this.router.navigate(['configuration', 'vaults', this.vaultId])
  }

  submitForm() {
    this.vaultForm.form.value.accounts = this.vaultForm.form.value.accounts
      .map(currency => currency[Object.keys(currency)[0]]);
    this.vaultUpdateStore$.dispatch(this.vaultUpdateActions
      .fireInitialAction({vault: this.vaultForm.form.value, id: this.vaultId}));
  }

  resetState() {
    this.vaultUpdateStore$.dispatch(this.vaultUpdateActions.fireResetAction());
  }

  ngOnDestroy() {
    this.resetState();
    this.vaultUpdateSub.unsubscribe();
    this.vaultForm.resetState();
    this.routeSub.unsubscribe();
    this.vaultSub.unsubscribe();
  }
}

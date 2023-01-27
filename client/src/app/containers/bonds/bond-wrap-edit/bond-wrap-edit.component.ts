import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { BondFormState } from '../../../core/store/bond';
import { Observable } from 'rxjs';
import { BondFormExtraService } from '../shared/services/bond-extra.service';
import { BondState } from '../../../core/store/bond';
import { IBondUpdateState } from '../../../core/store/bond';
import { BondSideNavService } from '../shared/services/bond-side-nav.service';

@Component({
  selector: 'cbs-bond-wrap-edit',
  templateUrl: 'bond-wrap-edit.component.html'
})

export class BondWrapEditComponent implements OnInit, OnDestroy {
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = {
    collection: 'custom',
    class: 'custom41',
    name: 'custom41'
  };
  public bondNavConfig = [];
  public bondFormState: BondFormState;
  public formStatus: Observable<boolean>;
  public breadcrumbLinks = [];
  public bond: any;

  public routeSub: any;
  public bondSub: any;
  public bondId: number;
  private updateBondSub: any;
  private bondDataSub: any;

  constructor(private updateBondStore$: Store<IBondUpdateState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2,
              private bondFormStore$: Store<BondFormState>,
              private bondFormExtraService: BondFormExtraService,
              private bondSideNavService: BondSideNavService,
              public bondStore$: Store<BondState>,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.formStatus = this.bondFormExtraService.formStatusSourceChanged$;

    this.bondDataSub = this.bondFormExtraService.bondStateSourceChange$
    .subscribe(data => {
      this.bondFormState = data;
    });

    this.bondFormStore$.dispatch(new fromStore.FormResetBond());
    this.bondFormStore$.dispatch(new fromStore.SetRouteBond('edit'));

    this.updateBondSub = this.store$.select(fromRoot.getBondUpdateState)
    .subscribe((state: IBondUpdateState) => {

      if (state.loaded && state.success && !state.error) {
        this.translate.get('UPDATE_SUCCESS')
        .subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });

        this.resetState();
        this.goToViewBondDetails(state.response.id);
        return
      }

      if (state.loaded && !state.success && state.error) {
        this.disableSubmitBtn(false);

        this.translate.get('UPDATE_ERROR')
        .subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState();
      }
    });

    this.routeSub = this.route.params
    .subscribe((params: { id }) => {
      if (params && params.id) {
        this.bondStore$.dispatch(new fromStore.LoadBond(params.id));
      }
    });
    this.bondSub = this.store$.select(fromRoot.getBondState)
    .subscribe((bond: BondState) => {
      if (bond.success && bond.loaded && bond.bond) {
        this.bond = bond.bond;
        const bondProfile = this.bond['profile'];
        const profileType = bondProfile['type'] === 'PERSON' ? 'people' : 'companies';
        this.breadcrumbLinks = [
          {
            name: 'BONDS',
            link: `/profiles/${profileType}/${bondProfile['id']}/bonds`
          },
          {
            name: this.bond['isin'],
            link: ''
          },
          {
            name: 'EDIT',
            link: ''
          }
        ];

        this.bondNavConfig = this.bondSideNavService.getNavList('bonds', {
          editMode: true,
          createMode: false,
          bondId: this.bond['id'],
          status: this.bond['status']
        });

        const formData = {
          bondProduct: this.bond.bondProduct,
          profile: this.bond.profile,
          bankAccountId: this.bond.bankAccount.id,
          number: this.bond.number,
          bondAmount: this.bond.bondAmount,
          equivalentCurrencyId: this.bond.equivalentCurrency.id,
          interestRate: this.bond.interestRate,
          penaltyRate: this.bond.penaltyRate,
          sellDate: this.bond.sellDate,
          couponDate: this.bond.couponDate,
          expireDate: this.bond.expireDate,
          maturity: this.bond.maturity,
          frequency: this.bond.frequency,
          interestScheme: this.bond.interestScheme
        };

        this.bondFormStore$.dispatch(new fromStore.PopulateBond({
          data: formData,
          valid: true,
          profile: this.bond.profile,
        }));
      }

      if (bond.loaded && !bond.success && bond.error) {
        this.toastrService.error(`ERROR: ${bond.errorMessage}`, '', environment.ERROR_TOAST_CONFIG);
        this.resetState();
        this.router.navigateByUrl('bonds');
      }
    });
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.updateBondStore$.dispatch(new fromStore.UpdateBondReset());
  }

  goToViewBondDetails(id) {
    this.router.navigate(['bonds', `${id}`]);
  }

  previewSchedule() {
    this.router.navigate(['/bonds', this.bond['id'], 'edit', 'schedule']);
  }

  submitForm() {
    if (this.bondFormState.valid && this.bondFormState.data.number > 0) {
      this.disableSubmitBtn(true);

      this.updateBondStore$.dispatch(new fromStore.UpdateBond({
        data: this.getObjectToSend(),
        id: this.bond['id']
      }));
    }
  }

  getObjectToSend() {
    return {
      bondProductId: this.bondFormState.data['bondProduct']['id'],
      profileId: this.bondFormState.data['profile']['id'],
      bankAccountId: this.bondFormState.data['bankAccountId'],
      number: this.bondFormState.data['number'],
      bondAmount: {
        amount: this.bondFormState.data['amount'],
        equivalentAmount: this.bondFormState.data['equivalentAmount']
      },
      equivalentCurrencyId: this.bondFormState.data['equivalentCurrencyId'],
      interestRate: this.bondFormState.data['interestRate'],
      penaltyRate: this.bondFormState.data['penaltyRate'],
      sellDate: this.bondFormState.data['sellDate'],
      couponDate: this.bondFormState.data['couponDate'],
      expireDate: this.bondFormState.data['expireDate'],
      maturity: this.bondFormState.data['maturity'],
      frequency: this.bondFormState.data['frequency'],
      interestScheme: this.bondFormState.data['interestScheme']
    };
  }

  ngOnDestroy() {
    this.updateBondSub.unsubscribe();
    this.bondSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.bondDataSub.unsubscribe();
    this.bondFormStore$.dispatch(new fromStore.FormResetBond());
    this.bondStore$.dispatch(new fromStore.ResetBond());
  }
}


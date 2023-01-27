import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { BondCreateState } from '../../../core/store/bond/bond-create/bond-create.reducer';
import { BondFormState } from '../../../core/store/bond/bond-form/bond-form.interfaces';
import { BondFormExtraService } from '../shared/services/bond-extra.service';
import { Observable } from 'rxjs';
import { BondSideNavService } from '../shared/services/bond-side-nav.service';

@Component({
  selector: 'cbs-bond-wrap-create',
  templateUrl: 'bond-wrap-create.component.html'
})
export class BondWrapCreateComponent implements OnInit, OnDestroy {
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = {
    collection: 'custom',
    class: 'custom41',
    name: 'custom41'
  };
  public bondNavConfig = [];
  public profile: any;
  public isLoading = false;
  public bondFormState: BondFormState;
  public formStatus: Observable<boolean>;
  public breadcrumb = [];
  private createBondSub: any;
  private bondFormSub: any;

  constructor(
    private createBondStore$: Store<BondCreateState>,
    private router: Router,
    private toastrService: ToastrService,
    private translate: TranslateService,
    private renderer2: Renderer2,
    private store$: Store<fromRoot.State>,
    private bondFormStore$: Store<BondFormState>,
    private bondFormExtraService: BondFormExtraService,
    private bondNavConfigSideNavService: BondSideNavService
  ) {
  }

  ngOnInit() {
    this.bondNavConfig = this.bondNavConfigSideNavService.getNavList('bonds', {
      editMode: false,
      createMode: true
    });
    this.formStatus = this.bondFormExtraService.formStatusSourceChanged$;

    this.bondFormStore$.dispatch(new fromStore.FormResetBond());
    this.bondFormStore$.dispatch(new fromStore.SetRouteBond('create'));

    this.bondFormSub = this.bondFormExtraService.bondStateSourceChange$
    .subscribe((bondFormState: BondFormState) => {
        this.bondFormState = bondFormState;
        this.profile = this.bondFormState.profile;
        this.breadcrumb = [
          {
            name: 'BONDS',
            link: `/profiles/${this.profile.profileType}/${
              this.profile.profileId
              }/bonds`
          },
          {
            name: 'BOND_ADD',
            link: ''
          }
        ];
      }
    );

    this.createBondSub = this.store$
    .select(fromRoot.getBondCreateState)
    .subscribe((state: BondCreateState) => {
      if (state.loaded && state.success && !state.error) {
        this.translate.get('CREATE_SUCCESS')
        .subscribe((res: string) => {
          this.toastrService.success(
            res,
            '',
            environment.SUCCESS_TOAST_CONFIG
          );
        });
        this.resetState();
        this.goToViewBondDetails(state.response.id);
      } else if (state.loaded && !state.success && state.error) {
        this.disableSubmitBtn(false);
        this.translate.get('CREATE_ERROR')
        .subscribe((res: string) => {
          this.toastrService.error(
            state.errorMessage,
            res,
            environment.ERROR_TOAST_CONFIG
          );
        });
        this.resetState();
      }
    });
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(
      this.submitButton.nativeElement,
      'disabled',
      bool
    );
  }

  resetState() {
    this.createBondStore$.dispatch(new fromStore.CreateBondReset());
    this.isLoading = false;
  }

  goToViewBonds() {
    this.router.navigate([
      '/profiles',
      this.profile.profileType,
      this.profile.profileId,
      'bonds'
    ]);
  }

  goToViewBondDetails(id) {
    this.router.navigate(['bonds', `${id}`]);
  }

  previewSchedule() {
    this.router.navigate(['/bonds', 'create', 'schedule']);
  }

  submitForm() {
    if (this.bondFormState.valid && this.bondFormState.data['number'] > 0) {
      this.isLoading = true;
      this.disableSubmitBtn(true);
      const objectToSend = {
        bondProductId: this.bondFormState.data['bondProductId'],
        profileId: this.bondFormState.data['profileId'],
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

      this.createBondStore$.dispatch(new fromStore.CreateBond(objectToSend));
    }
  }

  ngOnDestroy() {
    this.createBondSub.unsubscribe();
    this.bondFormSub.unsubscribe();
    this.bondFormStore$.dispatch(new fromStore.FormResetBond());
  }
}

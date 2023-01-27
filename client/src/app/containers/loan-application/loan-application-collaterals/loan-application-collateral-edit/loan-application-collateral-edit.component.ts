import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../../../environments/environment';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { LoanAppCollateralFormComponent } from '../../shared/components';
import {
  ILoanAppState,
  ILoanAppCollateralUpdate,
  ILoanAppCollateral,
  ILoanAppFormState
} from '../../../../core/store';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-app-collateral-update',
  templateUrl: 'loan-application-collateral-edit.component.html',
  styleUrls: ['loan-application-collateral-edit.component.scss']
})

export class LoanAppUpdateCollateralComponent implements OnInit, OnDestroy {
  @ViewChild(LoanAppCollateralFormComponent, {static: false}) public formComponent: LoanAppCollateralFormComponent;
  public loanAppId: number;
  public breadcrumbLinks = [];
  public cachedFormData: any;
  public formChanged = false;
  public svgData = SVG_DATA;
  public collateralState: any;
  public collateralId: number;
  public isOpen = false;

  private isLeaving = false;
  private isSubmitting = false;
  private nextRoute: string;
  private collateralTypeId: number;
  private loanApplicationSub: Subscription;
  private loanAppCollateralSub: Subscription;
  private createSub: Subscription;
  private formSub: Subscription;
  private routeSub: Subscription;

  constructor(private updateCollateralStore$: Store<ILoanAppCollateralUpdate>,
              private loanApplicationStore$: Store<ILoanAppState>,
              private loanAppCollateralStore$: Store<ILoanAppCollateral>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private loanAppFormStore$: Store<ILoanAppFormState>) {

    this.createSub = this.store$.pipe(select(fromRoot.getLoanAppUpdateCollateralState))
      .subscribe((state: ILoanAppCollateralUpdate) => {
        if ( state.loaded && state.success ) {
          const newCollateralId = state.response['id'];
          this.resetCollateralState();
          this.redirectToInfo(this.loanAppId, newCollateralId);
          this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
        }
      });
  }

  redirectToInfo(loanAppId, newCollateralId) {
    this.router.navigate(['/loan-applications', loanAppId, 'collateral', newCollateralId]);
  }

  ngOnInit() {
    this.loanAppFormStore$.dispatch(new fromStore.SetState('collaterals'));
    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if ( params.id ) {
        this.collateralId = params.id;
      }
    });

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((state: ILoanAppState) => {
        if ( state.success && state.loaded && state.loanApplication ) {
          this.loanAppId = state.loanApplication['id'];
          const loanProfile = state.loanApplication['profile'];
          const profileType = loanProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
            {
              name: loanProfile['name'],
              link: `/profiles/${profileType}/${loanProfile['id']}/info`
            },
            {
              name: 'LOAN_APPLICATIONS',
              link: '/loan-applications'
            },
            {
              name: state.loanApplication['code'],
              link: ''
            },
            {
              name: 'COLLATERALS',
              link: `/loan-applications/${this.loanAppId}/collaterals`
            }
          ];
          this.subscribeToLoanAppCollateral(this.loanAppId);
        }
      });
  }

  subscribeToLoanAppCollateral(loanAppId) {
    if ( this.loanAppCollateralSub ) {
      this.loanAppCollateralSub.unsubscribe();
    }
    this.loanAppCollateralSub = this.store$.pipe(select(fromRoot.getLoanAppCollateralState))
      .subscribe((collateralState) => {
          if ( !collateralState.loaded && !collateralState.loading
            && !collateralState.success && !collateralState.error ) {
            this.loanAppCollateralStore$.dispatch(
              new fromStore.LoadCollateral({loanApplicationId: loanAppId, collateralId: this.collateralId})
            );
          }

          if ( collateralState.loaded && collateralState.success && !collateralState.error ) {
            this.collateralState = collateralState;
            this.collateralTypeId = collateralState['collateral']['typeOfCollateral']['id'];
            this.breadcrumbLinks = [...this.breadcrumbLinks, {
              name: this.collateralState.collateral['name'],
              link: `/loan-applications/${this.loanAppId}/collaterals/${this.collateralState.collateral['id']}`
            }, {
              name: 'EDIT',
              link: ''
            }];

            this.cacheInitialFormData(this.collateralState.collateral);

            if ( this.collateralState.collateral['customFieldValues'].length ) {
              const collateralCustomFields = this.collateralState.collateral['customFieldValues']
                .map(field => {
                  return Object.assign({}, field.customField, {value: field.value});
                });

              setTimeout(() => {
                this.formComponent.generateCustomFields(collateralCustomFields);
              });
            }

            setTimeout(() => {
              this.formComponent.populateFields({
                name: this.collateralState.collateral['name'],
                amount: this.collateralState.collateral['amount'],
                typeOfCollateralId: this.collateralState.collateral['typeOfCollateral']['id']
              });
            });

            setTimeout(() => {
              this.subscribeToFormChanges();
            });

          }
        }
      );
  }

  cacheInitialFormData(data) {
    this.cachedFormData = {
      name: data['name'],
      amount: data['amount'],
      fieldValues: []
    };


    if ( data['customFieldValues'].length ) {
      data['customFieldValues']
        .map(field => {
          const obj = {};
          if ( field['customField']['fieldType'] === 'LOOKUP' && field.value ) {
            obj[field['customField']['name']] = field.value['id'];
          } else {
            obj[field['customField']['name']] = field.value;
          }

          this.cachedFormData.fieldValues.push(obj);
        });
    }
  }

  canDeactivate(url?) {
    this.nextRoute = url;
    if ( this.formChanged && !this.isSubmitting ) {
      this.isOpen = true;
      return this.isLeaving;
    } else {
      return true;
    }
  }

  goToNextRoute() {
    this.isLeaving = true;
    this.router.navigateByUrl(this.nextRoute);
  }

  closeConfirmPopup() {
    this.isOpen = false;
  }


  subscribeToFormChanges() {
    if ( this.formSub ) {
      this.formSub.unsubscribe();
    }
    this.formSub = this.formComponent.collateralForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(data => {
        this.formChanged = this.checkFormChanges(data, this.cachedFormData);
      });
  }

  submit() {
    if ( this.formComponent.collateralForm.valid ) {
      this.isSubmitting = true;
      const data = this.formComponent.collateralForm.value;

      const newCollateralData = {
        id: this.collateralState.collateral['id'],
        name: data.name,
        amount: data.amount,
        typeOfCollateralId: this.collateralTypeId,
        fieldValues: []
      };

      if ( this.formComponent.customFields ) {
        const customFields = [...this.formComponent.customFields];
        data.fieldValues.map((field: Object) => {
          customFields.map(item => {
            if ( field.hasOwnProperty(item.name) ) {
              newCollateralData.fieldValues.push({
                fieldId: item.id,
                value: field[item.name]
              });
            }
          });
        });
      }

      this.updateCollateralStore$.dispatch(
        new fromStore.UpdateCollateral({loanAppId: this.loanAppId, data: newCollateralData}));
    }
  }

  ngOnDestroy() {
    this.createSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.formSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
    this.loanAppCollateralSub.unsubscribe();
    this.resetState();
  }

  resetState() {
    this.updateCollateralStore$.dispatch(new fromStore.UpdateCollateralReset());
  }

  resetCollateralState() {
    this.loanAppCollateralStore$.dispatch(new fromStore.ResetCollateral());
  }

  checkFormChanges(fields, cachedData) {
    let status = false;
    const keys = Object.keys(cachedData);

    keys.map(key => {
      if ( key !== 'fieldValues' ) {
        if ( cachedData[key] !== fields[key] ) {
          status = true;
        }
      } else if ( key === 'fieldValues' ) {
        if ( cachedData[key].length !== fields[key].length ) {
          status = true;
        } else {
          cachedData[key].map(field => {
            fields[key].map(item => {
              if ( Object.keys(field)[0] === Object.keys(item)[0] ) {
                if ( field[Object.keys(field)[0]] !== item[Object.keys(item)[0]] ) {
                  status = true;
                }
              }
            });
          });
        }
      }
    });

    return status;
  }

}

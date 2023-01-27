import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ILoanInfo } from '../../../../core/store/loans/loan/loan.reducer';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { Subscription } from 'rxjs';
import { ProvisioningService } from '../../shared/services/provisioning.service';
import { environment } from '../../../../../environments/environment';

export interface Provisioning {
  isSpecific: boolean,
  isRate: boolean,
  reserve: number,
  specificReserve: number,
  specificValue: number,
  value: number
}

@Component({
  selector: 'cbs-provisioning',
  templateUrl: 'provisioning.component.html',
  styleUrls: ['provisioning.component.scss']
})

export class ProvisioningComponent implements OnInit, OnDestroy {
  public loanId: number;
  public loan: any;
  public provisioning: Provisioning;
  public breadcrumb = [];
  public specificReserve: number;
  public specificOldReserve: number;
  public specificValue: number;
  public specificOldValue: number;
  public isOpen = false;
  public disabledBtn = false;
  public isLoading = false;
  public isSpecific = false;
  public isRate = false;
  public isAmount = false;

  private routeSub: Subscription;
  private loanSub: Subscription;

  constructor(private route: ActivatedRoute,
              private translate: TranslateService,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private provisioningService: ProvisioningService,
              private loanStore$: Store<ILoanInfo>) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.routeSub = this.route.parent.parent.params
      .subscribe((params: { id }) => {
        if (params && params.id) {
          this.loanId = params.id;
          this.getProvisioning(this.loanId, 'PRINCIPAL');
        }
      });

    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loan => {
        this.loan = loan;
        if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
          const loanProfile = loan.loan['profile'];
          const profileType = loanProfile.type === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: loanProfile.name,
              link: `/profiles/${profileType}/${loanProfile.id}/info`
            },
            {
              name: 'LOANS',
              link: '/loans'
            },
            {
              name: loan.loan['code'],
              link: `/loans/${this.loanId}/${loanProfile.type}/info`
            },
            {
              name: 'OPERATIONS',
              link: `/loans/${loan.loan['id']}/operations`
            },
            {
              name: 'PROVISIONING',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  getProvisioning(loanId, provisionType) {
    this.provisioningService.getProvisioning(loanId, provisionType)
      .subscribe((res: any) => {
        if ( res ) {
          this.isLoading = false;
          this.provisioning = res;
          this.specificValue = this.provisioning.specificValue;
          this.specificOldValue = this.provisioning.specificValue;
          this.isRate = !this.provisioning.isRate;
          this.isAmount = this.provisioning.isRate;
          this.specificReserve = this.provisioning.specificReserve;
          this.specificOldReserve = this.provisioning.specificReserve;
          this.isSpecific = this.provisioning.isSpecific;
        }
      });
  }

  typeProvisionValue(setValue, typeValue) {
    if ( !setValue ) {
      this.isRate = false;
      this.isAmount = false;
    }

    if ( setValue ) {
      if ( typeValue === 'rate' ) {
        this.isAmount = true;
      } else {
        this.isRate = true;
      }
    }
  }

  valProvision(val, type) {
    this.isLoading = true;
    if ( val ) {
      if ( type === 'rate' && val !== this.specificOldValue ) {
        this.disabledBtn = true;
      } else {
        this.disabledBtn = type === 'amount' && val !== this.specificOldReserve;
      }
      this.provisioningService.getCalculateSpecificProvision(this.loanId, val, 'PRINCIPAL', !this.isRate)
        .subscribe((res: any) => {
          if ( res.message ) {
            this.translate.get('CREATE_ERROR').subscribe((response: string) => {
              this.toastrService.error(res.message, response, environment.ERROR_TOAST_CONFIG);
            });
            this.isLoading = false;
          } else {
            if ( !this.isRate ) {
              this.specificReserve = res;
            } else {
              this.specificValue = res;
            }

            this.isLoading = false;
          }
        })
    } else {
      this.isLoading = false;
      this.specificReserve = null;
      this.specificValue = null;
    }
  }

  setProvisionManually() {
    this.disabledBtn = true;
    this.isRate = false;
    this.isAmount = false;
    this.isSpecific = !this.isSpecific;
    this.specificReserve = null;
    this.specificValue = null;
  }

  resetValue() {
    this.disabledBtn = false;
    this.specificReserve = null;
    this.specificValue = null;
    this.isRate = false;
    this.isAmount = false;
  }

  openSetProvisionModal() {
    this.isOpen = true;
  }

  SetProvisioning() {
    this.isLoading = true;
    this.provisioningService.createSpecificProvision({
      loanId: this.loanId,
      provisionType: 'PRINCIPAL',
      isRate: !this.isRate,
      isSpecific: this.isSpecific,
      value: this.isRate === true ? this.specificReserve : this.specificValue
    })
      .subscribe(res => {
        if ( res.errorCode && res.httpStatus === 500 ) {
          this.translate.get('CREATE_ERROR').subscribe((response: string) => {
            this.toastrService.error(res.message, response, environment.ERROR_TOAST_CONFIG);
          });
        } else {
          this.toastrService.clear();
          const message = this.isSpecific ? 'Specific provision is enabled' : 'Specific provision is disabled';
          this.translate.get(message).subscribe((message: string) => {
            this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            this.getProvisioning(this.loanId, 'PRINCIPAL');
            this.disabledBtn = false;
          });
        }
        this.isOpen = false;
        this.isLoading = false;
      });
  }

  closeConfirmPopup() {
    this.isOpen = false;
  }

  ngOnDestroy() {
    this.loanSub.unsubscribe();
    this.routeSub.unsubscribe();
  }
}

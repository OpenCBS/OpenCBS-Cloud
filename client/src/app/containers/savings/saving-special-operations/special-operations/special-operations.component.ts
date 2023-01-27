import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fromRoot from '../../../../core/core.reducer';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../core/store';
import { ISavingState } from '../../../../core/store';
import { environment } from '../../../../../environments/environment';
import { SavingService } from '../../../../core/store/saving/saving';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ActualizeSavingService } from '../../shared/services/actualize-saving.service';
import { ParseDateFormatService } from '../../../../core/services';

@Component({
  selector: 'cbs-special-operations',
  templateUrl: 'special-operations.component.html',
  styleUrls: ['special-operations.component.scss']
})

export class SavingSpecialOperationComponent implements OnInit, OnDestroy {
  private savingSub: any;
  public breadcrumb = [];
  public savingId: number;
  public savingData: any;
  public locked: boolean;
  public status: boolean;
  public title: string;
  public opened = false;
  public isOpenActualize = false;
  public actualizeDate: any;
  public closeDate: any;
  public isLoading: boolean;
  public closeSaving = false;
  public lock = false;
  public fieldEmpty = false;
  public operationAmount: any;
  public operationDate = moment().format(environment.DATE_FORMAT_MOMENT);
  public savingProductDepositAmountMin: any;
  public savingProductDepositAmountMax: any;
  public savingProductWithdrawalAmountMin: any;
  public savingProductWithdrawalAmountMax: any;
  public depositIcon = {collection: 'custom', name: 'custom17', className: 'custom17'};
  public withdrawIcon = {collection: 'standard', name: 'client', className: 'client'};
  public actualizeIcon = {collection: 'standard', name: 'announcement', className: 'announcement'};
  public lockIcon = {collection: 'custom', name: 'custom77', className: 'custom77'};
  public unlockIcon = {collection: 'standard', name: 'task2', className: 'task2'};
  public closeIcon = {collection: 'action', name: 'close', className: 'close'};

  constructor(private savingStore$: Store<ISavingState>,
              private savingService: SavingService,
              private toastrService: ToastrService,
              private parseDateFormatService: ParseDateFormatService,
              private actualizeSavingService: ActualizeSavingService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.savingSub = this.savingStore$.select(fromRoot.getSavingState).subscribe(
      (savingState: ISavingState) => {
        if ( savingState['loaded'] && !savingState['error'] && savingState['success'] ) {
          this.savingData = savingState['saving'];
          this.status = this.savingData.status === 'OPEN';
          this.locked = this.savingData['locked'];
          this.savingProductDepositAmountMin = this.savingData.savingProductDepositAmountMin;
          this.savingProductDepositAmountMax = this.savingData.savingProductDepositAmountMax;
          this.savingProductWithdrawalAmountMin = this.savingData.savingProductWithdrawalAmountMin;
          this.savingProductWithdrawalAmountMax = this.savingData.savingProductWithdrawalAmountMax;
          this.savingId = this.savingData['id'];
          const profileType = this.savingData.profileType === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: this.savingData.profileName,
              link: `/profiles/${profileType}/${this.savingData.profileId}/info`
            },
            {
              name: 'SAVINGS',
              link: `/profiles/${profileType}/${this.savingData.profileId}/savings`
            },
            {
              name: 'OPERATIONS',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.savingStore$.dispatch(new fromStore.SetSavingBreadcrumb(this.breadcrumb));
    }, 1500);
  }

  depositWithdrawModal(data) {
    this.title = data;
    this.opened = true;
    this.fieldEmpty = true;
  }

  closeSavingModal() {
    this.closeSaving = true;
    this.closeDate = moment().format(environment.DATE_FORMAT_MOMENT);
  }

  openLockUnlockPopup() {
    this.lock = true;
  }

  closeModal() {
    this.opened = false;
    this.operationAmount = '';
    this.operationDate = moment().format(environment.DATE_FORMAT_MOMENT);
    this.lock = false;
    this.closeSaving = false;
  }

  submitDepositWithdrawSaving() {
    this.isLoading = true;
    this.operationDate = this.parseDateFormatService.parseDateValue(this.operationDate);
    if ( this.title === 'Deposit' ) {
      this.savingService.depositSaving(this.savingId, this.operationAmount, this.operationDate).subscribe(data => {
        if ( data.error ) {
          this.toastrService.clear();
          this.toastrService.error(`ERROR: ${data.message}`, '', environment.ERROR_TOAST_CONFIG);
          this.isLoading = false;
        } else {
          this.opened = false;
          this.translate.get('DEPOSIT_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
            this.isLoading = false;
          });
          this.savingStore$.dispatch(new fromStore.LoadSaving(this.savingId));
          this.operationAmount = '';
          this.operationDate = moment().format(environment.DATE_FORMAT_MOMENT);
        }
      })
    } else {
      this.savingService.withdrawSaving(this.savingId, this.operationAmount, this.operationDate).subscribe(data => {
        if ( data.error ) {
          this.toastrService.clear();
          this.toastrService.error(`ERROR: ${data.message}`, '', environment.ERROR_TOAST_CONFIG);
          this.isLoading = false;
        } else {
          this.opened = false;
          this.translate.get('WITHDRAW_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
            this.isLoading = false;
          });
          this.savingStore$.dispatch(new fromStore.LoadSaving(this.savingId));
          this.operationAmount = '';
          this.operationDate = moment().format(environment.DATE_FORMAT_MOMENT);
        }
      })
    }
  }

  checkFieldOperationAmount() {
    this.fieldEmpty = this.operationAmount === null;
  }

  openActualizeModal() {
    this.isOpenActualize = true;
    this.actualizeDate = moment().format(environment.DATE_FORMAT_MOMENT);
  }

  submitActualizeLoan() {
    this.isOpenActualize = false;
    this.isLoading = true;
    this.actualizeDate = this.parseDateFormatService.parseDateValue(this.actualizeDate);
    this.actualizeSavingService.actualizeSaving(this.savingId, this.actualizeDate).subscribe(res => {
      if ( res.error ) {
        this.toastrService.clear();
        this.toastrService.error(res.message, '', environment.ERROR_TOAST_CONFIG);
        this.isLoading = false;
      } else {
        this.translate.get('SUCCESS').subscribe((translation: string) => {
          this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.savingStore$.dispatch(new fromStore.LoadSaving(this.savingId));
        this.isLoading = false;
      }
    });
  }

  submitLockUnlockSaving() {
    this.isLoading = true;
    this.savingService.lockSaving(this.savingId).subscribe(data => {
      if ( data.error ) {
        this.toastrService.clear();
        this.toastrService.error(`ERROR: ${data.message}`, '', environment.ERROR_TOAST_CONFIG);
      } else {
        this.translate.get(this.locked ? 'UNLOCK_SUCCESS' : 'LOCK_SUCCESS').subscribe((res: string) => {
          this.toastrService.clear();
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.savingStore$.dispatch(new fromStore.LoadSaving(this.savingId));
      }
      this.isLoading = false;
    });
  }

  submitCloseSaving() {
    this.isLoading = true;
    this.closeDate = this.parseDateFormatService.parseDateValue(this.closeDate);
    this.savingService.closeSaving(this.savingId, this.closeDate).subscribe(data => {
      if ( data.error ) {
        this.toastrService.clear();
        this.toastrService.error(`ERROR: ${data.message}`, '', environment.ERROR_TOAST_CONFIG);
      } else {
        this.closeSaving = false;
        this.translate.get('CLOSE_SUCCESS').subscribe((res: string) => {
          this.toastrService.clear();
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.savingStore$.dispatch(new fromStore.LoadSaving(this.savingId));
      }
      this.isLoading = false;
    })
  }

  ngOnDestroy() {
    this.savingSub.unsubscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment'
import { VaultListService } from '../../../core/store/vaults/vault-list/vault-list.service'
import { TransfersService } from '../transfers.service'
import * as moment from 'moment';
import { ParseDateFormatService } from '../../../core/services';

const SVG_DATA = {
  collection: 'custom',
  name: 'custom57',
  class: 'custom57'
};

@Component({
  selector: 'cbs-transfer-from-vault-to-bank',
  templateUrl: './transfer-from-vault-to-bank.component.html',
  styleUrls: ['./transfer-from-vault-to-bank.component.scss']
})

export class TransferFromVaultToBankComponent implements OnInit {
  currencyConfig = {
    url: `${environment.API_ENDPOINT}currencies/lookup`
  };
  formUserConfig = {
    url: `${environment.API_ENDPOINT}users/lookup`
  };
  accountFilterConfig = {
    url: `${environment.API_ENDPOINT}accounting/lookup?accountTypes=${['BALANCE']}&typeOfAccount=DEBIT`
  };
  svgData = SVG_DATA;
  form: FormGroup;
  vaults = [];
  showConfirmModal = false;
  isSubmittingTransfer = false;
  selectedFormFieldLabels = {};
  balance: number;
  hasBalance = false;
  date = moment().format(environment.DATE_FORMAT_MOMENT);

  constructor(private vaultListService: VaultListService,
              private translate: TranslateService,
              private toastrService: ToastrService,
              private router: Router,
              private parseDateFormatService: ParseDateFormatService,
              private transfersService: TransfersService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      vaultId: new FormControl('', Validators.required),
      bankAccountId: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      date: new FormControl(this.date, Validators.required),
      currencyId: new FormControl('', Validators.required),
      personInCharge: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });

    this.vaultListService.getVaultList().subscribe(data => {
      if ( data.content ) {
        this.vaults = data.content.map(vault => ({
          value: vault.id,
          name: vault.name,
          accountId: vault.accounts[0].id
        }));
      }
    })
  }

  submit({value, valid}: FormGroup) {
    if ( valid ) {
      this.showConfirmModal = false;
      this.isSubmittingTransfer = true;
      value = {
        ...value,
        date: this.parseDateFormatService.parseDateValue(value.date)
      };

      this.transfersService
        .transferToBank(value)
        .subscribe((res: any) => {
          if ( res.error ) {
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.toastrService.clear();
            this.translate.get('TRANSFER_SUCCESS').subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['/transfers']);
          }
          this.isSubmittingTransfer = false;
        });
    }
  }

  handleConfirmModalVisibility(isVisible: boolean) {
    this.showConfirmModal = isVisible;
  }

  markSelectedFieldLabel(selectedData: any, fieldName: string) {
    if ( fieldName === 'vaultId' ) {
      this.vaults.map(val => {
        if ( selectedData === val.value) {
          this.transfersService.getAccountBalance(val.accountId).subscribe(accountingBalance => {
            this.balance = 0 < accountingBalance ? accountingBalance : 0;
          });
          this.hasBalance = true;
        }
      });
      const vault = this.vaults.find(item => item.value === selectedData);
      if ( vault ) {
        this.selectedFormFieldLabels[fieldName] = vault.name
      }
    } else if ( fieldName === 'bankAccountId' ) {
      this.selectedFormFieldLabels[fieldName] = `${selectedData.number} | ${selectedData.name}`
    } else if ( fieldName === 'personInCharge' ) {
      this.selectedFormFieldLabels[fieldName] = selectedData.name;
      this.form.controls['personInCharge'].setValue(selectedData.id);
    } else {
      this.selectedFormFieldLabels[fieldName] = selectedData.name
    }
  }
}

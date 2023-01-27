import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment'
import { VaultListService } from '../../../core/store/vaults/vault-list/vault-list.service'
import { TransfersService } from '../transfers.service'
import * as moment from 'moment';
import { ParseDateFormatService, PrintOutService } from '../../../core/services';
import * as FileSaver from 'file-saver';

const SVG_DATA = {
  collection: 'standard',
  name: 'asset_relationship',
  class: 'asset-relationship'
};

@Component({
  selector: 'cbs-transfer-between-members',
  templateUrl: './transfer-between-members.component.html',
  styleUrls: ['./transfer-between-members.component.scss']
})

export class TransferBetweenMembersComponent implements OnInit {
  currencyConfig = {
    url: `${environment.API_ENDPOINT}currencies/lookup`
  };
  accountFilterConfig = {
    url: `${environment.API_ENDPOINT}accounting/lookup/current-accounts`
  };
  svgData = SVG_DATA;
  form: FormGroup;
  vaults = [];
  showConfirmModal = false;
  isSubmittingTransfer = false;
  selectedFormFieldLabels = {};
  sourceAccountCurrency: string;
  receiptFormId: number;
  receiptFormLabel: string;
  balance: number;
  hasBalance = false;
  date = moment().format(environment.DATE_FORMAT_MOMENT);

  constructor(private vaultListService: VaultListService,
              private translate: TranslateService,
              private toastrService: ToastrService,
              private router: Router,
              private printingFormService: PrintOutService,
              private parseDateFormatService: ParseDateFormatService,
              private transfersService: TransfersService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      sourceAccountId: new FormControl('', Validators.required),
      destinationAccountId: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      date: new FormControl(this.date, Validators.required),
      description: new FormControl('', Validators.required),
      autoPrint: new FormControl('')
    });

    this.vaultListService.getVaultList().subscribe(data => {
      if ( data.content ) {
        this.vaults = data.content.map(vault => ({
          value: vault.id,
          name: vault.name
        }))
      }
    });

    this.printingFormService.getForms('TRANSFER_MEMBERS').subscribe(res => {
      if ( res.err ) {
        this.toastrService.error(res.err, '', environment.ERROR_TOAST_CONFIG);
      } else {
        this.receiptFormId = res[0]['id'];
        this.receiptFormLabel = res[0]['label'];
      }
    });
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
        .transferBetweenMembers(value)
        .subscribe((res: any) => {
          if ( res.error ) {
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          } else {
            if ( this.form.controls['autoPrint'].value ) {
              const objToSend = {
                entityId: +res.id,
                templateId: this.receiptFormId
              };
              setTimeout(() => {
                this.printingFormService.downloadForm(objToSend, 'TRANSFER_MEMBERS').subscribe(resp => {
                  if ( resp.err ) {
                    this.translate.get('CREATE_ERROR').subscribe((response: string) => {
                      this.toastrService.error(resp.err, response, environment.ERROR_TOAST_CONFIG);
                    });
                  } else {
                    FileSaver.saveAs(resp, `${this.receiptFormLabel}.docx`)
                  }
                })
              }, 500)
            }
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
    if ( fieldName === 'sourceAccountId' ) {
      this.transfersService.getAccountBalance(selectedData.id).subscribe(accountingBalance => {
        this.balance = 0 < accountingBalance ? accountingBalance : 0;
      });
      this.hasBalance = true;
      this.sourceAccountCurrency = selectedData.currency.name;
    }
    if ( fieldName === 'destinationAccountId' || fieldName === 'sourceAccountId' ) {
      this.selectedFormFieldLabels[fieldName] = `${selectedData.number} | ${selectedData.name}`
    } else {
      this.selectedFormFieldLabels[fieldName] = selectedData.name
    }
  }
}

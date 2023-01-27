import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as IntegrationWithBankImportUtils from '../../shared/integration-with-bank-import.utils';
import { RepaymentImportingLoansService } from '../../services/repayment-importing-loans.service';
import { Router } from '@angular/router';

const SVG_DATA = {
  collection: 'standard',
  class: 'product-consumed',
  name: 'product_consumed'
};

@Component({
  selector: 'cbs-integration-with-bank-import-file',
  templateUrl: 'integration-with-bank-import-file.component.html',
  styleUrls: ['integration-with-bank-import-file.component.scss']
})

export class IntegrationWithBankImportFileComponent implements OnInit {
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'SETTINGS',
      link: '/settings'
    },
    {
      name: 'INTEGRATION_WITH_BANK',
      link: '/settings/integration-with-bank'
    },
    {
      name: 'IMPORT',
      link: ''
    }
  ];
  public integrationWithBankImportFile = {};
  public isOpenUploadModal = false;
  public opened = false;
  public navElements = [];
  public isLoading = false;
  public url = `${environment.API_ENDPOINT}sepa/integration/import/parse-xml`

  constructor(private toastrService: ToastrService,
              private translate: TranslateService,
              private router: Router,
              private repaymentImportingLoansService: RepaymentImportingLoansService) {
  }

  ngOnInit() {
    this.navElements = IntegrationWithBankImportUtils.setNavElements();
  }

  repayModal() {
    this.opened = true;
  }


  closeModal() {
    this.opened = false;
  }

  repay() {
    this.isLoading = true;
    let sendToFields = {
      documentUid: '',
      data: []
    };
    this.integrationWithBankImportFile['data'].data.map(loan => {
      if ( loan.isValid ) {
        sendToFields.data.push(loan);
      }
    });

    sendToFields = {
      ...sendToFields,
      documentUid: this.integrationWithBankImportFile['data'].documentUid
    }

    this.repaymentImportingLoansService.repayImportingLoans(sendToFields).subscribe(
      (res: any) => {
        if ( res.error ) {
          this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
        } else {
          this.router.navigate(['/integration-with-bank/integration-with-bank-import-file-list'])
          this.translate.get('REPAY_SUCCESS').subscribe((message: string) => {
            this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
          });
        }
        this.isLoading = false
      });
  }

  onUpload(event) {
    this.isLoading = true;
    if ( event.xhr && event.xhr.status === 200 ) {
      this.integrationWithBankImportFile = JSON.parse(event.xhr.response)
      this.closeUploadModal();
      this.translate.get('IMPORTED_SUCCESS').subscribe((res: string) => {
        this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
      });
    }
    this.isLoading = false;
  }

  onError(err) {
    if ( err.xhr && (err.xhr.status >= 400 && err.xhr.status <= 500) ) {
      const response = JSON.parse(err.xhr.response);
      this.closeUploadModal();
      this.toastrService.error(response.message, '', environment.ERROR_TOAST_CONFIG);
    }
  }

  onClear() {
    this.closeUploadModal();
  }

  openUploadModal() {
    this.isOpenUploadModal = true;
  }

  closeUploadModal() {
    this.isOpenUploadModal = false;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../core/core.reducer';
import * as moment from 'moment';
import { environment } from '../../../../../../../environments/environment';
import * as fromStore from '../../../../../../core/store';
import { Subscription } from 'rxjs';
import { IIntegrationWithBankExport, IntegrationWithBankExportService } from '../../../../../../core/store'
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import * as IntegrationWithBankExportUtils from '../../shared/integration-with-bank-export.utils';

const SVG_DATA = {
  collection: 'standard',
  class: 'sales-path',
  name: 'sales_path'
};

@Component({
  selector: 'cbs-integration-with-bank-export-file',
  templateUrl: 'integration-with-bank-export-file.component.html',
  styleUrls: ['integration-with-bank-export-file.component.scss']
})

export class IntegrationWithBankExportFileComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public navElements = [];
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
      name: 'EXPORT',
      link: ''
    }
  ];
  public integrationWithBankExport: IIntegrationWithBankExport;
  public selectedLoans = [];
  public exportDate = moment().format(environment.DATE_FORMAT_MOMENT);

  private integrationWithBankExportSub: Subscription;

  constructor(private integrationWithBankExportStore: Store<IIntegrationWithBankExport>,
              private integrationWithBankExportService: IntegrationWithBankExportService,
              private toastrService: ToastrService,
              public translate: TranslateService,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.navElements = IntegrationWithBankExportUtils.setNavElements();
    this.integrationWithBankExportStore.dispatch(new fromStore.LoadIntegrationWithBankExport({
      params: {
        date: this.exportDate
      }
    }));

    this.integrationWithBankExportSub = this.store$.pipe(select(fromRoot.getIntegrationWithBankExportState)).subscribe(
      (state: IIntegrationWithBankExport) => {
        this.integrationWithBankExport = state;
        this.selectedLoans = this.integrationWithBankExport.integrationWithBankExport;
      }, error => {
        this.toastrService.error(error.message ? error.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
      });
  }

  generate() {
    this.integrationWithBankExportStore.dispatch(new fromStore.ResetIntegrationWithBankExport());
    this.integrationWithBankExportStore.dispatch(new fromStore.LoadIntegrationWithBankExport({
      params: {
        date: this.exportDate
      }
    }));
  }

  exportToBank() {
    const sendExportData = [];
    this.selectedLoans.map(loan => {
      sendExportData.push(loan.code);
    });

    this.integrationWithBankExportService.exportIntegrationWithBankExport({date: this.exportDate}, sendExportData).subscribe(
      (response: any) => {
        FileSaver.saveAs(response, `EXPORT_FILE ${this.exportDate}.xml`)
        this.translate.get('EXPORT_SUCCESS').subscribe((message: string) => {
          this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
        });
      }, err => {
        this.translate.get('EXPORT_ERROR')
          .subscribe((res: string) => {
            this.toastrService.error(err.error.message, res, environment.ERROR_TOAST_CONFIG);
          });
      });
  }

  setDate(date) {
    if ( date ) {
      this.exportDate = date;
    }
  }

  ngOnDestroy() {
    this.integrationWithBankExportSub.unsubscribe();
  }
}

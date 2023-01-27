import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../core/core.reducer';
import { environment } from '../../../../../../../environments/environment';
import * as fromStore from '../../../../../../core/store';
import { Observable, Subscription } from 'rxjs';
import {
  IIntegrationWithBankExportFileList,
  IntegrationWithBankExportFileListService
} from '../../../../../../core/store'
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as IntegrationWithBankExportUtils from '../../shared/integration-with-bank-export.utils';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';

const SVG_DATA = {
  collection: 'standard',
  class: 'timesheet',
  name: 'timesheet'
};

@Component({
  selector: 'cbs-integration-with-bank-export-file-list',
  templateUrl: 'integration-with-bank-export-file-list.component.html',
  styleUrls: ['integration-with-bank-export-file-list.component.scss']
})

export class IntegrationWithBankExportFileListComponent implements OnInit, OnDestroy {
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
      name: 'EXPORTED_FILE_LIST',
      link: ''
    }
  ];
  public queryObject = {
    page: 1,
    size: 20,
  };
  public exportDate = moment().format(environment.DATE_FORMAT_MOMENT);
  public integrationWithBankExportFileList: IIntegrationWithBankExportFileList;
  public navElements = [];
  public integrationWithBankExportFileListData: Observable<IIntegrationWithBankExportFileList>;

  private integrationWithBankExportFileListSub: Subscription;
  private currentPageSub: Subscription;

  constructor(private integrationWithBankExportFileListStore: Store<IIntegrationWithBankExportFileList>,
              private integrationWithBankExportFileListService: IntegrationWithBankExportFileListService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private router: Router,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.navElements = IntegrationWithBankExportUtils.setNavElements();
    this.integrationWithBankExportFileListStore.dispatch(new fromStore.LoadIntegrationWithBankExportFileList({
      params: {
        ...this.queryObject
      }
    }));

    this.integrationWithBankExportFileListSub = this.store$.pipe(select(fromRoot.getIntegrationWithBankExportFileListState))
      .subscribe(
        (state: IIntegrationWithBankExportFileList) => {
          this.integrationWithBankExportFileList = state;
        }, error => {
          this.toastrService.error(error.message ? error.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
        });

    this.integrationWithBankExportFileListData = this.store$.pipe(select(fromRoot.getIntegrationWithBankExportFileListState));
    this.currentPageSub = this.integrationWithBankExportFileListData
      .pipe(this.getCurrentPage())
      .subscribe(
        (page: number) => {
          this.queryObject = Object.assign(
            {},
            this.queryObject,
            {
              page: page
            });
        });
  }

  getCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        ...this.queryObject,
        page
      }
    };
    this.router.navigate(['/integration-with-bank/integration-with-bank-export-file-list'], navigationExtras);
    this.integrationWithBankExportFileListStore.dispatch(new fromStore.LoadIntegrationWithBankExportFileList({
      params: {
        ...this.queryObject,
      }
    }));
  }

  ngOnDestroy() {
    this.integrationWithBankExportFileListSub.unsubscribe();
    this.currentPageSub.unsubscribe();
  }
}

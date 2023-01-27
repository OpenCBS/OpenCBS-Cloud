import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../core/core.reducer';
import { environment } from '../../../../../../../environments/environment';
import * as fromStore from '../../../../../../core/store';
import { Observable, Subscription } from 'rxjs';
import {
  IIntegrationWithBankImportFileList,
  IntegrationWithBankImportFileListService
} from '../../../../../../core/store'
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as IntegrationWithBankImportUtils from '../../shared/integration-with-bank-import.utils';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';

const SVG_DATA = {
  collection: 'standard',
  class: 'timesheet',
  name: 'timesheet'
};

@Component({
  selector: 'cbs-integration-with-bank-import-file-list',
  templateUrl: 'integration-with-bank-import-file-list.component.html',
  styleUrls: ['integration-with-bank-import-file-list.component.scss']
})

export class IntegrationWithBankImportFileListComponent implements OnInit, OnDestroy {
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
      name: 'IMPORTED_FILE_LIST',
      link: ''
    }
  ];
  public queryObject = {
    page: 1,
    size: 20,
  };
  public exportDate = moment().format(environment.DATE_FORMAT_MOMENT);
  public integrationWithBankImportFileList: IIntegrationWithBankImportFileList;
  public navElements = [];
  public integrationWithBankImportFileListData: Observable<IIntegrationWithBankImportFileList>;

  private integrationWithBankImportFileListSub: Subscription;
  private currentPageSub: Subscription;

  constructor(private integrationWithBankImportFileListStore: Store<IIntegrationWithBankImportFileList>,
              private integrationWithBankImportFileListService: IntegrationWithBankImportFileListService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private router: Router,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.navElements = IntegrationWithBankImportUtils.setNavElements();
    this.integrationWithBankImportFileListStore.dispatch(new fromStore.LoadIntegrationWithBankImportFileList({
      params: {
        ...this.queryObject
      }
    }));

    this.integrationWithBankImportFileListSub = this.store$.pipe(select(fromRoot.getIntegrationWithBankImportFileListState))
      .subscribe(
        (state: IIntegrationWithBankImportFileList) => {
          this.integrationWithBankImportFileList = state;
        }, error => {
          this.toastrService.error(error.message ? error.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
        });

    this.integrationWithBankImportFileListData = this.store$.pipe(select(fromRoot.getIntegrationWithBankImportFileListState));
    this.currentPageSub = this.integrationWithBankImportFileListData
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
    this.router.navigate(['/integration-with-bank/integration-with-bank-import-file-list'], navigationExtras);
    this.integrationWithBankImportFileListStore.dispatch(new fromStore.LoadIntegrationWithBankImportFileList({
      params: {
        ...this.queryObject,
      }
    }));
  }

  ngOnDestroy() {
    this.integrationWithBankImportFileListSub.unsubscribe();
    this.currentPageSub.unsubscribe();
  }
}

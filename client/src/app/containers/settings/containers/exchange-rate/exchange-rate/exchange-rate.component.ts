import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store/index';
import { environment } from '../../../../../../environments/environment';
import { ExchangeRateService, ExchangeRateState } from '../../../../../core/store/index';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { isEmpty } from 'lodash'

@Component({
  selector: 'cbs-exchange-rate',
  templateUrl: 'exchange-rate.component.html',
  styleUrls: ['exchange-rate.component.scss']
})

export class ExchangeRateComponent implements OnInit, OnDestroy {
  public profileType: any;
  public form: FormGroup;
  public transactions: any;
  public startDate: any;
  public exchangeRateData: any;
  public isLoading = false;
  public breadcrumbLinks = [
    {
      name: 'EXCHANGE_RATE',
      link: '/exchange-rate'
    }
  ];
  public svgData = {
    collection: 'standard',
    class: 'service-report',
    name: 'service_report'
  };
  private MONTH_AGO = moment().startOf('month').format('YYYY-MM-DD');
  public queryObject = {
    fromDate: this.MONTH_AGO,
    toDate: moment().format('YYYY-MM-DD'),
    page: 1
  };
  private paramsSub: any;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private store$: Store<fromRoot.State>,
              private exchangeRateService: ExchangeRateService,
              public toastrService: ToastrService,
              private router: Router,
              public translate: TranslateService,
              private exchangeRateStore$: Store<ExchangeRateState>) {
  }

  loadTransaction() {
    this.startDate = this.MONTH_AGO;

    this.exchangeRateStore$
    .dispatch(new fromStore.LoadExchangeRate(this.queryObject));
  }

  ngOnInit() {
    this.loadTransaction();
    this.exchangeRateData = this.exchangeRateStore$.select(fromRoot.getExchangeRateState);

    this.paramsSub = this.route.queryParams
    .subscribe(query => {
      this.queryObject = {
        page: !isEmpty(query) ? query['page'] : 1,
        fromDate: !isEmpty(query) ? query['fromDate'] : this.MONTH_AGO,
        toDate: !isEmpty(query) ? query['toDate'] : moment().format('YYYY-MM-DD')
      };
      this.exchangeRateStore$.dispatch(new fromStore.LoadExchangeRate(this.queryObject));
    });

    this.form = this.fb.group({
      start: new FormControl(this.MONTH_AGO, Validators.required),
      end: new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
    });
  }

  goToPage(page: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        ...this.queryObject, page
      }
    };
    this.router.navigate(['/settings', 'exchange-rate'], navigationExtras);
  }

  filter() {
    this.startDate = this.form.controls['start'].value;
    this.exchangeRateStore$.dispatch(new fromStore.ResetExchangeRateReset());
    this.queryObject = {
      page: 1,
      fromDate: this.form.value.start,
      toDate: this.form.value.end
    };
    this.goToPage(1)
  }

  updateExchangeRate() {
    this.isLoading = true;
    this.exchangeRateService.updateExchangeRate()
    .pipe(
      catchError((res: any) => {
        this.toastrService.clear();
        this.toastrService.error(`ERROR: ${res.error.message}`, '', environment.ERROR_TOAST_CONFIG);
        this.isLoading = false;
        return throwError(res)
      })
    ).subscribe(data => {
      if (data['error']) {
      } else {
        this.translate.get(data.message).subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          this.isLoading = false;
          this.filter();
        });
      }
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.exchangeRateStore$
    .dispatch(new fromStore.ResetExchangeRateReset());
  }
}

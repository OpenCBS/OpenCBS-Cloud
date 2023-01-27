import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import {
  TillInfoActions,
  ITillInfo,
  IUpdateTill,
  TillUpdateActions
} from '../../../../../core/store';
import { TillFormComponent } from '../till-form/till-form.component';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'cbs-till-edit',
  templateUrl: 'till-edit.component.html'
})

export class TillEditComponent implements OnInit, OnDestroy {
  @ViewChild(TillFormComponent, {static: false}) tillForm: TillFormComponent;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'TELLER_MANAGEMENT',
      link: '/configuration/tills'
    },
    {
      name: '',
      link: ''
    },
    {
      name: 'EDIT',
      link: ''
    }
  ];
  public svgData = {
    collection: 'standard',
    class: 'client',
    name: 'client'
  };
  public tillId: number;

  private tillSub: any;
  private routeSub: any;
  private tillUpdateSub: any;

  constructor(private tillInfoStore$: Store<ITillInfo>,
              private tillInfoActions: TillInfoActions,
              private tillUpdateStore$: Store<IUpdateTill>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService,
              private tillUpdateActions: TillUpdateActions,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.tillUpdateSub = this.store$.select(fromRoot.getTillUpdateState)
    .subscribe((tillUpdate: IUpdateTill) => {
      if (tillUpdate.loaded && tillUpdate.success && !tillUpdate.error) {
        this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.goToViewInfo();
      } else if (tillUpdate.loaded && !tillUpdate.success && tillUpdate.error) {
        this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
          this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState();
      }
    });

    this.routeSub = this.route.params.subscribe((params: { id }) => {
      if (params.id) {
        this.tillId = params.id;
        this.tillInfoStore$.dispatch(this.tillInfoActions.fireInitialAction(params.id))
      }
    });
    this.tillSub = this.store$.select(fromRoot.getTillInfoState)
    .subscribe((tillInfo: ITillInfo) => {
      if (tillInfo.loaded && tillInfo.success && !tillInfo.error) {
        this.tillForm.loadCurrencies(tillInfo);
        this.breadcrumbLinks[2] = {
          name: tillInfo['data']['name'],
          link: ''
        }
      }
    });
  }

  goToViewInfo() {
    this.router.navigate(['configuration', 'tills', this.tillId])
  }

  submitForm() {
    this.tillForm.form.value['accounts'] = this.tillForm.form.value['accounts']
    .map(currency => currency[Object.keys(currency)[0]]);
    this.tillUpdateStore$.dispatch(this.tillUpdateActions
    .fireInitialAction({till: this.tillForm.form.value, id: this.tillId}));
  }

  resetState() {
    this.tillUpdateStore$.dispatch(this.tillUpdateActions.fireResetAction());
  }

  ngOnDestroy() {
    this.resetState();
    this.routeSub.unsubscribe();
    this.tillSub.unsubscribe();
    this.tillUpdateSub.unsubscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import * as fromRoot from '../../../../core/core.reducer';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as fromStore from '../../../../core/store';
import { BondState } from '../../../../core/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';
import { ActualizeBondService } from '../../shared/services/actualize-bond.service';
import { ValueDateBondService } from '../../shared/services/value-date-bond.service';

@Component({
  selector: 'cbs-bond-operations',
  templateUrl: 'operations.component.html',
  styleUrls: ['operations.component.scss']
})

export class BondOperationsComponent implements OnInit {
  public arr = [];
  public disabledOperationIcons: boolean;
  public disabledIcons: boolean;
  private bondSub: any;
  public bond: any;
  public breadcrumb = [];
  public actualizeDate: any;
  public valueDate: any;
  public isOpenActualize = false;
  public isOpenValueDate = false;
  public isLoading = false;
  public bondId: number;
  public actualizeIcon = {collection: 'standard', name: 'announcement', className: 'announcement'};
  public valueDateIcon = {collection: 'custom', name: 'custom83', className: 'custom83'};

  constructor(private bondStore$: Store<BondState>,
              private translate: TranslateService,
              private toastrService: ToastrService,
              private actualizeBondService: ActualizeBondService,
              private valueDateBondService: ValueDateBondService,
              private router: Router) {
  }

  ngOnInit() {
    this.bondSub = this.bondStore$.select(fromRoot.getBondState).subscribe(
      (bondState: BondState) => {
        if ( bondState['loaded'] && !bondState['error'] && bondState['success'] ) {
          this.bond = bondState['bond'];
          this.bond.valueDate === null ? this.disabledIcons = false : this.disabledIcons = true;
          this.bondId = this.bond['id'];
          this.bond.status === 'CLOSED' ? this.disabledOperationIcons = true : this.disabledOperationIcons = false;
          const bondProfile = bondState['bond']['profile'];
          const profileType = bondProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: bondProfile['name'],
              link: `/profiles/${profileType['type']}/${bondProfile['id']}/info`
            },
            {
              name: 'BONDS',
              link: `/profiles/${profileType}/${bondProfile['id']}/bonds`
            },
            {
              name: 'OPERATIONS',
              link: ''
            }
          ];

          this.arr = [
            {
              name: 'REPAYMENT',
              route: `/bonds/${bondState['bond']['id']}/schedule/repayment`,
              icon: {collection: 'standard', name: 'product_request', className: 'product-request'},
              disabled: this.disabledOperationIcons
            }
          ]
        }
      });

    setTimeout(() => {
      this.bondStore$.dispatch(new fromStore.SetBondBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  openActualizeModal() {
    this.isOpenActualize = true;
    this.actualizeDate = moment().format(environment.DATE_FORMAT_MOMENT);
  }

  submitActualize() {
    this.isOpenActualize = false;
    this.isLoading = true;
    this.actualizeBondService.actualizeBond(this.bondId, this.actualizeDate).subscribe(res => {
      if ( res.error ) {
        this.toastrService.clear();
        this.toastrService.error(res.message, '', environment.ERROR_TOAST_CONFIG);
        this.isLoading = false;
      } else {
        this.translate.get('SUCCESS').subscribe((translation: string) => {
          this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.bondStore$.dispatch(new fromStore.LoadBond(this.bondId));
        this.isLoading = false;
      }
    });
  }

  openValueDateModal() {
    this.isOpenValueDate = true;
    this.valueDate = moment().format(environment.DATE_FORMAT_MOMENT);
  }

  submitValueDate() {
    this.isOpenValueDate = false;
    this.valueDateBondService.valueDateBond(this.bondId, this.valueDate).subscribe((res: any) => {
      if ( res ) {
        this.toastrService.clear();
        this.toastrService.error(null, res.message, environment.ERROR_TOAST_CONFIG);
      } else {
        this.translate.get('SUCCESS').subscribe((message: string) => {
          this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.bondStore$.dispatch(new fromStore.LoadBond(this.bondId));
      }
    });
  }

  navigate(item) {
    this.router.navigateByUrl(item.route);
  }
}

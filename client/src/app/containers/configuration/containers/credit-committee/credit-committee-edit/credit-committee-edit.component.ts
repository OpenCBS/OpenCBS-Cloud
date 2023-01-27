import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { environment } from '../../../../../../environments/environment';
import {
  CCRulesInfoState,
  UpdateCCRulesState,
} from '../../../../../core/store/credit-committee';
import { CCRulesFormComponent } from '../shared/credit-committee-form.component';
import { Subscription } from 'rxjs/Rx';

const SVG_DATA = {
  collection: 'standard',
  class: 'team-member',
  name: 'team_member'
};

@Component({
  selector: 'cbs-credit-committee-edit',
  templateUrl: 'credit-committee-edit.component.html',
  styleUrls: ['credit-committee-edit.component.scss']
})

export class CCRulesEditComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(CCRulesFormComponent, {static: true}) formComponent: CCRulesFormComponent;

  public isHidden = true;
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'CREDIT_COMMITTEE',
      link: '/configuration/credit-committee-rules'
    },
    {
      name: 'DETAILS',
      link: ''
    }
  ];
  public ccId: number;
  public creditCommittee: any;
  public amount: any;
  public roles = [];
  public formChanged = false;
  public cachedRoles = [];
  public isOpen = false;

  private isLeaving = false;
  private isSubmitting = false;
  private nextRoute: string;
  private creditCommitteeInfoSub: Subscription;
  private ccUpdateSub: Subscription;
  private routeSub: Subscription;

  constructor(private route: ActivatedRoute,
              private ccRulesInfoStore$: Store<CCRulesInfoState>,
              private ccRulesUpdateStore$: Store<UpdateCCRulesState>,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private router: Router,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.ccId = params['id'];
      this.loadCCRulesInfo(this.ccId);
      this.creditCommitteeInfoSub = this.store$.pipe(select(fromRoot.getCcRulesInfoState))
        .subscribe((state: CCRulesInfoState) => {
          if ( state.loaded && state.success && !state.error ) {
            this.amount = state.ccRules['maxValue'];
            this.cachedRoles = this.deepCopy(state.ccRules['roles']);
            this.formComponent.setValues(this.amount, [...state.ccRules['roles']]);
            this.isHidden = false;
          }
        });
      this.ccUpdateSub = this.store$.pipe(select(fromRoot.getCcRulesUpdateState))
        .subscribe((ccState: UpdateCCRulesState) => {
          if ( ccState.loaded && ccState.success && !ccState.error ) {
            this.translate.get('UPDATE_SUCCESS').subscribe((res: string) => {
              this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.resetState();
            this.router.navigate(['/configuration', 'credit-committee-rules-info', this.ccId]);
          } else if ( ccState.loaded && !ccState.success && ccState.error ) {
            this.translate.get('UPDATE_ERROR').subscribe((res: string) => {
              this.toastrService.error(ccState.errorMessage, res, environment.ERROR_TOAST_CONFIG);
            });
            this.resetState();
          }
        });
    });
  }

  deepCopy(arr) {
    const newArray = [];

    arr.map(item => {
      newArray.push(item);
    });

    return newArray;
  }

  canDeactivate(url?) {
    this.nextRoute = url;
    if ( this.formChanged && !this.isSubmitting ) {
      this.isOpen = true;
      return this.isLeaving;
    } else {
      return true;
    }
  }

  goToNextRoute() {
    this.isLeaving = true;
    this.router.navigateByUrl(this.nextRoute);
  }

  closeConfirmPopup() {
    this.isOpen = false;
  }

  ngAfterViewInit() {
    this.formComponent.form.valueChanges.subscribe(a => {
      this.formChanged = a['amount'] !== this.amount;
    });
  }

  ngOnDestroy() {
    this.ccUpdateSub.unsubscribe();
    this.creditCommitteeInfoSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.resetState();
  }

  loadCCRulesInfo(id) {
    this.ccRulesInfoStore$.dispatch(new fromStore.LoadCCRulesInfo(id));
  }

  goToViewCCRules() {
    this.router.navigate(['/configuration', 'credit-committee-rules']);
  }

  submit() {
    this.isSubmitting = true;
    const creditCommittee = Object.assign({}, this.formComponent.form.value, {
      roleIds: this.formComponent.selectedItems.map(item => item.id)
    });
    this.ccRulesUpdateStore$.dispatch(new fromStore.UpdateCCRules({creditCommittee: creditCommittee, ccId: this.ccId}));
  }

  resetState() {
    this.ccRulesUpdateStore$.dispatch(new fromStore.UpdateCCRulesReset());
  }

  check(selectedItem) {
    if ( !selectedItem.length ) {
      this.formChanged = false;
      return true
    }
    this.formChanged = !this.checkFormChanges(selectedItem);
  }

  compare(a, b) {
    const idA = a.id;
    const idB = b.id;

    let comparison = 0;
    if ( idA > idB ) {
      comparison = 1;
    } else if ( idA < idB ) {
      comparison = -1;
    }
    return comparison;
  }

  checkFormChanges(fields) {
    fields.sort(this.compare);
    this.cachedRoles.sort(this.compare);
    let status = false;
    if ( fields.length === this.cachedRoles.length ) {
      fields.map(item => {
        for (const key in item) {
          if ( item.hasOwnProperty(key) ) {
            this.cachedRoles.map(role => {
              if ( key === 'id') {
                status = role[key] === item[key];
              }
            });
          }
        }
      });
    }
    return status;
  }
}

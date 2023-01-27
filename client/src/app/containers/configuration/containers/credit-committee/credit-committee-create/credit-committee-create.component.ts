import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { CCRulesFormComponent } from '../shared/credit-committee-form.component';
import { CreateCCRuleState } from '../../../../../core/store/credit-committee';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

@Component({
  selector: 'cbs-credit-committee-new-rules',
  templateUrl: 'credit-committee-create.component.html',
  styleUrls: ['credit-committee-create.component.scss']
})

export class CCNewRulesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(CCRulesFormComponent, {static: false}) formComponent: CCRulesFormComponent;
  public svgData = {
    collection: 'standard',
    class: 'team-member',
    name: 'team_member'
  };
  isValid = true;
  public breadcrumbLinks = [
    {
      name: 'CREDIT_COMMITTEE',
      link: '/configuration/credit-committee-rules'
    },
    {
      name: 'CREATE',
      link: ''
    }
  ];


  private createSub: any;

  constructor(private ccRulesCreateStore$: Store<CreateCCRuleState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService) {
  }

  goToViewCCRules() {
    this.router.navigate(['/configuration', 'credit-committee-rules']);
  }

  ngOnInit() {
    this.createSub = this.store$.select(fromRoot.getCcRuleCreateState)
    .subscribe((state: CreateCCRuleState) => {
      if (state.loaded && state.success && !state.error) {
        this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.router.navigate(['/configuration', 'credit-committee-rules-info', state['response']['id']]);
        this.resetState();
      } else if (state.loaded && !state.success && state.error) {
        this.translate.get('CREATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState();
      }
    });
  }

  submitForm() {
    const creditCommittee = Object.assign({}, this.formComponent.form.value, {
      roleIds: this.formComponent.selectedItems.map(item => item.id)
    });
    this.ccRulesCreateStore$.dispatch(new fromStore.CreateCCRule(creditCommittee));
  }


  ngOnDestroy() {
    this.ccRulesCreateStore$.dispatch(new fromStore.CreateCCRuleReset);
    this.createSub.unsubscribe();
    this.resetState();
  }

  resetState() {
    this.ccRulesCreateStore$.dispatch(new fromStore.CreateCCRuleReset);
  };

  ngAfterViewInit() {
    this.formComponent.form.valueChanges.subscribe(a => {
      if (a['amount'] && this.formComponent.selectedItems.length) {
        this.isValid = false;
      } else {
        this.isValid = true;
      }
    });
  }

  check(event) {
    if (this.formComponent.form.controls['amount'].value && this.formComponent.selectedItems.length) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }
}

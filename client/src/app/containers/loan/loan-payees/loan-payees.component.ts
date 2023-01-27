import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import {
  ILoanInfo,
  ILoanAppState
} from '../../../core/store';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
  selector: 'cbs-loan-payees',
  templateUrl: 'loan-payees.component.html',
  styleUrls: ['loan-payees.component.scss'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

export class LoanPayeesComponent implements OnInit, OnDestroy {
  public loanAppPayees = [];
  public loadAppPayees: any;
  public isLoading = false;

  private breadcrumb: any;
  private loanAppId: number;
  private loanApplicationSub: any;

  constructor(private location: Location,
              private loanStore$: Store<ILoanInfo>,
              private loanApplicationStore$: Store<ILoanAppState>,
              private route: ActivatedRoute,
              private router: Router,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState)).subscribe(
      (loanAppState: ILoanAppState) => {
        this.loadAppPayees = loanAppState;
        if (loanAppState.success && loanAppState.loaded && loanAppState.loanApplication) {
          this.isLoading = false;
          this.loanAppId = loanAppState.loanApplication['id'];
          this.loanAppPayees = loanAppState.loanApplication['payees'];
          const profile = loanAppState['loanApplication']['profile'];
          const profileType = profile['type'] === 'PERSON' ? 'people'
            : profile.type === 'COMPANY' ? 'companies'
              : 'groups';
          this.breadcrumb = [
            {
              name: profile['name'],
              link: `/profiles/${profileType}/${profile['id']}/info`
            },
            {
              name: 'LOANS',
              link: '/loans'
            },
            {
              name: loanAppState['loanApplication']['loan']['code'],
              link: ''
            },
            {
              name: 'PAYEES',
              link: ''
            }
          ];
          this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
        }
      });

    this.isLoading = false;
  }

  goToPayee(payee) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        loanAppId: this.loanAppId,
      },
    };
    this.router.navigate(['/payees', payee['id'], 'info'], navigationExtras);
  }

  ngOnDestroy() {
    this.loanApplicationSub.unsubscribe();
  }
}

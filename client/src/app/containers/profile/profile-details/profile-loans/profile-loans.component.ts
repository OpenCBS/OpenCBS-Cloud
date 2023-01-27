import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { IProfile } from '../../../../core/store/profile/model/profile.model';
import { ICurrencyList } from '../../../../core/store/currencies/currency-list/currency-list.reducer';
import { CurrentUserService } from '../../../../core/store/users/current-user/currentUser.service';
import { environment } from '../../../../../environments/environment';
import { getProfileStatus } from '../../../../core/store/profile/profile.selectors';
import * as ProfileUtils from '../../shared/profile.utils';
import { LoanListService } from '../../../../core/store/loans/loan-list/loan-list.service';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';

@Component({
  selector: 'cbs-profile-loans',
  templateUrl: './profile-loans.component.html',
  styleUrls: ['./profile-loans.component.scss']
})
export class ProfileLoansComponent implements OnInit, OnDestroy {
  public profile: any;
  public navElements = [];
  public profileId: number;
  public url: string;
  public imageUrl = '';
  public opened = false;
  public isOpen = false;
  public currencies: any;
  public profileLoanList: any;
  public isLoading: boolean;

  public profileType: string;
  private permissionSub: any;
  private statusSub: any;
  private routeSub: any;
  private permissions: any[];
  private loanId: any;
  private loanType: any;

  constructor(private profileStore$: Store<IProfile>,
              private route: ActivatedRoute,
              private currencyListStore$: Store<ICurrencyList>,
              private loanService: LoanListService,
              private router: Router,
              private currentUserService: CurrentUserService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.profile = this.profileStore$.select(fromRoot.getProfileState);

    this.currencies = this.currencyListStore$.select(fromRoot.getCurrencyListState);

    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      this.permissions = userPermissions;
    });

    this.routeSub = this.route.parent.params.subscribe(params => {
      this.profileId = +params['id'];
      this.profileType = params['type'];

      if (this.profileType === 'people' || this.profileType === 'companies' || this.profileType === 'groups') {
        this.url = `${environment.API_ENDPOINT}profiles/${this.profileType}/${this.profileId}/attachments/`;
      }
    });

    this.statusSub = this.profileStore$.select(fromRoot.getProfileState).pipe(
      (getProfileStatus()))
    .subscribe((status: string) => {
      if (this.profileType === 'people' || this.profileType === 'companies' || this.profileType === 'groups') {
        this.navElements = ProfileUtils.setNavElements(
          this.profileType,
          this.profileId,
          this.permissions
        );
      }
    });
    this.currencyListStore$.dispatch(new fromStore.LoadCurrencies());

    this.loanService.getProfileLoanList(this.profileId).subscribe(loanApps => {
      this.profileLoanList = loanApps;
      this.isLoading = false;
    })
  }

  openAttachment(attachment) {
    if (attachment.contentType && this.testIfImage(attachment.contentType)) {
      this.imageUrl = this.url + attachment.id;
      this.opened = true;
    } else {
      window.open(this.url + attachment.id);
    }
  }

  testIfImage(name: string) {
    const re = new RegExp(/^image/);
    return re.test(name);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.statusSub.unsubscribe();
  }

  resetModal() {
    this.imageUrl = '';
  }

  getFileExtension(fileName: string) {
    return fileName.split('.').pop();
  }

  goToLoan(loan: any) {
    if (loan.data.code === '') {
      this.loanId = loan.data.loanApplicationId;
      this.loanType = 'GROUP';
    } else {
      this.loanId = loan.data.id;
      this.loanType = loan.data.profile.type === 'PERSON' ? 'PERSON' : loan.data.profile.type === 'COMPANY' ? 'COMPANY' : 'GROUPS';
    }
    this.router.navigate(['/loans', this.loanId, `${this.loanType}`.toLowerCase(), 'info']);
  }
}

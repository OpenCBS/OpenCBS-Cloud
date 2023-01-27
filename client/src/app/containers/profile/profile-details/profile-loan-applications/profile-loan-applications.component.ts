import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IProfile } from '../../../../core/store/profile/model/profile.model';
import { ICurrencyList } from '../../../../core/store/currencies/currency-list/currency-list.reducer';
import { CurrentUserService } from '../../../../core/store/users/current-user/currentUser.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { getProfileStatus } from '../../../../core/store/profile/profile.selectors';
import * as ProfileUtils from '../../shared/profile.utils';
import { LoanApplicationListService } from '../../../../core/store/loan-application/loan-application-list/loan-application-list.service';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cbs-profile-loan-applications',
  templateUrl: './profile-loan-applications.component.html',
  styleUrls: ['./profile-loan-applications.component.scss']
})
export class ProfileLoanApplicationsComponent implements OnInit, OnDestroy {
  public profile: any;
  public navElements = [];
  public profileId: number;
  public url: string;
  public imageUrl = '';
  public opened = false;
  public isOpen = false;
  public form: FormGroup;
  public currencies: any;
  public profileLoanAppList: any;
  public profileType: string;
  public isLoading: boolean;

  private permissions: any[];
  private permissionSub: Subscription;
  private statusSub: Subscription;
  private routeSub: Subscription;
  private profileSub: Subscription;

  constructor(private profileStore$: Store<IProfile>,
              private route: ActivatedRoute,
              private currencyListStore$: Store<ICurrencyList>,
              private loanAppService: LoanApplicationListService,
              private router: Router,
              private currentUserService: CurrentUserService) {
    this.form = new FormGroup({
      currency: new FormControl(1, Validators.required)
    });
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
      this.loanAppService.getProfileLoanApplicationList(this.profileId).subscribe(loanApps => {
        this.profileLoanAppList = loanApps;
        this.isLoading = false;
      })
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
    let re = new RegExp(/^image/);
    return re.test(name);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.statusSub.unsubscribe();
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
  }

  resetModal() {
    this.imageUrl = '';
  }

  getFileExtension(fileName: string) {
    return fileName.split('.').pop();
  }

  goToApplication(loanApp: any) {
    this.router.navigate(['/loan-applications', loanApp.data.id, 'info']);
  }

  gotoCreateApp(profSub) {
    this.profileSub = profSub.subscribe(profile => {
      this.profileType = profile.type === 'people' ? 'PERSON' : profile.type === 'companies' ? 'COMPANY' : 'GROUP';
      const navigationExtras: NavigationExtras = {
        queryParams: {
          profileId: profile.id,
          profileName: profile.name,
          profileType: this.profileType
        }
      };
      this.router.navigate(['/loan-applications', 'create', 'info'], navigationExtras);
    });
  }
}

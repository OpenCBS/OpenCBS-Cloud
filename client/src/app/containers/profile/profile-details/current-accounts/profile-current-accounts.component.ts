import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ProfileUtils from '../../shared/profile.utils';
import { environment } from '../../../../../environments/environment';
import * as fromStore from '../../../../core/store';
import { CurrentUserService, getProfileStatus, IProfile } from '../../../../core/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as fromRoot from '../../../../core/core.reducer';
import { ICurrencyList } from '../../../../core/store/currencies/currency-list';
import { ICurrentAccountList } from '../../../../core/store/profile/current-account-list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cbs-current-accounts',
  templateUrl: 'profile-current-accounts.component.html',
  styleUrls: ['profile-current-accounts.component.scss']
})
export class ProfileCurrentAccountsComponent implements OnInit, OnDestroy {
  public profile: any;
  public profileCurrentAccounts: any;
  public navElements = [];
  public profileId: number;
  public url: string;
  public imageUrl = '';
  public opened = false;
  public isOpen = false;
  public form: FormGroup;
  public currencies: any;

  public profileType: string;
  private permissionSub: Subscription;
  private profileSub: Subscription;
  private statusSub: Subscription;
  private routeSub: Subscription;
  private permissions: any[];

  constructor(private profileStore$: Store<IProfile>,
              private route: ActivatedRoute,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private currentAccountsStore$: Store<ICurrentAccountList>,
              private currencyListStore$: Store<ICurrencyList>,
              private currentUserService: CurrentUserService) {
    this.form = new FormGroup({
      currency: new FormControl(1, Validators.required)
    });
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params.subscribe(params => {
      this.profileId = +params['id'];
      this.profileType = params['type'];

      if ( this.profileType === 'people' || this.profileType === 'companies' ) {
        this.url = `${environment.API_ENDPOINT}profiles/${this.profileType}/${this.profileId}/attachments/`;
      }
    });

    this.profileSub = this.store$.select(fromRoot.getProfileState).subscribe((state: IProfile) => {
      if ( state.loaded && state.success && !state.error ) {
        this.profile = state;
        this.currentAccountsStore$.dispatch(new fromStore.LoadCurrentAccounts({profileId: this.profileId, type: this.profileType}));
      }
    });

    this.currencies = this.store$.select(fromRoot.getCurrencyListState);

    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      this.permissions = userPermissions;
    });

    this.profileCurrentAccounts = this.currentAccountsStore$.select(fromRoot.getProfileCurrentAccountList);

    this.statusSub = this.store$.select(fromRoot.getProfileState).pipe(
      (getProfileStatus()))
      .subscribe((status: string) => {
        if ( this.profileType === 'people' || this.profileType === 'companies' ) {
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
    if ( attachment.contentType && this.testIfImage(attachment.contentType) ) {
      this.imageUrl = this.url + attachment.id;
      this.opened = true;
    } else {
      window.open(this.url + attachment.id);
    }
  }

  createAccount() {
    this.isOpen = false;
    this.profileStore$.dispatch(new fromStore.CreateCurrentAccount({
      profileId: this.profileId,
      type: this.profileType,
      data: this.form.value['currency']
    }))
  }

  testIfImage(name: string) {
    const re = new RegExp(/^image/);
    return re.test(name);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.statusSub.unsubscribe();
    this.profileSub.unsubscribe();
    this.permissionSub.unsubscribe();
  }

  resetModal() {
    this.imageUrl = '';
  }

  getFileExtension(fileName: string) {
    return fileName.split('.').pop();
  }

  goToTransactions(accountId) {
    this.router.navigate(['/profiles', this.profileType, this.profileId, 'current-accounts', accountId, 'transactions']);
  }
}

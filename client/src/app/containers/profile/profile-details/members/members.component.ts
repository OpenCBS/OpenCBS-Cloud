import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { IProfile } from '../../../../core/store/profile/model/profile.model';
import { ICurrencyList } from '../../../../core/store/currencies/currency-list/currency-list.reducer';
import { CurrentUserService } from '../../../../core/store/users/current-user/currentUser.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { getProfileStatus } from '../../../../core/store/profile/profile.selectors';
import * as ProfileUtils from '../../shared/profile.utils';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { MembersService } from '../../shared/members.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FormLookupControlComponent } from '../../../../shared/modules/cbs-form/components';

@Component({
  selector: 'cbs-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit, OnDestroy {
  @ViewChild('lookup', {static: false}) lookup: FormLookupControlComponent;
  public profile: any;
  public navElements = [];
  public profileId: number;
  public memberId: number;
  public url: string;
  public opened = false;
  public imageUrl = '';
  public isLoading: boolean;
  public isOpen = false;
  public form: FormGroup;
  public currencies: any;
  public members: any;
  public profileType: string;
  public memberForm: FormGroup;
  public isModalOpened = false;
  public memberConfig: any;
  public memberType: string;

  private permissionSub: any;
  private statusSub: any;
  private routeSub: any;
  private permissions: any[];
  private profileSub: any;

  constructor(private profileStore$: Store<IProfile>,
              private route: ActivatedRoute,
              private currencyListStore$: Store<ICurrencyList>,
              private router: Router,
              private currentUserService: CurrentUserService,
              private membersService: MembersService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private fb: FormBuilder) {
    this.form = new FormGroup({
      currency: new FormControl(1, Validators.required)
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.memberForm = this.fb.group({
      personId: new FormControl('', Validators.required)
    });
    this.profile = this.profileStore$.pipe(select(fromRoot.getProfileState));

    this.currencies = this.currencyListStore$.pipe(select(fromRoot.getCurrencyListState));

    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      this.permissions = userPermissions;
    });

    this.routeSub = this.route.parent.params.subscribe(params => {
      this.profileId = +params['id'];
      this.profileType = params['type'];

      if ( this.profileType === 'people' || this.profileType === 'companies' || this.profileType === 'groups' ) {
        this.url = `${environment.API_ENDPOINT}profiles/${this.profileType}/${this.profileId}/attachments/`;
      }

      this.membersService.getMembersList(this.profileId, this.profileType).subscribe(loanApps => {
        this.members = loanApps['groupsMembers'] ? loanApps['groupsMembers'] : loanApps['companyMembers'];
        this.isLoading = false;
      })
    });

    this.memberConfig = {
      url: `${environment.API_ENDPOINT}profiles/${this.profileType}/${this.profileId}/members/lookup`
    };

    this.statusSub = this.profileStore$.select(fromRoot.getProfileState).pipe(
      (getProfileStatus()))
      .subscribe((status: string) => {
        if ( this.profileType === 'people' || this.profileType === 'companies' || this.profileType === 'groups' ) {
          this.navElements = ProfileUtils.setNavElements(
            this.profileType,
            this.profileId,
            this.permissions
          );
        }
      });
    this.currencyListStore$.dispatch(new fromStore.LoadCurrencies());
  }

  testIfImage(name: string) {
    const re = new RegExp(/^image/);
    return re.test(name);
  }

  getFileExtension(fileName: string) {
    return fileName.split('.').pop();
  }

  openAttachment(attachment) {
    if ( attachment.contentType && this.testIfImage(attachment.contentType) ) {
      this.imageUrl = this.url + attachment.id;
      this.opened = true;
    } else {
      window.open(this.url + attachment.id);
    }
  }

  goToMember(loanApp: any) {
    this.profileStore$.dispatch(new fromStore.ResetProfileInfo());
    this.memberType = loanApp.type === 'PERSON' ? 'people' : 'companies';
    this.profileStore$.dispatch(new fromStore.LoadProfileInfo({id: loanApp.memberId, type: this.memberType}));
    this.router.navigate(['/profiles', this.memberType, loanApp.memberId, 'info'])
  }

  openTransactionModal() {
    this.lookup.onClearLookup();
    this.isModalOpened = true;
  }

  cancel() {
    this.isModalOpened = false;
  }

  removeModal(memberId) {
    this.memberId = memberId;
    this.opened = true;
  }

  closeModal() {
    this.opened = false;
  }

  removeMember(memberId) {
    this.membersService.removeMember(this.profileId, this.profileType, memberId).subscribe(res => {
      if ( res.error ) {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, '', environment.ERROR_TOAST_CONFIG);
        this.isLoading = false;
      } else {
        this.toastrService.clear();
        this.translate.get('SUCCESS_REMOVED').subscribe((message: string) => {
          this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.isLoading = false;
        this.members = res['groupsMembers'] ? res['groupsMembers'] : res['companyMembers'];
      }
    });
  }

  submit() {
    this.membersService.addMember(this.profileId, this.profileType, this.memberForm.value.personId).subscribe(res => {
      if ( res.error ) {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, '', environment.ERROR_TOAST_CONFIG);
        this.isLoading = false;
      } else {
        this.toastrService.clear();
        this.translate.get('SUCCESS_ADDED').subscribe((message: string) => {
          this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.isLoading = false;
        this.members = res['groupsMembers'] ? res['groupsMembers'] : res['companyMembers'];
      }
    });
    this.isModalOpened = false;
    this.memberForm.reset();
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.statusSub.unsubscribe();
    if ( this.profileSub ) {
      this.profileSub.unsubscribe();
    }
  }
}

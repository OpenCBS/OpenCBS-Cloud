import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { IProfile } from '../../../../../core/store/profile/model/profile.model';
import { CurrentUserService } from '../../../../../core/store/users/current-user/currentUser.service';
import { environment } from '../../../../../../environments/environment';
import { getProfileStatus } from '../../../../../core/store/profile/profile.selectors';
import * as ProfileUtils from '../../../shared/profile.utils';
import * as fromRoot from '../../../../../core/core.reducer';
import { Subscription } from 'rxjs';
import { CreditLineService, ICreditLine } from '../../../../../core/store';
import * as fromStore from '../../../../../core/store';

@Component({
  selector: 'cbs-profile-credit-lines',
  templateUrl: './profile-credit-lines.component.html',
  styleUrls: ['./profile-credit-lines.component.scss']
})
export class ProfileCreditLinesComponent implements OnInit, OnDestroy {
  public profile: any;
  public navElements = [];
  public profileId: number;
  public url: string;
  public imageUrl = '';
  public opened = false;
  public profileCreditLineList: any;
  public profileType: string;
  public isLoading: boolean;

  private permissions: any[];
  private permissionSub: Subscription;
  private statusSub: Subscription;
  private routeSub: Subscription;
  private profileSub: Subscription;

  constructor(private profileStore$: Store<IProfile>,
              private creditLineStore$: Store<ICreditLine>,
              private route: ActivatedRoute,
              private creditLineService: CreditLineService,
              private router: Router,
              private currentUserService: CurrentUserService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.profile = this.profileStore$.select(fromRoot.getProfileState);

    this.permissionSub = this.currentUserService.currentUserPermissions$.subscribe(userPermissions => {
      this.permissions = userPermissions;
    });

    this.routeSub = this.route.parent.params.subscribe(params => {
      this.profileId = +params['id'];
      this.profileType = params['type'];

      if ( this.profileType === 'people' || this.profileType === 'companies' || this.profileType === 'groups' ) {
        this.url = `${environment.API_ENDPOINT}profiles/${this.profileType}/${this.profileId}/attachments/`;
      }
      this.creditLineService.getProfileCreditLineList(this.profileId).subscribe(creditLines => {
        this.profileCreditLineList = creditLines;
        this.isLoading = false;
      })
    });

    this.statusSub = this.profileStore$.select(fromRoot.getProfileState).pipe(
      (getProfileStatus()))
      .subscribe(() => {
        if ( this.profileType === 'people' || this.profileType === 'companies' || this.profileType === 'groups' ) {
          this.navElements = ProfileUtils.setNavElements(
            this.profileType,
            this.profileId,
            this.permissions
          );
        }
      });
  }

  openAttachment(attachment) {
    if ( attachment.contentType && this.testIfImage(attachment.contentType) ) {
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
    this.permissionSub.unsubscribe();
    this.statusSub.unsubscribe();
    if ( this.profileSub ) {
      this.profileSub.unsubscribe();
    }
  }

  resetModal() {
    this.imageUrl = '';
  }

  getFileExtension(fileName: string) {
    return fileName.split('.').pop();
  }

  goToCreditLine(creditLine: any) {
    this.router.navigate(['/profiles', this.profileType, this.profileId, 'credit-line', creditLine.data['id']]);
    this.creditLineStore$.dispatch(new fromStore.LoadCreditLine(creditLine.data['id']));
  }

  goToCreateCreditLine(creditLine) {
    this.profileSub = creditLine.subscribe(profile => {
      this.router.navigate(['/profiles', this.profileType, profile['id'], 'credit-line-create']);
    });
  }
}

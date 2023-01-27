import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CurrentUserService, getProfileStatus, ICreditLine, IProfile } from '../../../../../core/store';
import { environment } from '../../../../../../environments/environment';
import * as ProfileUtils from '../../../shared/profile.utils';

@Component({
  selector: 'cbs-credit-line-info',
  templateUrl: 'credit-line-info.component.html',
  styleUrls: ['credit-line-info.component.scss']
})
export class CreditLineInfoComponent implements OnInit, OnDestroy {
  public profile: any;
  public navElements = [];
  public profileId: number;
  public url: string;
  public imageUrl = '';
  public opened = false;
  public profileType: any;
  public creditLineState: any;

  private creditLineId: number;
  private permissions: any[];
  private permissionSub: Subscription;
  private statusSub: Subscription;
  private routeSub: Subscription;
  private creditLineSub: Subscription;

  constructor(private store$: Store<fromRoot.State>,
              private profileStore$: Store<IProfile>,
              private router: Router,
              private route: ActivatedRoute,
              private currentUserService: CurrentUserService) {
  }

  ngOnInit() {
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
    });

    this.statusSub = this.profileStore$.select(fromRoot.getProfileState)
      .pipe(
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

    this.creditLineSub = this.store$.pipe(select(fromRoot.getCreditLineState))
      .subscribe(
        (creditLineState: ICreditLine) => {
          if ( creditLineState.loaded && creditLineState.success ) {
            this.creditLineState = creditLineState;
            this.creditLineId = creditLineState.creditLine['id'];
          }
        });
  }

  goToUpdateCreditLine() {
    this.router.navigate(['/profiles', this.profileType, this.profileId, 'credit-line', this.creditLineId, 'edit']);
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
    this.permissionSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.statusSub.unsubscribe();
    this.creditLineSub.unsubscribe();
  }

  resetModal() {
    this.imageUrl = '';
  }

  getFileExtension(fileName: string) {
    return fileName.split('.').pop();
  }
}

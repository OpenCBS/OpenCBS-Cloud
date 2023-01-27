import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { environment } from '../../../../../environments/environment';
import { DeleteProfileAttachState, getProfileStatus, IProfile, ProfileAttachmentListState } from '../../../../core/store/index';
import { CurrentUserService } from '../../../../core/store/users/current-user';

import * as ProfileUtils from '../../shared/profile.utils';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'cbs-profile-attachment',
  templateUrl: 'profile-attachment.component.html',
  styleUrls: ['profile-attachment.component.scss']
})
export class ProfileAttachmentComponent implements OnInit, OnDestroy {
  public profileId: number;
  public profileType: string;
  public opened = false;
  public url = '';
  public attachmentDeleteState: DeleteProfileAttachState;
  public navElements = [];
  public imageUrl = '';
  public profile: Observable<IProfile>;
  public isOpen = false;
  public isVisible = false;
  public selectedAttachment: any;

  private deletedPinnedFileId: number;
  private permissions: any[];
  private permissionSub: Subscription;
  private routeSub: Subscription;
  private statusSub: Subscription;
  private delAttachmentSub: Subscription;
  private attachmentListSub: Subscription;

  constructor(private attachmentStore$: Store<ProfileAttachmentListState>,
              private attachmentDeleteStore$: Store<DeleteProfileAttachState>,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private profileStore$: Store<IProfile>,
              private currentUserService: CurrentUserService) {
    this.profile = this.store$.pipe(select(fromRoot.getProfileState));
  }

  ngOnInit() {
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

    this.statusSub = this.store$.pipe(select(fromRoot.getProfileState), (getProfileStatus()))
      .subscribe((status: string) => {
        if ( this.profileType === 'people' || this.profileType === 'companies' || this.profileType === 'groups' ) {
          this.navElements = ProfileUtils.setNavElements(
            this.profileType,
            this.profileId,
            this.permissions
          );
        }
      });

    this.attachmentListSub = this.store$.pipe(select(fromRoot.getProfileAttachmentsState))
      .subscribe((state: ProfileAttachmentListState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.getProfile();
        }
      });

    this.delAttachmentSub = this.store$.pipe(select(fromRoot.getProfileAttachmentDeleteState))
      .subscribe(
        (state: DeleteProfileAttachState) => {
          if ( state.loaded && state.success && !state.error ) {
            this.translate.get('DELETE_SUCCESS').subscribe((res: string) => {
              this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
              this.getProfile();
            });
            if ( this.deletedPinnedFileId ) {
              this.getProfile();
            }
            this.resetDelState();
            this.deletedPinnedFileId = null;
          } else if ( state.loaded && !state.success && state.error ) {
            this.translate.get('DELETE_ERROR').subscribe((res: string) => {
              this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
            });
            this.resetDelState();
          }

          this.attachmentDeleteState = state;
        });
  }

  ngOnDestroy() {
    this.permissionSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.statusSub.unsubscribe();
    this.delAttachmentSub.unsubscribe();
    this.attachmentListSub.unsubscribe();
    this.attachmentStore$.dispatch(new fromStore.ResetProfileAttachments());
  }


  getUrl(fileId) {
    return `${environment.API_ENDPOINT}profiles/${this.profileType}/${this.profileId}/attachments/${fileId}`;
  }

  download(fileId) {
    window.open(this.getUrl(fileId));
  }

  confirmDelete(file) {
    this.selectedAttachment = file;
    this.isVisible = true;
  }

  delete(e) {
    if ( this.selectedAttachment.pinned ) {
      this.deletedPinnedFileId = this.selectedAttachment.id;
    }
    this.attachmentDeleteStore$.dispatch(
      new fromStore.DeleteProfileAttachment({
        attachId: this.selectedAttachment.id,
        profileType: this.profileType,
        profileId: this.profileId
      })
    );
    this.closeConfirmPopup();
  }

  closeConfirmPopup() {
    this.isVisible = false;
  }

  getProfile() {
    this.profileStore$.dispatch(new fromStore.LoadProfileInfo({
      id: this.profileId,
      type: this.profileType
    }));
  }

  onUpload(event) {
    if ( event.xhr && event.xhr.status === 200 ) {
      this.closeUploadModal();
      this.getProfile();
      this.translate.get('UPLOAD_SUCCESS').subscribe((res: string) => {
        this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
      });
    }
  }

  onError(err) {
    if ( err.xhr && (err.xhr.status >= 400 && err.xhr.status <= 500) ) {
      const response = JSON.parse(err.xhr.response);
      this.closeUploadModal();
      this.toastrService.error(response.message, '', environment.ERROR_TOAST_CONFIG);
    }
  }

  onClear() {
    this.closeUploadModal();
  }

  openUploadModal() {
    this.isOpen = true;
  }

  closeUploadModal() {
    this.isOpen = false;
  }

  resetDelState() {
    this.attachmentDeleteStore$.dispatch(
      new fromStore.DeleteProfileAttachmentReset()
    );
  }

  getFileExtension(fileName) {
    return fileName.toLowerCase().split('.').pop();
  }

  testIfImage(name: string) {
    const re = new RegExp(/^image/);
    return re.test(name);
  }

  openAttachment(attachment) {
    if ( attachment.contentType && this.testIfImage(attachment.contentType) ) {
      this.imageUrl = this.url + attachment.id;
      this.opened = true;
    } else {
      window.open(this.url + attachment.id);
    }

  }

  pin(attachment) {
    if ( attachment.pinned ) {
      this.attachmentStore$.dispatch(new fromStore.UnpinProfileAttachment({
        profileType: this.profileType,
        profileId: this.profileId,
        attachId: attachment.id
      }));
    } else {
      this.attachmentStore$.dispatch(new fromStore.PinProfileAttachment({
        profileType: this.profileType,
        profileId: this.profileId,
        attachId: attachment.id
      }));
    }
  }

  resetModal() {
    this.imageUrl = '';
  }
}

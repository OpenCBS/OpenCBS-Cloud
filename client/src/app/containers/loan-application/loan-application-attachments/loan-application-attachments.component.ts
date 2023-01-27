import { Component, OnInit, OnDestroy } from '@angular/core';
import {select, Store} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';

import {
  ILoanAppState,
  ILoanAppAttachDelete,
} from '../../../core/store/loan-application';
import { LoanAppSubmitService } from '../shared/services/loan-app-submit.service';
import { LoanAppStatus } from '../../../core/loan-application-status.enum';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-application-attachments',
  templateUrl: 'loan-application-attachments.component.html',
  styles: [`
    .slds-container--medium {
      width: 100%;
      max-width: 100%
    }

    table {
      table-layout: fixed
    }

    .slds-item {
      width: calc(100% - 44px);
    }

    .slds-progress {
      margin-top: 18px
    }`]
})
export class LoanApplicationAttachmentsComponent implements OnInit, OnDestroy {
  public breadcrumbLinks = [];
  public svgData = SVG_DATA;
  public LoanAppStatus = LoanAppStatus;
  public loanAppStatus: string;
  public loanApplicationState: ILoanAppState;
  public loanApplication: any;
  public isOpened: boolean;
  public url = '';
  public loanAppId: number;
  public text: string;
  public opened = false;
  public submitService = this.loanAppSubmitService;
  public selectedAttachment: any;
  public isVisible = false;
  public isLoading = true;
  public progressValue: any;
  public readOnly = false;

  private loanApplicationSub: Subscription;
  private delAttachmentSub: Subscription;

  constructor(private loanApplicationStore$: Store<ILoanAppState>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private store$: Store<fromRoot.State>,
              private attachmentDeleteStore$: Store<ILoanAppAttachDelete>,
              private loanAppSubmitService: LoanAppSubmitService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState)).subscribe(
      (loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          this.isLoading = false;
          this.loanApplicationState = loanAppState;
          this.loanApplication = loanAppState.loanApplication;
          this.readOnly = this.loanApplication.readOnly;
          this.loanAppStatus = loanAppState.loanApplication['status'];
          switch (this.loanAppStatus) {
            case 'IN_PROGRESS':
              this.progressValue = 25 + '%';
              break;
            case 'PENDING':
              this.progressValue = 50 + '%';
              break;
            case 'APPROVED':
              this.progressValue = 75 + '%';
              break;
            default:
              this.progressValue = 100 + '%';
          }
          this.loanAppId = loanAppState.loanApplication['id'];
          const loanProfile = loanAppState.loanApplication['profile'];
          const profileType = loanProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
            {
              name: loanProfile['name'],
              link: `/profiles/${profileType}/${loanProfile['id']}/info`
            },
            {
              name: 'LOAN_APPLICATIONS',
              link: '/loan-applications'
            },
            {
              name: loanAppState.loanApplication['code'],
              link: ''
            },
            {
              name: 'ATTACHMENTS',
              link: ''
            }
          ];

          this.url = `${environment.API_ENDPOINT}loan-applications/${this.loanAppId}/attachments`;
        }
      });

    this.delAttachmentSub = this.store$.pipe(select(fromRoot.getLoanAppAttachmentDeleteState)).subscribe(
      (state: ILoanAppAttachDelete) => {

        if ( state.loaded && state.success && !state.error ) {
          this.translate.get('DELETE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });

          this.getAttachmentList(this.loanAppId);
          this.resetDelState();
        } else if ( state.loaded && !state.success && state.error ) {
          this.translate.get('DELETE_ERROR').subscribe((res: string) => {
            this.toastrService.error('', res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetDelState();
        }
      });
  }

  ngOnDestroy() {
    this.loanApplicationSub.unsubscribe();
    this.delAttachmentSub.unsubscribe();
  }

  closeUploadModal() {
    this.isOpened = false;
  }

  onUpload(event) {
    if ( event.xhr && event.xhr.status === 200 ) {
      this.getAttachmentList(this.loanAppId);
      this.closeUploadModal();
    }
  }

  download(fileId) {
    window.open(this.getUrl(fileId));
  }


  openUploadModal() {
    this.isOpened = true;
  }


  confirmDelete(file) {
    this.selectedAttachment = file;
    this.isVisible = true;
  }

  delete() {
    this.attachmentDeleteStore$.dispatch(
      new fromStore.DeleteLoanApplicationAttachment({attachmentId: this.selectedAttachment.id, loanAppId: this.loanAppId}));
    this.closeConfirmPopup();
  }

  closeConfirmPopup() {
    this.isVisible = false;
  }


  getUrl(fileId) {
    return `${environment.API_ENDPOINT}loan-applications/${this.loanAppId}/attachments/${fileId}`;
  }

  onError(err) {
    if ( err.xhr && err.xhr.status === 400 ) {
      const response = JSON.parse(err.xhr.response);
      this.closeUploadModal();

      this.translate.get('DELETE_ERROR').subscribe((res: string) => {
        this.toastrService.error(response.message, res, environment.ERROR_TOAST_CONFIG);
      });
    }
  }

  onClear() {
    this.closeUploadModal();
  }

  resetDelState() {
    this.attachmentDeleteStore$.dispatch(
      new fromStore.DeleteLoanApplicationAttachmentReset());
  }

  getAttachmentList(id: number) {
    this.loanApplicationStore$.dispatch(new fromStore.LoadLoanApplication(id));
  }

  openModal(text) {
    this.opened = true;
    this.text = text;
  }

  closeModal() {
    this.opened = false;
  }

  getFileExtension(fileName) {
    return fileName.toLowerCase().split('.').pop();
  }
}

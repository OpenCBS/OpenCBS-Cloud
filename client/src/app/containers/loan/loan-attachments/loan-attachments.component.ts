import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../../core/store';
import { ILoanInfo } from '../../../core/store';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import { ILoanAttachDelete } from '../../../core/store/loans/loan-attachment-delete';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Rx';
import { ILoanAppState } from '../../../core/store';
import { ILoanAppAttachDelete } from '../../../core/store';

const SVG_DATA = {collection: 'standard', class: 'task', name: 'task'};

@Component({
  selector: 'cbs-loan-attachments',
  templateUrl: 'loan-attachments.component.html',
  styles: ['.slds-container--medium { width: 100%; max-width: 100%}']
})

export class LoanAttachmentsComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public svgData = SVG_DATA;
  public loanApplicationState: ILoanAppState;
  public loanApplication: any;
  public isOpened: boolean;
  public loan: any;
  public url = '';
  public loanStatus: string;
  public loanAppId: number;
  public loanId: number;
  public selectedAttachment: any;
  public isVisible = false;
  public isLoading = true;

  private loanSub: Subscription;
  private delAttachmentSub: Subscription;
  private loanApplicationSub: Subscription;

  constructor(private loanStore$: Store<ILoanInfo>,
              private loanAttachmentDeleteStore$: Store<ILoanAttachDelete>,
              private toastrService: ToastrService,
              private loanApplicationStore$: Store<ILoanAppState>,
              private attachmentDeleteStore$: Store<ILoanAppAttachDelete>,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.loanSub = this.store$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loan => {
        if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
          this.loan = loan['loan'];
          const loanAppId = this.loan['loanApplicationId'];
          const loanProfile = this.loan['profile'];
          this.loanStatus = this.loan['status'];
          const profileType = loanProfile['type'] === 'PERSON' ? 'people'
            : loanProfile['type'] === 'COMPANY' ? 'companies'
              : 'groups';
          const breadcrumbPart = profileType === 'groups' ? 'LOAN APPLICATION ' + loanAppId : loan['loan']['code'];
          this.breadcrumb = [
            {
              name: loanProfile['name'],
              link: `/profiles/${profileType}/${loanProfile['id']}/info`
            },
            {
              name: 'LOANS',
              link: '/loans'
            },
            {
              name: breadcrumbPart,
              link: ''
            },
            {
              name: 'INFORMATION',
              link: ''
            }
          ];
        }
      });

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState)).subscribe(
      (loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          this.isLoading = false;
          this.loanApplicationState = loanAppState;
          this.loanApplication = this.loanApplicationState.loanApplication;
          this.loanAppId = this.loanApplication['id'];
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

  onUpload(event) {
    if ( event.xhr && event.xhr.status === 200 ) {
      this.getAttachmentList(this.loanAppId);
      this.closeUploadModal();
    }
  }

  openUploadModal() {
    this.isOpened = true;
  }

  getAttachmentList(id: number) {
    this.loanApplicationStore$.dispatch(new fromStore.LoadLoanApplication(id));
  }

  getFileExtension(fileName) {
    return fileName.toLowerCase().split('.').pop();
  }

  download(fileId) {
    window.open(this.getUrl(fileId));
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

  closeUploadModal() {
    this.isOpened = false;
  }

  closeConfirmPopup() {
    this.isVisible = false;
  }

  getUrl(fileId) {
    return `${environment.API_ENDPOINT}loan-applications/${this.loanAppId}/attachments/${fileId}`;
  }

  onClear() {
    this.closeUploadModal();
  }

  onError(err) {
    if ( err.xhr && (err.xhr.status >= 400 && err.xhr.status <= 500) ) {
      const response = JSON.parse(err.xhr.response);
      this.closeUploadModal();
      this.translate.get('DELETE_ERROR').subscribe((res: string) => {
        this.toastrService.error(response.message, res, environment.ERROR_TOAST_CONFIG);
      });
    }
  }

  resetDelState() {
    this.attachmentDeleteStore$.dispatch(new fromStore.DeleteLoanApplicationAttachmentReset());
  }

  ngOnDestroy() {
    this.loanSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
    this.delAttachmentSub.unsubscribe();
  }
}

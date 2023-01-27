import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  ILoanAppState,
  ILoanAppFormState,
  ILoanApplicationComments
} from '../../../core/store/loan-application';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { LoanAppStatus } from '../../../core/loan-application-status.enum';
import { LoanAppSubmitService } from '../shared/services';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'standard', class: 'answer-public', name: 'answer_public'};

@Component({
  selector: 'cbs-loan-application-comments',
  templateUrl: 'loan-application-comments.component.html',
  styleUrls: ['loan-application-comments.component.scss']
})

export class LoanApplicationCommentsComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public loanApplicationCommentsData: any;
  public loanAppId: number;
  public breadcrumbLinks = [];
  public loanApplication: any;
  public LoanAppStatus = LoanAppStatus;
  public loanAppStatus: string;
  public opened = false;
  public text: string;
  public commentText: string;
  public disabledSendButton = true;
  public progressValue: any;
  public submitService = this.loanAppSubmitService;

  private loanApplicationSub: Subscription;
  private loanApplicationCommentSub: Subscription;

  constructor(private loanApplicationStore$: Store<ILoanAppState>,
              private loanApplicationCommentsStore$: Store<ILoanApplicationComments>,
              private loanAppFormStore$: Store<ILoanAppFormState>,
              private store$: Store<fromRoot.State>,
              private loanAppSubmitService: LoanAppSubmitService) {
  }

  ngOnInit() {
    this.loanApplicationCommentSub = this.store$.pipe(select(fromRoot.getLoanApplicationCommentsState))
      .subscribe((loanApplicationComment: ILoanApplicationComments) => {
        if ( loanApplicationComment.loaded && loanApplicationComment.success && loanApplicationComment.loanApplicationComments ) {
          this.loanApplicationCommentsData = loanApplicationComment;
        }
      });

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
          if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
            this.loanApplication = loanAppState.loanApplication;
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
                name: 'COMMENTS',
                link: ''
              }
            ];

            this.loanApplicationCommentsStore$.dispatch(new fromStore.LoadLoanApplicationComments({id: this.loanAppId}));
          }
        }
      );
  }

  valueText(value) {
    this.commentText = value;
    this.disabledSendButton = !(value && value.match(/^\s+$/) === null);
  }

  sendComment() {
    if ( (this.commentText && this.commentText.match(/^\s+$/) === null) ) {
      this.loanApplicationCommentsStore$.dispatch(new fromStore.SetLoanApplicationComments({
        id: this.loanAppId,
        payload: this.commentText
      }));
      setTimeout(() => {
        this.loanApplicationCommentsStore$.dispatch(new fromStore.LoadLoanApplicationComments({id: this.loanAppId}));
        this.commentText = '';
        this.disabledSendButton = true;
      }, 300);
    }
  }

  openModal(text) {
    this.opened = true;
    this.text = text;
  }

  closeModal() {
    this.opened = false;
  }

  onScroll(params) {
    this.loanApplicationCommentsStore$.dispatch(new fromStore.LoadLoanApplicationComments({
      id: this.loanAppId,
      query: params
    }));
  }

  ngOnDestroy() {
    this.loanApplicationCommentSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
  }
}

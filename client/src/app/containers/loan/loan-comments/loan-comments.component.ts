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
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ILoanInfo } from '../../../core/store';

const SVG_DATA = {
  collection: 'standard',
  class: 'answer-public',
  name: 'answer_public'
};

@Component({
  selector: 'cbs-loan-comments',
  templateUrl: 'loan-comments.component.html',
  styleUrls: ['loan-comments.component.scss']
})

export class LoanCommentsComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public loanApplicationCommentsData: any;
  public loanAppId: number;
  public breadcrumbLinks = [];
  public text: string;
  public commentText: string;
  public disabledSendButton = true;
  public loan: any;
  public loanStatus: any;

  private loanApplicationCommentSub: Subscription;
  private loanSub: Subscription;
  private loanApplicationSub: Subscription;

  constructor(private loanApplicationStore$: Store<ILoanAppState>,
              private loanApplicationCommentsStore$: Store<ILoanApplicationComments>,
              private loanAppFormStore$: Store<ILoanAppFormState>,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.loanApplicationCommentSub = this.store$.pipe(select(fromRoot.getLoanApplicationCommentsState))
      .subscribe((loanApplicationComment: ILoanApplicationComments) => {
        if ( loanApplicationComment.loaded && loanApplicationComment.success && loanApplicationComment.loanApplicationComments ) {
          this.loanApplicationCommentsData = loanApplicationComment;
        }
      });

    this.loanSub = this.store$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe((loanState: ILoanInfo) => {
        if ( loanState.success && loanState.loaded && loanState.loan ) {
          this.loan = loanState.loan;
          this.loanStatus = this.loan.status;
          const loanProfile = this.loan.profile;
          const profileType = loanProfile['type'] === 'PERSON' ? 'people'
            : loanProfile['type'] === 'COMPANY' ? 'companies'
              : 'groups';
          const breadcrumbPart = profileType === 'groups' ? 'LOAN APPLICATION ' + this.loan['loanApplicationId'] : this.loan['code'];

          this.breadcrumbLinks = [
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
              name: 'COMMENTS',
              link: ''
            }
          ];
        }
      });

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
          if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
            this.loanAppId = loanAppState.loanApplication['id'];

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

  onScroll(params) {
    this.loanApplicationCommentsStore$.dispatch(new fromStore.LoadLoanApplicationComments({
      id: this.loanAppId,
      query: params
    }));
  }

  ngOnDestroy() {
    this.loanApplicationCommentSub.unsubscribe();
    this.loanSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
  }
}

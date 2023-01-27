import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrintOutService } from '../../../../core/services/print-out.service';
import * as FileSaver from 'file-saver';
import { environment } from '../../../../../environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { ILoanInfo } from '../../../../core/store/loans/loan/loan.reducer';
import * as fromRoot from '../../../../core/core.reducer';
import * as fromStore from '../../../../core/store';
import { select, Store } from '@ngrx/store';
import { ShareService } from '../../../reports/shared/share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cbs-loan-print-out',
  templateUrl: 'loan-print-out.component.html',
  styleUrls: ['loan-print-out.component.scss']
})

export class LoanPrintOutComponent implements OnInit, OnDestroy {
  public forms = [];
  public breadcrumb = [];
  public isLoading: boolean;
  public customFields = [];
  private loanId: number;
  private loanType: string;
  private loanSub: any;
  private breadcrumbPart: any;
  constructor(private printOutService: PrintOutService,
              public shareService: ShareService,
              private router: Router,
              private toastrService: ToastrService,
              private loanStore$: Store<ILoanInfo>) {
  }

  ngOnInit() {
    this.isLoading = true;

    this.printOutService.getForms('LOAN').subscribe((forms) => {
      this.isLoading = false;
      if ( !forms.err ) {
        this.forms = forms;
      }
    });

    this.loanSub = this.loanStore$.pipe(select(fromRoot.getLoanInfoState)).subscribe((loanState: ILoanInfo) => {
      if ( loanState['loaded'] && !loanState['error'] && loanState['success'] ) {
        this.loanId = loanState['loan']['id'];
        const loanProfile = loanState['loan']['profile'];
        this.loanType = loanProfile['type'].toLowerCase();
        const profileType = loanProfile['type'] === 'PERSON' ? 'people'
          : loanProfile['type'] === 'COMPANY' ? 'companies'
            : 'groups';
        this.breadcrumbPart = profileType === 'groups' ? 'LOAN ' + this.loanId : loanState['loan']['code'];
        this.breadcrumb = [
          {
            name: loanProfile['name'],
            link: `/profiles/${profileType['type']}/${loanProfile['id']}/info`
          },
          {
            name: 'LOANS',
            link: '/loans'
          },
          {
            name: this.breadcrumbPart,
            link: ''
          },
          {
            name: 'PRINT_OUT',
            link: ''
          }
        ];
      }
    });

    setTimeout(() => {
      this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  downLoad(link) {
    const objToSend = {
      templateId: link['id'],
      entityId: this.loanId,
      reportName: link['name'],
      fieldsValues: {}
    };

    if ( link.loaderType === 'JASPER_LOADER') {
      const newObjToSend = {
        ...objToSend,
        reportLabel: link['label'],
        fieldsValues : {
          ...objToSend.fieldsValues,
          loanId: this.loanId,
          format: 'HTML'
        }
      };
      this.shareService.setData(newObjToSend);
      this.router.navigateByUrl(`loans/${this.loanId}/${this.loanType}/print-out-preview`);
    } else {
      const formType = link.loaderType === 'EXCEL_LOADER' ? 'excel' : 'word'
      this.printOutService.downloadMicrosoftDocForm(objToSend, formType).subscribe(res => {
        if ( res.errorCode ) {
          this.toastrService.error(res.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        } else {
          const formatType = link.loaderType === 'EXCEL_LOADER' ? 'xlsx' : 'docx'
          FileSaver.saveAs(res, `${link['label']}.${formatType}`);
        }
      })
    }
  }

  ngOnDestroy() {
    this.loanSub.unsubscribe();
  }
}

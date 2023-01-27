import { Component, OnInit } from '@angular/core';
import * as fromRoot from '../../../../core/core.reducer';
import { IBorrowingState } from '../../../../core/store/borrowings/borrowing';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as fromStore from '../../../../core/store';
import { environment } from '../../../../../environments/environment';
import * as moment from 'moment';
import { ActualizeBorrowingService } from '../../shared/services/actualize-borrowing.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'cbs-borrowing-operations',
  templateUrl: 'operations.component.html',
  styleUrls: ['operations.component.scss']
})

export class BorrowingOperationsComponent implements OnInit {
  public arr = [];
  private borrowingSub: any;
  public isOpenActualize = false;
  public borrowingDate: any;
  public borrowing: any;
  public isLoading: boolean;
  public breadcrumb = [];

  constructor(private borrowingStore$: Store<IBorrowingState>,
              private actualizeBorrowingService: ActualizeBorrowingService,
              private translate: TranslateService,
              private toastrService: ToastrService,
              private router: Router) {
  }

  ngOnInit() {
    this.borrowingSub = this.borrowingStore$.select(fromRoot.getBorrowingState).subscribe(
      (borrowingState: IBorrowingState) => {
        if ( borrowingState['loaded'] && !borrowingState['error'] && borrowingState['success'] ) {
          this.borrowing = borrowingState['borrowing'];
          const borrowingProfile = borrowingState['borrowing']['profile'];
          const profileType = borrowingProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: borrowingProfile['name'],
              link: `/profiles/${profileType['type']}/${borrowingProfile['id']}/info`
            },
            {
              name: 'BORROWINGS',
              link: `/profiles/${profileType}/${borrowingProfile['id']}/borrowings`
            },
            {
              name: 'OPERATIONS',
              link: ''
            }
          ];

          this.arr = [
            {
              name: 'REPAYMENT',
              route: `/borrowings/${borrowingState['borrowing']['id']}/schedule/repayment`,
              icon: {collection: 'standard', name: 'product_request', className: 'product-request'},
              disabled: false
            },
            {
              name: 'ACTUALIZE_BORROWING',
              route: false,
              icon: {collection: 'standard', name: 'announcement', className: 'announcement'},
              disabled: false
            }
          ]
        }
      });

    setTimeout(() => {
      this.borrowingStore$.dispatch(new fromStore.SetBorrowingBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  navigate(item) {
    if ( item.name === 'ACTUALIZE_BORROWING' ) {
      this.openActualizeModal();
    } else {
      this.router.navigateByUrl(item.route);
    }
  }

  openActualizeModal() {
    this.isOpenActualize = true;
    this.borrowingDate = moment().format(environment.DATE_FORMAT_MOMENT);
  }

  submitActualizeBorrowing() {
    this.isOpenActualize = false;
    this.isLoading = true;
    this.actualizeBorrowingService.actualizeBorrowing(this.borrowing['id'], this.borrowingDate).subscribe(res => {
      if ( res.error ) {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, '', environment.ERROR_TOAST_CONFIG);
        this.isLoading = false;
      } else {
        this.translate.get('SUCCESS').subscribe((translation: string) => {
          this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.borrowingStore$.dispatch(new fromStore.LoadBorrowing(this.borrowing['id']));
        this.isLoading = false;
      }
    });
  }

}

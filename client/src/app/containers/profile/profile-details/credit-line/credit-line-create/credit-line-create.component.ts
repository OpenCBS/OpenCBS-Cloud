import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { environment } from '../../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { CreditLineFormComponent } from '../shared/credit-line-form/credit-line-form.component';
import { CreditLineCreateService, ICreateCreditLine, IProfile } from '../../../../../core/store';

const SVG_DATA = {collection: 'standard', class: 'calibration', name: 'calibration'};

@Component({
  selector: 'cbs-credit-line-create',
  templateUrl: './credit-line-create.component.html'
})

export class CreditLineCreateComponent implements OnInit {
  @ViewChild(CreditLineFormComponent, {static: false}) creditLineForm: CreditLineFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public profile: any;
  public creditLine: any;
  public profileId: number;
  public profileType: string;
  public breadcrumb = [];

  private routeSub: Subscription;
  private profileSub: Subscription;
  private createCreditLineSub: Subscription;

  constructor(private creditLineStore$: Store<ICreateCreditLine>,
              private creditLineCreateService: CreditLineCreateService,
              private profileStore$: Store<IProfile>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params.subscribe(params => {
      this.profileId = +params['id'];
      this.profileType = params['type'];
    });

    this.profileSub = this.profileStore$.select(fromRoot.getProfileState)
      .subscribe(profile => {
        if ( profile ) {
          this.breadcrumb = [
            {
              name: 'PROFILES',
              link: `/profiles`
            },
            {
              name: profile['name'],
              link: `/profiles/${this.profileType}/${this.profileId}/info`
            },
            {
              name: 'CREDIT_LINES',
              link: `/profiles/${this.profileType}/${this.profileId}/credit-line-list`
            },
            {
              name: 'CREDIT_LINE_CREATE',
              link: ''
            }
          ];
        }
      });

    this.createCreditLineSub = this.store$.pipe(select(fromRoot.getCreditLineCreateState))
      .subscribe((state: ICreateCreditLine) => {
        if ( state.loaded && state.success && !state.error ) {
          this.resetState();
          this.goToViewCreditLines();
        } else if ( state.loaded && !state.success && state.error ) {
          this.disableSubmitBtn(false);
          this.resetState();
        }
      });
  }

  submitForm() {
    if ( this.creditLineForm.form.valid ) {
      this.creditLine = Object.assign({}, this.creditLineForm.form.value);
      const penaltiesIdToSend = [];
      this.creditLineForm.selectedPenalties.map(penalty => {
        penaltiesIdToSend.push(penalty.id);
      });
      this.creditLine.penalties = penaltiesIdToSend;
      this.creditLine.profileId = this.profileId;

      this.creditLineCreateService.createCreditLine(this.creditLine)
        .subscribe(
          (res: any) => {
          if ( res.error ) {
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.toastrService.clear();
            this.translate.get('CREATE_SUCCESS').subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['/profiles', this.profileType, this.profileId, 'credit-line', res.id]);
            this.creditLineStore$.dispatch(new fromStore.LoadCreditLine(res.id));
          }
        });
    }
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.creditLineStore$.dispatch(new fromStore.CreateCreditLineReset());
  }

  goToViewCreditLines() {
    this.router.navigate(['/profiles', this.profileType, this.profileId, 'credit-line-list']);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../../core/store';
import { ILoanAppGuarantorList, IProfileList, IRelationshipList } from '../../../../../core/store';
import { environment } from '../../../../../../environments/environment';
import * as fromRoot from '../../../../../core/core.reducer';

@Component({
  selector: 'cbs-guarantor-form',
  templateUrl: 'guarantor-form.component.html',
  styleUrls: ['guarantor-form.component.scss']
})

export class GuarantorFormComponent implements OnInit {
  @Input() loanAppId: number;
  public configs = {
    relationshipLookupUrl: {url: `${environment.API_ENDPOINT}relationships`},
    profileLookupUrl: {url: ''}
  };
  public form: FormGroup;
  public relationshipsSub: any;
  public selectLabel = 'SELECT';
  public reg = new RegExp('^[0-9.]+$');

  constructor(private profilesStore$: Store<IProfileList>,
              private store$: Store<fromRoot.State>,
              private relationshipsStore$: Store<IRelationshipList>,
              private loanAppGuarantorsStore$: Store<ILoanAppGuarantorList>) {
    this.relationshipsSub = this.store$.select(fromRoot.getRelationshipListState);
  }

  ngOnInit() {
    if (!this.form) {
      this.createForm();
    }
    this.loadProfiles();
    this.loadRelationships();
  }

  setValues(guarantor) {
    this.selectLabel = guarantor.profile.name;
    this.form.controls['profileId'].setValue(guarantor.profile.id);
    this.form.controls['relationshipId'].setValue(guarantor.relationship.id);
    this.form.controls['amount'].setValue(guarantor.amount);
    this.form.controls['description'].setValue(guarantor.description);
  }

  createForm() {
    this.form = new FormGroup({
      profileId: new FormControl('', Validators.required),
      relationshipId: new FormControl('', Validators.required),
      amount: new FormControl('', [Validators.pattern(this.reg)]),
      description: new FormControl('')
    });
  }

  setLookupValue(guarantor) {
    if (guarantor && guarantor.id) {
      this.form.controls['profileId'].setValue(+guarantor.id);
    } else {
      this.form.controls['profileId'].setValue('');
    }
  }

  getGuarantorsList(id) {
    this.loanAppGuarantorsStore$.dispatch(new fromStore.LoadGuarantors(id));
  }

  loadRelationships() {
    this.relationshipsStore$.dispatch(new fromStore.LoadRelationships());
  }

  loadProfiles() {
    this.profilesStore$.dispatch(new fromStore.LoadProfiles());
  }
}

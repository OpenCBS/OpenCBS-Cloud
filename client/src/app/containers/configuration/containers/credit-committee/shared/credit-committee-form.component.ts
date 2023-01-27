import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { RoleListState } from '../../../../../core/store/roles';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';

@Component({
  selector: 'cbs-credit-committee-form',
  templateUrl: 'credit-committee-form.component.html'
})

export class CCRulesFormComponent implements OnInit, OnDestroy {
  @Output() onChange = new EventEmitter();
  public form: FormGroup;
  public selectedItems = [];
  public roles = [];
  public rolesSub: any;
  public isValid = false;

  constructor(private roleStore$: Store<RoleListState>,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      amount: new FormControl('', Validators.required)
    });
    this.rolesSub = this.store$.pipe(select(fromRoot.getRolesState))
    .subscribe((roleState: RoleListState) => {
      console.log('roleState ', roleState);
      if (roleState.loaded && roleState.success && !roleState.error) {
        this.roles = [...roleState.roles];
        this.compare(this.selectedItems, this.roles);
      }
    });
    this.roleStore$.dispatch(new fromStore.LoadRoleList());
  }

  removeRole(removedItem) {
    this.roles.push(removedItem);
    this.selectedItems.map(item => {
      if (item['id'] === removedItem['id']) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
      }
    });
    this.onChange.emit(this.selectedItems);
    this.checkItemsLength();
  }


  addRole(pickedItem) {
    this.selectedItems.push(pickedItem);
    this.roles.map(item => {
      if (item['id'] === pickedItem['id']) {
        this.roles.splice(this.roles.indexOf(pickedItem), 1);
      }
    });
    this.checkItemsLength();
    this.onChange.emit(this.selectedItems);
  }

  checkItemsLength() {
    if (this.selectedItems.length) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  setValues(amount, chosenRoles) {
    this.form.controls['amount'].setValue(amount);
    this.selectedItems = chosenRoles;
    if (this.roles) {
      this.compare(this.selectedItems, this.roles);
    }
  }

  ngOnDestroy() {
    this.rolesSub.unsubscribe();
    this.roleStore$.dispatch(new fromStore.RoleListReset());
  }

  compare(selected, all) {
    selected.map(item => {
      all.map(role => {
        if (item['id'] === role['id']) {
          all.splice(all.indexOf(role), 1);
        }
      });
    });
  }
}

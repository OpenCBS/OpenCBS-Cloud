import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BranchesRoutingModule } from './branches-routing.module';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchInfoComponent } from './branch-info/branch-info.component';
import { BranchEditComponent } from './branch-edit/branch-edit.component';
import { BranchCreateComponent } from './branch-create/branch-create.component';
import { CoreModule } from '../../../../core/core.module';
import { NglModule } from 'ngx-lightning';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    NglModule,
    ReactiveFormsModule,
    TranslateModule,
    BranchesRoutingModule
  ],
  declarations: [
    BranchListComponent,
    BranchInfoComponent,
    BranchEditComponent,
    BranchCreateComponent
  ]
})
export class BranchesModule {
}

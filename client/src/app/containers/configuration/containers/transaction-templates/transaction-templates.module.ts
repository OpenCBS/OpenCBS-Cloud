import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionTemplatesRoutingModule } from './transaction-templates-routing.module';
import { TransactionTemplatesComponent } from './transaction-templates/transaction-templates.component';
import { CoreModule } from '../../../../core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NglModule } from 'ngx-lightning';
import { TransactionTemplatesCreateComponent } from './transaction-templates-create/transaction-templates-create.component';
import { TransactionTemplatesFormComponent } from './transaction-templates-form/transaction-templates-form.component';
import { TransactionTemplatesInfoComponent } from './transaction-templates-info/transaction-templates-info.component';
import { TransactionTemplatesEditComponent } from './transaction-templates-edit/transaction-templates-edit.component';

@NgModule({
  imports: [
    CommonModule,
    TransactionTemplatesRoutingModule,
    TranslateModule,
    CoreModule,
    NglModule.forRoot(),
    ReactiveFormsModule,
  ],
  declarations: [
    TransactionTemplatesComponent,
    TransactionTemplatesCreateComponent,
    TransactionTemplatesFormComponent,
    TransactionTemplatesInfoComponent,
    TransactionTemplatesEditComponent
  ]
})
export class TransactionTemplatesModule {
}

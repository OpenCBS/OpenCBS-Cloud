import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NglModule } from 'ngx-lightning';
import { CoreModule } from '../../core/core.module';

import { TransfersRoutingModule } from './transfers-routing.module';
import { TransfersService } from './transfers.service'
import { TransfersComponent } from './transfers-component/transfers.component'
import { TransferFromBankToVaultComponent } from './transfer-from-bank-to-vault/transfer-from-bank-to-vault.component'
import { TransferFromVaultToBankComponent } from './transfer-from-vault-to-bank/transfer-from-vault-to-bank.component'
import { TransferBetweenMembersComponent } from './transfer-between-members/transfer-between-members.component'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    CoreModule,
    NglModule,
    TransfersRoutingModule
  ],
  declarations: [
    TransfersComponent,
    TransferFromBankToVaultComponent,
    TransferFromVaultToBankComponent,
    TransferBetweenMembersComponent
  ],
  providers: [
    TransfersService
  ]
})
export class TransfersModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VaultsRoutingModule } from './vaults-routing.module';
import { VaultsComponent } from './vaults/vaults.component';
import { CoreModule } from '../../../../core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NglModule } from 'ngx-lightning';
import { VaultCreateComponent } from './vault-create/vault-create.component';
import { VaultFormComponent } from './vault-form/vault-form.component';
import { VaultInfoComponent } from './vault-info/vault-info.component';
import { VaultEditComponent } from './vault-edit/vault-edit.component';

@NgModule({
  imports: [
    CommonModule,
    VaultsRoutingModule,
    TranslateModule,
    CoreModule,
    NglModule,
    ReactiveFormsModule,
  ],
  declarations: [
    VaultsComponent,
    VaultCreateComponent,
    VaultFormComponent,
    VaultInfoComponent,
    VaultEditComponent
  ]
})
export class VaultsModule {
}

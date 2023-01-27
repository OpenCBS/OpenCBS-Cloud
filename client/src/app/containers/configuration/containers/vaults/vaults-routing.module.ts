import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VaultsComponent } from './vaults/vaults.component';
import { VaultCreateComponent } from './vault-create/vault-create.component';
import { VaultInfoComponent } from './vault-info/vault-info.component';
import { VaultEditComponent } from './vault-edit/vault-edit.component';

const routes: Routes = [
  {
    path: 'configuration/vaults',
    component: VaultsComponent
  },
  {
    path: 'configuration/vaults/create',
    component: VaultCreateComponent
  },
  {
    path: 'configuration/vaults/:id',
    component: VaultInfoComponent
  },
  {
    path: 'configuration/vaults/:id/edit',
    component: VaultEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaultsRoutingModule {
}

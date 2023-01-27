import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { UsersModule } from './containers/users/users.module';
import { RolesModule } from './containers/roles/roles.module';
import { CreditCommitteeModule } from './containers/credit-committee/credit-committee.module';
import { LocationsModule } from './containers/locations/locations.module';
import { LoanPurposesModule } from './containers/loan-purposes/loan-purposes.module';
import { PayeesModule } from './containers/payees/payees.module';
import { HolidaysModule } from './containers/holidays/holidays.module';
import { BusinessSectorsModule } from './containers/business-sectors/business-sectors.module';
import { ProfessionsModule } from './containers/professions/professions.module';
import { EntryFeesModule } from './containers/entry-fees/entry-fees.module';
import { ProfileFieldsModule } from './containers/custom-fields/custom-fields.module';
import { CollateralTypesModule } from './containers/collateral-types/collateral-types.module';
import { LoanProductsModule } from './containers/loan-products/loan-products.module';
import { BranchesModule } from './containers/branches/branches.module';
import { TillsModule } from './containers/tills/tills.module';
import { VaultsModule } from './containers/vaults/vaults.module';
import { CbsSharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../core/core.module';
import { ConfigurationWrapComponent } from './configuration-wrap/configuration-wrap.component';
import { NglModule } from 'ngx-lightning';
import { SavingProductsModule } from './containers/saving-products/saving-products.module';
import { BorrowingProductModule } from './containers/borrowing-product/borrowing-product.module';
import { TermDepositProductModule } from './containers/term-deposit-product/term-deposit-product.module';
import { OtherFeesListModule } from './containers/other-fees-list/other-fees-list.module';
import { SystemSettingModule } from './containers/system-setting/system-setting.module';
import { PenaltiesModule } from './containers/penalties/penalties.module';
import { TransactionTemplatesModule } from './containers/transaction-templates/transaction-templates.module';
import { PaymentMethodsModule } from './containers/payment-methods/payment-methods.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    CbsSharedModule,
    TranslateModule,
    NglModule,
    ConfigurationRoutingModule,
    UsersModule,
    RolesModule,
    CreditCommitteeModule,
    LocationsModule,
    LoanPurposesModule,
    PayeesModule,
    HolidaysModule,
    BusinessSectorsModule,
    ProfessionsModule,
    EntryFeesModule,
    OtherFeesListModule,
    ProfileFieldsModule,
    CollateralTypesModule,
    LoanProductsModule,
    VaultsModule,
    BranchesModule,
    TillsModule,
    SavingProductsModule,
    TermDepositProductModule,
    BorrowingProductModule,
    SystemSettingModule,
    PenaltiesModule,
    TransactionTemplatesModule,
    PaymentMethodsModule
  ],
  declarations: [
    ConfigurationComponent,
    ConfigurationWrapComponent
  ]
})
export class ConfigurationModule {
}

import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as store from './store';
import { creditLineUpdateReducer, IUpdateCreditLine } from './store';

export interface State {
  accountingEntries: store.IAccountingEntries,
  accountMakerChecker: store.AccountMakerCheckerState,
  auditTrailObjects: store.IAuditTrailObjects,
  auth: store.AuthAppState,
  branchCreate: store.IBranch,
  branchUpdate: store.IUpdateBranch,
  branchInfo: store.IBranchInfo,
  branchList: store.IBranchList,
  branchFields: store.BranchFieldsState,
  businessSectorList: store.IBusinessSectorList,
  businessSectorCreate: store.ICreateBusinessSector,
  businessSectorUpdate: store.IUpdateBusinessSector,
  chartOfAccounts: store.IChartOfAccounts,
  collateralTypeCreate: store.CreateCollateralTypeState,
  collateralTypeDetails: store.CollateralTypeDetails,
  collateralTypeList: store.CollateralTypeListState,
  collateralTypeUpdate: store.UpdateCollateralTypeState,
  ccRulesList: store.CCRulesListState,
  ccRuleCreate: store.CreateCCRuleState,
  ccRulesInfo: store.CCRulesInfoState,
  ccRulesUpdate: store.UpdateCCRulesState,
  currencyList: store.ICurrencyList,
  entryFeeList: store.EntryFeeListState,
  entryFeeCreate: store.CreateEntryFeeState,
  entryFeeUpdate: store.UpdateEntryFeeState,
  globalPermissions: store.GlobalPermissionsState,
  holidayList: store.HolidayListState,
  holidayCreate: store.CreateHolidayState,
  holidayUpdate: store.UpdateHolidayState,
  loanApplication: store.ILoanAppState,
  loanAppMakerCheckerDisburse: store.ILoanAppMakerCheckerDisburseState,
  loanAppAttachments: store.ILoanAppAttachList,
  loanAppAttachmentDelete: store.ILoanAppAttachDelete,
  loanAppCollaterals: store.ILoanAppCollateralList,
  loanApplicationComments: store.ILoanApplicationComments,
  loanAppCreateCollateral: store.ILoanAppCollateralCreate,
  loanAppCollateral: store.ILoanAppCollateral,
  loanAppCollateralDelete: store.ILoanAppCollateralDelete,
  loanAppUpdateCollateral: store.ILoanAppCollateralUpdate,
  loanAppCCActivityList: store.ILoanAppCCActivityList,
  loanApplicationCreate: store.ILoanAppCreateState,
  loanAppFields: store.LoanApplicationFieldsState,
  loanAppForm: store.ILoanAppFormState,
  borrowing: store.IBorrowingState,
  borrowingForm: store.IBorrowingFormState,
  borrowingCreate: store.IBorrowingCreateState,
  borrowingSchedule: store.IBorrowingSchedule,
  borrowingList: store.IBorrowingList,
  borrowingUpdate: store.IBorrowingUpdateState,
  borrowingEvents: store.IBorrowingEvents,
  loanAppGuarantors: store.ILoanAppGuarantorList,
  loanAppGuarantor: store.ILoanAppGuarantor,
  loanAppGuarantorDelete: store.ILoanAppGuarantorDelete,
  loanAppCreateGuarantor: store.ILoanAppGuarantorCreate,
  loanAppUpdateGuarantor: store.ILoanAppGuarantorUpdate,
  loanApplicationList: store.ILoanAppList,
  loanApplicationUpdate: store.ILoanAppUpdateState,
  loanAppSchedule: store.ILoanAppSchedule,
  relationshipList: store.IRelationshipList,
  loanProduct: store.LoanProductState,
  loanProductMakerChecker: store.LoanProductMakerCheckerState,
  loanProducts: store.LoanProductListState,
  loanProductUpdate: store.UpdateLoanProductState,
  loanProductCreate: store.CreateLoanProductState,
  loanProductHistory: store.LoanProductHistoryState,
  loanPurposeList: store.LoanPurposeListState,
  loanPurposeCreate: store.CreateLoanPurposeState,
  loanPurposeUpdate: store.UpdateLoanPurposeState,
  loanAttachmentDelete: store.ILoanAttachDelete,
  loanAttachmentList: store.ILoanAttachmentList,
  loanList: store.ILoanList,
  loanInfo: store.ILoanInfo,
  loanPayee: store.ILoanPayee,
  loanPayeeUpdate: store.ILoanPayeeUpdateState,
  loanEvents: store.ILoanEvents,
  loanMakerCheckerRollback: store.ILoanMakerCheckerRollback,
  loanPayeeEvents: store.LoanPayeeEventsState,
  loanSchedule: store.ILoanSchedule,
  loanMakerCheckerRepayment: store.ILoanMakerCheckerRepayment,
  locationList: store.LocationListState,
  locationCreate: store.CreateLocationState,
  locationUpdate: store.UpdateLocationState,
  otherFees: store.IOtherFees,
  payeeList: store.PayeeListState,
  payeeCreate: store.CreatePayeeState,
  payeeUpdate: store.UpdatePayeeState,
  professionList: store.ProfessionListState,
  professionCreate: store.CreateProfessionState,
  professionUpdate: store.UpdateProfessionState,
  profiles: store.IProfileList,
  profile: store.IProfile,
  profileMakerChecker: store.IProfile,
  profileFields: store.ProfileFieldsState,
  createProfile: store.CreateProfileState,
  updateProfile: store.UpdateProfileState,
  profileChanges: store.IProfileChanges,
  profileAttachments: store.ProfileAttachmentListState,
  profileAttachmentDelete: store.DeleteProfileAttachState,
  profileEventList: store.ProfileEventListState,
  profileCurrentAccountList: store.ICurrentAccountList,
  roles: store.RoleListState,
  roleUpdate: store.UpdateRoleState,
  roleCreate: store.CreateRoleState,
  roleInfo: store.RoleState,
  roleMakerChecker: store.RoleMakerCheckerState,
  savingProduct: store.SavingProductState,
  savingProductMakerChecker: store.SavingProductMakerCheckerState,
  savingProducts: store.SavingProductListState,
  savingProductUpdate: store.UpdateSavingProductState,
  savingProductCreate: store.CreateSavingProductState,
  tellerList: store.TellerListState,
  operationCreate: store.ICreateOperation,
  operationList: store.IOperationList,
  tillCreate: store.ICreateTill,
  tillList: store.ITillList,
  tillUpdate: store.IUpdateTill,
  tillInfo: store.ITillInfo,
  currentUser: store.CurrentUserAppState,
  users: store.UserListState,
  user: store.UserState,
  userMakerChecker: store.UserMakerCheckerState,
  userUpdate: store.UpdateUserState,
  userCreate: store.CreateUserState,
  vaultList: store.IVaultList,
  vaultCreate: store.ICreateVault,
  vaultUpdate: store.IUpdateVault,
  vaultInfo: store.IVaultInfo,
  currentAccountTransactions: store.ICurrentAccountTransactions,
  exchangeRate: store.ExchangeRateState,
  chartOfAccountCreate: store.ICreateChartOfAccount,
  chartOfAccountUpdate: store.IUpdateChartOfAccount,
  borrowingProductCreate: store.ICreateBorrowingProduct,
  borrowingProductInfo: store.IBorrowingProductInfo,
  borrowingProductList: store.IBorrowingProductList,
  borrowingProductUpdate: store.IUpdateBorrowingProduct,
  otherFeeList: store.OtherFeeListState,
  otherFeeCreate: store.CreateOtherFeeState,
  otherFeeUpdate: store.UpdateOtherFeeState,
  saving: store.ISavingState,
  savingCreate: store.ISavingCreateState,
  savingList: store.ISavingList,
  savingUpdate: store.ISavingUpdateState,
  savingEntries: store.ISavingEntries,
  savingProfileList: store.ISavingProfileList,
  termDeposit: store.ITermDepositState,
  termDepositCreate: store.ITermDepositCreateState,
  termDepositList: store.ITermDepositList,
  termDepositProfileList: store.ITermDepositProfileList,
  termDepositUpdate: store.ITermDepositUpdateState,
  termDepositEntries: store.ITermDepositEntries,
  termDepositAccountTransactions: store.ITermDepositAccountTransactions,
  termDepositProductCreate: store.ICreateTermDepositProduct,
  termDepositProductInfo: store.ITermDepositProductInfo,
  termDepositProductList: store.ITermDepositProductList,
  termDepositProductUpdate: store.IUpdateTermDepositProduct,
  termDepositProductMakerChecker: store.TermDepositProductMakerCheckerState,
  dayClosure: store.DayClosureState,
  bond: store.BondState,
  bondCreate: store.BondCreateState,
  bondList: store.IBondList,
  bondUpdate: store.IBondUpdateState,
  bondSchedule: store.IBondSchedule,
  bondForm: store.BondFormState,
  bondEvents: store.BondEventsState,
  makerCheckerList: store.IMakerCheckerList,
  systemSetting: store.ISystemSettingState,
  updateSystemSetting: store.UpdateSystemSettingState,
  penaltyCreate: store.CreatePenaltyState,
  penalties: store.PenaltiesState,
  penaltyUpdate: store.UpdatePenaltyState,
  createTransactionTemplates: store.CreateTransactionTemplatesState,
  transactionTemplatesInfo: store.TransactionTemplatesInfoState,
  transactionTemplatesList: store.TransactionTemplatesListState,
  updateTransactionTemplates: store.UpdateTransactionTemplatesState,
  paymentMethodCreate: store.CreatePaymentMethodState,
  paymentMethodList: store.PaymentMethodListState,
  paymentMethodUpdate: store.UpdatePaymentMethodState,
  integrationWithBankExport: store.IIntegrationWithBankExport,
  integrationWithBankExportFileList: store.IIntegrationWithBankExportFileList,
  integrationWithBankImportFileList: store.IIntegrationWithBankImportFileList,
  paymentGateway: store.IPaymentGatewayState
  creditLine: store.ICreditLine,
  creditLineCreate: store.ICreateCreditLine,
  creditLineUpdate: store.IUpdateCreditLine
}

export const reducers: ActionReducerMap<State> = {
  accountingEntries: store.accountingEntriesReducer,
  accountMakerChecker: store.accountMakerCheckerReducer,
  auditTrailObjects: store.auditTrailReducer,
  auth: store.authReducer,
  branchCreate: store.branchCreateReducer,
  branchUpdate: store.branchUpdateReducer,
  branchInfo: store.branchInfoReducer,
  branchList: store.branchListReducer,
  branchFields: store.branchFieldsReducer,
  businessSectorList: store.businessSectorListReducer,
  businessSectorCreate: store.businessSectorCreateReducer,
  businessSectorUpdate: store.businessSectorUpdateReducer,
  chartOfAccounts: store.chartOfAccountsReducer,
  collateralTypeCreate: store.collateralTypeCreateReducer,
  collateralTypeDetails: store.collateralTypeDetailsReducer,
  collateralTypeList: store.collateralTypeListReducer,
  collateralTypeUpdate: store.collateralTypeUpdateReducer,
  ccRulesList: store.ccRulesListReducer,
  ccRuleCreate: store.ccRuleCreateReducer,
  ccRulesInfo: store.ccRulesInfoReducer,
  ccRulesUpdate: store.ccRulesUpdateReducer,
  currencyList: store.currencyListReducer,
  entryFeeList: store.entryFeeListReducer,
  entryFeeCreate: store.entryFeeCreateReducer,
  entryFeeUpdate: store.entryFeeUpdateReducer,
  globalPermissions: store.globalPermissionsReducer,
  holidayList: store.holidayListReducer,
  holidayCreate: store.holidayCreateReducer,
  holidayUpdate: store.holidayUpdateReducer,
  loanApplication: store.loanApplicationReducer,
  loanAppMakerCheckerDisburse: store.loanAppMakerCheckerDisburseReducer,
  loanAppAttachments: store.loanAppAttachmentListReducer,
  loanAppAttachmentDelete: store.loanAppAttachmentDelReducer,
  loanAppCollaterals: store.loanAppCollateralsListReducer,
  loanApplicationComments: store.loanApplicationCommentsReducer,
  loanAppCreateCollateral: store.loanAppCreateCollateralReducer,
  loanAppCollateral: store.loanAppCollateralReducer,
  loanAppCollateralDelete: store.loanAppCollateralDelReducer,
  loanAppUpdateCollateral: store.loanAppCollateralUpdateReducer,
  loanAppCCActivityList: store.loanAppCCActivityListReducer,
  loanApplicationCreate: store.loanApplicationCreateReducer,
  loanAppFields: store.loanApplicationFieldsReducer,
  loanAppForm: store.loanAppFormReducer,
  loanPayeeUpdate: store.loanPayeeUpdateReducer,
  loanPayeeEvents: store.loanPayeeEventsReducer,
  borrowing: store.borrowingReducer,
  borrowingForm: store.borrowingFormReducer,
  borrowingCreate: store.borrowingCreateReducer,
  borrowingSchedule: store.borrowingScheduleReducer,
  borrowingList: store.borrowingListReducer,
  borrowingUpdate: store.borrowingUpdateReducer,
  borrowingEvents: store.borrowingEventsReducer,
  loanAppGuarantors: store.loanAppGuarantorsListReducer,
  loanAppGuarantor: store.loanAppGuarantorReducer,
  loanAppGuarantorDelete: store.loanAppGuarantorDelReducer,
  loanAppCreateGuarantor: store.loanAppCreateGuarantorReducer,
  loanAppUpdateGuarantor: store.loanAppUpdateGuarantorReducer,
  loanApplicationList: store.loanApplicationListReducer,
  loanApplicationUpdate: store.loanApplicationUpdateReducer,
  loanAppSchedule: store.loanAppScheduleReducer,
  relationshipList: store.relationshipListReducer,
  loanProduct: store.loanProductReducer,
  loanProductMakerChecker: store.loanProductMakerCheckerReducer,
  loanProducts: store.loanProductListReducer,
  loanProductUpdate: store.loanProductUpdateReducer,
  loanProductCreate: store.loanProductCreateReducer,
  loanProductHistory: store.loanProductHistoryReducer,
  loanPurposeList: store.loanPurposeListReducer,
  loanPurposeCreate: store.loanPurposeCreateReducer,
  loanPurposeUpdate: store.loanPurposeUpdateReducer,
  loanAttachmentDelete: store.loanAttachmentDelReducer,
  loanAttachmentList: store.loanAttachmentListReducer,
  loanList: store.loanListReducer,
  loanInfo: store.loanInfoReducer,
  loanPayee: store.loanPayeeReducer,
  loanEvents: store.loanEventsReducer,
  loanMakerCheckerRollback: store.loanMakerCheckerRollbackReducer,
  loanSchedule: store.loanScheduleReducer,
  loanMakerCheckerRepayment: store.loanMakerCheckerRepaymentReducer,
  locationList: store.locationListReducer,
  locationCreate: store.locationCreateReducer,
  locationUpdate: store.locationUpdateReducer,
  otherFees: store.otherFeesReducer,
  payeeList: store.payeeListReducer,
  payeeCreate: store.payeeCreateReducer,
  payeeUpdate: store.payeeUpdateReducer,
  professionList: store.professionListReducer,
  professionCreate: store.professionCreateReducer,
  professionUpdate: store.professionUpdateReducer,
  profiles: store.profilesReducer,
  profile: store.profileReducer,
  profileMakerChecker: store.profileMakerCheckerReducer,
  profileFields: store.profileFieldsReducer,
  createProfile: store.createProfileReducer,
  updateProfile: store.updateProfileReducer,
  profileChanges: store.profileChangesReducer,
  profileAttachments: store.profileAttachmentListReducer,
  profileAttachmentDelete: store.profileAttachmentDelReducer,
  profileEventList: store.profileEventListReducer,
  profileCurrentAccountList: store.currentAccountListReducer,
  roles: store.roleListReducer,
  roleUpdate: store.roleUpdateReducer,
  roleCreate: store.roleCreateReducer,
  roleInfo: store.roleReducer,
  roleMakerChecker: store.roleMakerCheckerReducer,
  savingProduct: store.savingProductReducer,
  savingProductMakerChecker: store.savingProductMakerCheckerReducer,
  savingProducts: store.savingProductListReducer,
  savingProductUpdate: store.savingProductUpdateReducer,
  savingProductCreate: store.savingProductCreateReducer,
  tellerList: store.tellerListReducer,
  operationCreate: store.operationCreateReducer,
  operationList: store.operationListReducer,
  tillCreate: store.tillCreateReducer,
  tillList: store.tillListReducer,
  tillUpdate: store.tillUpdateReducer,
  tillInfo: store.tillInfoReducer,
  currentUser: store.currentUserReducer,
  users: store.userListReducer,
  user: store.userReducer,
  userMakerChecker: store.userMakerCheckerReducer,
  userUpdate: store.userUpdateReducer,
  userCreate: store.userCreateReducer,
  vaultList: store.vaultListReducer,
  vaultCreate: store.vaultCreateReducer,
  vaultUpdate: store.vaultUpdateReducer,
  vaultInfo: store.vaultInfoReducer,
  currentAccountTransactions: store.currentAccountTransactionsReducer,
  exchangeRate: store.exchangeRateReducer,
  chartOfAccountCreate: store.chartOfAccountCreateReducer,
  chartOfAccountUpdate: store.chartOfAccountUpdateReducer,
  borrowingProductCreate: store.borrowingProductCreateReducer,
  borrowingProductInfo: store.borrowingProductInfoReducer,
  borrowingProductList: store.borrowingProductListReducer,
  borrowingProductUpdate: store.borrowingProductUpdateReducer,
  otherFeeList: store.otherFeeListReducer,
  otherFeeCreate: store.otherFeeCreateReducer,
  otherFeeUpdate: store.otherFeeUpdateReducer,
  saving: store.savingReducer,
  savingCreate: store.savingCreateReducer,
  savingList: store.savingListReducer,
  savingProfileList: store.savingProfileListReducer,
  savingUpdate: store.savingUpdateReducer,
  savingEntries: store.savingEntriesReducer,
  termDeposit: store.termDepositReducer,
  termDepositCreate: store.termDepositCreateReducer,
  termDepositList: store.termDepositListReducer,
  termDepositProfileList: store.termDepositProfileListReducer,
  termDepositUpdate: store.termDepositUpdateReducer,
  termDepositEntries: store.termDepositEntriesReducer,
  termDepositAccountTransactions: store.termDepositAccountTransactionsReducer,
  termDepositProductCreate: store.termDepositProductCreateReducer,
  termDepositProductInfo: store.termDepositProductInfoReducer,
  termDepositProductList: store.termDepositProductListReducer,
  termDepositProductUpdate: store.termDepositProductUpdateReducer,
  termDepositProductMakerChecker: store.termDepositProductMakerCheckerReducer,
  dayClosure: store.dayClosureReducer,
  bond: store.bondReducer,
  bondCreate: store.bondCreateReducer,
  bondList: store.bondListReducer,
  bondUpdate: store.bondUpdateReducer,
  bondSchedule: store.bondScheduleReducer,
  bondForm: store.bondFormReducer,
  bondEvents: store.bondEventsReducer,
  makerCheckerList: store.makerCheckerListReducer,
  systemSetting: store.systemSettingReducer,
  updateSystemSetting: store.updateSystemSettingReducer,
  penaltyCreate: store.penaltyCreateReducer,
  penalties: store.penaltiesReducer,
  penaltyUpdate: store.penaltyUpdateReducer,
  createTransactionTemplates: store.transactionTemplatesCreateReducer,
  transactionTemplatesInfo: store.transactionTemplatesInfoReducer,
  transactionTemplatesList: store.transactionTemplatesListReducer,
  updateTransactionTemplates: store.transactionTemplatesUpdateReducer,
  paymentMethodCreate: store.paymentMethodCreateReducer,
  paymentMethodList: store.paymentMethodListReducer,
  paymentMethodUpdate: store.paymentMethodUpdateReducer,
  integrationWithBankExport: store.integrationWithBankExportReducer,
  integrationWithBankImportFileList: store.integrationWithBankImportFileListReducer,
  integrationWithBankExportFileList: store.integrationWithBankExportFileListReducer,
  paymentGateway: store.paymentGatewayReducer,
  creditLine: store.creditLineReducer,
  creditLineCreate: store.creditLineCreateReducer,
  creditLineUpdate: store.creditLineUpdateReducer
};

export const getStates = createFeatureSelector<State>(
  'appStates'
);

export const getAccountingEntriesState = createSelector(getStates, (state: State) => state.accountingEntries);
export const getAccountMakerCheckerState = createSelector(getStates, (state: State) => state.accountMakerChecker);
export const getAuditTrailObjectsState = createSelector(getStates, (state: State) => state.auditTrailObjects);
export const getAuthState = createSelector(getStates, (state: State) => state.auth);
export const getBranchCreateState = createSelector(getStates, (state: State) => state.branchCreate);
export const getBranchUpdateState = createSelector(getStates, (state: State) => state.branchUpdate);
export const getBranchInfoState = createSelector(getStates, (state: State) => state.branchInfo);
export const getBranchListState = createSelector(getStates, (state: State) => state.branchList);
export const getBranchFieldsState = createSelector(getStates, (state: State) => state.branchFields);
export const getBusinessSectorListState = createSelector(getStates, (state: State) => state.businessSectorList);
export const getBusinessSectorCreateState = createSelector(getStates, (state: State) => state.businessSectorCreate);
export const getBusinessSectorUpdateState = createSelector(getStates, (state: State) => state.businessSectorUpdate);
export const getChartOfAccountsState = createSelector(getStates, (state: State) => state.chartOfAccounts);
export const getCollateralTypeCreateState = createSelector(getStates, (state: State) => state.collateralTypeCreate);
export const getCollateralTypeDetailsState = createSelector(getStates, (state: State) => state.collateralTypeDetails);
export const getCollateralTypeListState = createSelector(getStates, (state: State) => state.collateralTypeList);
export const getCollateralTypeUpdateState = createSelector(getStates, (state: State) => state.collateralTypeUpdate);
export const getCcRulesListState = createSelector(getStates, (state: State) => state.ccRulesList);
export const getCcRuleCreateState = createSelector(getStates, (state: State) => state.ccRuleCreate);
export const getCcRulesInfoState = createSelector(getStates, (state: State) => state.ccRulesInfo);
export const getCcRulesUpdateState = createSelector(getStates, (state: State) => state.ccRulesUpdate);
export const getCurrencyListState = createSelector(getStates, (state: State) => state.currencyList);
export const getEntryFeeListState = createSelector(getStates, (state: State) => state.entryFeeList);
export const getEntryFeeCreateState = createSelector(getStates, (state: State) => state.entryFeeCreate);
export const getEntryFeeUpdateState = createSelector(getStates, (state: State) => state.entryFeeUpdate);
export const getGlobalPermissionsState = createSelector(getStates, (state: State) => state.globalPermissions);
export const getHolidayListState = createSelector(getStates, (state: State) => state.holidayList);
export const getHolidayCreateState = createSelector(getStates, (state: State) => state.holidayCreate);
export const getHolidayUpdateState = createSelector(getStates, (state: State) => state.holidayUpdate);
export const getLoanApplicationState = createSelector(getStates, (state: State) => state.loanApplication);
export const getLoanAppMakerCheckerDisburseState = createSelector(getStates, (state: State) => state.loanAppMakerCheckerDisburse);
export const getLoanAppAttachmentsState = createSelector(getStates, (state: State) => state.loanAppAttachments);
export const getLoanAppAttachmentDeleteState = createSelector(getStates, (state: State) => state.loanAppAttachmentDelete);
export const getLoanAppCollateralsState = createSelector(getStates, (state: State) => state.loanAppCollaterals);
export const getLoanApplicationCommentsState = createSelector(getStates, (state: State) => state.loanApplicationComments);
export const getLoanAppCreateCollateralState = createSelector(getStates, (state: State) => state.loanAppCreateCollateral);
export const getLoanAppCollateralState = createSelector(getStates, (state: State) => state.loanAppCollateral);
export const getLoanAppCollateralDeleteState = createSelector(getStates, (state: State) => state.loanAppCollateralDelete);
export const getLoanAppUpdateCollateralState = createSelector(getStates, (state: State) => state.loanAppUpdateCollateral);
export const getLoanAppCCActivityListState = createSelector(getStates, (state: State) => state.loanAppCCActivityList);
export const getLoanApplicationCreateState = createSelector(getStates, (state: State) => state.loanApplicationCreate);
export const getLoanAppFormState = createSelector(getStates, (state: State) => state.loanAppForm);
export const getBorrowingState = createSelector(getStates, (state: State) => state.borrowing);
export const getBorrowingFormState = createSelector(getStates, (state: State) => state.borrowingForm);
export const getBorrowingCreateState = createSelector(getStates, (state: State) => state.borrowingCreate);
export const getBorrowingScheduleState = createSelector(getStates, (state: State) => state.borrowingSchedule);
export const getBorrowingListState = createSelector(getStates, (state: State) => state.borrowingList);
export const getBorrowingUpdateState = createSelector(getStates, (state: State) => state.borrowingUpdate);
export const getBorrowingEventsState = createSelector(getStates, (state: State) => state.borrowingEvents);
export const getLoanAppGuarantorsState = createSelector(getStates, (state: State) => state.loanAppGuarantors);
export const getLoanAppGuarantorState = createSelector(getStates, (state: State) => state.loanAppGuarantor);
export const getLoanAppGuarantorDeleteState = createSelector(getStates, (state: State) => state.loanAppGuarantorDelete);
export const getLoanAppCreateGuarantorState = createSelector(getStates, (state: State) => state.loanAppCreateGuarantor);
export const getLoanAppUpdateGuarantorState = createSelector(getStates, (state: State) => state.loanAppUpdateGuarantor);
export const getLoanApplicationListState = createSelector(getStates, (state: State) => state.loanApplicationList);
export const getLoanApplicationUpdateState = createSelector(getStates, (state: State) => state.loanApplicationUpdate);
export const getLoanPayeeUpdateState = createSelector(getStates, (state: State) => state.loanPayeeUpdate);
export const getLoanAppScheduleState = createSelector(getStates, (state: State) => state.loanAppSchedule);
export const getLoanAppFieldsState = createSelector(getStates, (state: State) => state.loanAppFields);
export const getRelationshipListState = createSelector(getStates, (state: State) => state.relationshipList);
export const getLoanProductState = createSelector(getStates, (state: State) => state.loanProduct);
export const getLoanProductMakerCheckerState = createSelector(getStates, (state: State) => state.loanProductMakerChecker);
export const getLoanProductsState = createSelector(getStates, (state: State) => state.loanProducts);
export const getLoanProductUpdateState = createSelector(getStates, (state: State) => state.loanProductUpdate);
export const getLoanProductCreateState = createSelector(getStates, (state: State) => state.loanProductCreate);
export const getLoanProductHistoryState = createSelector(getStates, (state: State) => state.loanProductHistory);
export const getLoanPurposeListState = createSelector(getStates, (state: State) => state.loanPurposeList);
export const getLoanPurposeCreateState = createSelector(getStates, (state: State) => state.loanPurposeCreate);
export const getLoanPurposeUpdateState = createSelector(getStates, (state: State) => state.loanPurposeUpdate);
export const getLoanAttachmentDeleteState = createSelector(getStates, (state: State) => state.loanAttachmentDelete);
export const getLoanAttachmentListState = createSelector(getStates, (state: State) => state.loanAttachmentList);
export const getLoanListState = createSelector(getStates, (state: State) => state.loanList);
export const getLoanInfoState = createSelector(getStates, (state: State) => state.loanInfo);
export const getLoanPayeeState = createSelector(getStates, (state: State) => state.loanPayee);
export const getLoanEventsState = createSelector(getStates, (state: State) => state.loanEvents);
export const getLoanMakerCheckerRollbackState = createSelector(getStates, (state: State) => state.loanMakerCheckerRollback);
export const getLoanPayeeEventsState = createSelector(getStates, (state: State) => state.loanPayeeEvents);
export const getLoanScheduleState = createSelector(getStates, (state: State) => state.loanSchedule);
export const getLoanMakerCheckerRepaymentState = createSelector(getStates, (state: State) => state.loanMakerCheckerRepayment);
export const getLocationCreate = createSelector(getStates, (state: State) => state.locationCreate);
export const getLocationList = createSelector(getStates, (state: State) => state.locationList);
export const getLocationUpdate = createSelector(getStates, (state: State) => state.locationUpdate);
export const getOtherFees = createSelector(getStates, (state: State) => state.otherFees);
export const getPayeeList = createSelector(getStates, (state: State) => state.payeeList);
export const getPayeeCreate = createSelector(getStates, (state: State) => state.payeeCreate);
export const getPayeeUpdate = createSelector(getStates, (state: State) => state.payeeUpdate);
export const getProfessionListState = createSelector(getStates, (state: State) => state.professionList);
export const getProfessionCreateState = createSelector(getStates, (state: State) => state.professionCreate);
export const getProfessionUpdateState = createSelector(getStates, (state: State) => state.professionUpdate);
export const getProfilesState = createSelector(getStates, (state: State) => state.profiles);
export const getProfileState = createSelector(getStates, (state: State) => state.profile);
export const getProfileMakerCheckerState = createSelector(getStates, (state: State) => state.profileMakerChecker);
export const getProfileFieldsState = createSelector(getStates, (state: State) => state.profileFields);
export const getCreateProfileState = createSelector(getStates, (state: State) => state.createProfile);
export const getUpdateProfileState = createSelector(getStates, (state: State) => state.updateProfile);
export const getProfileChangesState = createSelector(getStates, (state: State) => state.profileChanges);
export const getProfileAttachmentsState = createSelector(getStates, (state: State) => state.profileAttachments);
export const getProfileAttachmentDeleteState = createSelector(getStates, (state: State) => state.profileAttachmentDelete);
export const getProfileEventListState = createSelector(getStates, (state: State) => state.profileEventList);
export const getProfileCurrentAccountList = createSelector(getStates, (state: State) => state.profileCurrentAccountList);
export const getRolesState = createSelector(getStates, (state: State) => state.roles);
export const getRoleUpdateState = createSelector(getStates, (state: State) => state.roleUpdate);
export const getRoleCreateState = createSelector(getStates, (state: State) => state.roleCreate);
export const getRoleInfoState = createSelector(getStates, (state: State) => state.roleInfo);
export const getRoleMakerCheckerState = createSelector(getStates, (state: State) => state.roleMakerChecker);
export const getSavingProductState = createSelector(getStates, (state: State) => state.savingProduct);
export const getSavingProductMakerCheckerState = createSelector(getStates, (state: State) => state.savingProductMakerChecker);
export const getSavingProductsState = createSelector(getStates, (state: State) => state.savingProducts);
export const getSavingProductUpdateState = createSelector(getStates, (state: State) => state.savingProductUpdate);
export const getSavingProductCreateState = createSelector(getStates, (state: State) => state.savingProductCreate);
export const getTellerListState = createSelector(getStates, (state: State) => state.tellerList);
export const getOperationCreateState = createSelector(getStates, (state: State) => state.operationCreate);
export const getOperationListState = createSelector(getStates, (state: State) => state.operationList);
export const getTillCreateState = createSelector(getStates, (state: State) => state.tillCreate);
export const getTillListState = createSelector(getStates, (state: State) => state.tillList);
export const getTillUpdateState = createSelector(getStates, (state: State) => state.tillUpdate);
export const getTillInfoState = createSelector(getStates, (state: State) => state.tillInfo);
export const getCurrentUserState = createSelector(getStates, (state: State) => state.currentUser);
export const getUsersState = createSelector(getStates, (state: State) => state.users);
export const getUserState = createSelector(getStates, (state: State) => state.user);
export const getUserMakerCheckerState = createSelector(getStates, (state: State) => state.userMakerChecker);
export const getUserUpdateState = createSelector(getStates, (state: State) => state.userUpdate);
export const getUserCreateState = createSelector(getStates, (state: State) => state.userCreate);
export const getVaultListState = createSelector(getStates, (state: State) => state.vaultList);
export const getVaultCreateState = createSelector(getStates, (state: State) => state.vaultCreate);
export const getVaultUpdateState = createSelector(getStates, (state: State) => state.vaultUpdate);
export const getVaultInfoState = createSelector(getStates, (state: State) => state.vaultInfo);
export const getCurrentAccountTransactionsState = createSelector(getStates, (state: State) => state.currentAccountTransactions);
export const getChartOfAccountCreateState = createSelector(getStates, (state: State) => state.chartOfAccountCreate);
export const getChartOfAccountUpdateState = createSelector(getStates, (state: State) => state.chartOfAccountUpdate);
export const getBorrowingProductCreateState = createSelector(getStates, (state: State) => state.borrowingProductCreate);
export const getBorrowingProductInfoState = createSelector(getStates, (state: State) => state.borrowingProductInfo);
export const getBorrowingProductListState = createSelector(getStates, (state: State) => state.borrowingProductList);
export const getBorrowingProductUpdateState = createSelector(getStates, (state: State) => state.borrowingProductUpdate);
export const getOtherFeeListState = createSelector(getStates, (state: State) => state.otherFeeList);
export const getOtherFeeCreateState = createSelector(getStates, (state: State) => state.otherFeeCreate);
export const getOtherFeeUpdateState = createSelector(getStates, (state: State) => state.otherFeeUpdate);
export const getSavingState = createSelector(getStates, (state: State) => state.saving);
export const getSavingCreateState = createSelector(getStates, (state: State) => state.savingCreate);
export const getSavingListState = createSelector(getStates, (state: State) => state.savingList);
export const getSavingProfileListState = createSelector(getStates, (state: State) => state.savingProfileList);
export const getSavingUpdateState = createSelector(getStates, (state: State) => state.savingUpdate);
export const getSavingEntriesState = createSelector(getStates, (state: State) => state.savingEntries);
export const getTermDepositProductCreateState = createSelector(getStates, (state: State) => state.termDepositProductCreate);
export const getTermDepositProductInfoState = createSelector(getStates, (state: State) => state.termDepositProductInfo);
export const getTermDepositProductListState = createSelector(getStates, (state: State) => state.termDepositProductList);
export const getTermDepositProductUpdateState = createSelector(getStates, (state: State) => state.termDepositProductUpdate);
export const getTermDepositProductMakerCheckerState = createSelector(getStates, (state: State) => state.termDepositProductMakerChecker);
export const getTermDepositState = createSelector(getStates, (state: State) => state.termDeposit);
export const getTermDepositCreateState = createSelector(getStates, (state: State) => state.termDepositCreate);
export const getTermDepositListState = createSelector(getStates, (state: State) => state.termDepositList);
export const getTermDepositProfileListState = createSelector(getStates, (state: State) => state.termDepositProfileList);
export const getTermDepositUpdateState = createSelector(getStates, (state: State) => state.termDepositUpdate);
export const getTermDepositEntriesState = createSelector(getStates, (state: State) => state.termDepositEntries);
export const getTermDepositAccountTransactionsState = createSelector(getStates, (state: State) => state.termDepositAccountTransactions);
export const getDayClosureState = createSelector(getStates, (state: State) => state.dayClosure);
export const getExchangeRateState = createSelector(getStates, (state: State) => state.exchangeRate);
export const getBondState = createSelector(getStates, (state: State) => state.bond);
export const getBondCreateState = createSelector(getStates, (state: State) => state.bondCreate);
export const getBondListState = createSelector(getStates, (state: State) => state.bondList);
export const getBondUpdateState = createSelector(getStates, (state: State) => state.bondUpdate);
export const getBondScheduleState = createSelector(getStates, (state: State) => state.bondSchedule);
export const getBondFormState = createSelector(getStates, (state: State) => state.bondForm);
export const getBondEventsState = createSelector(getStates, (state: State) => state.bondEvents);
export const getMakerCheckerListState = createSelector(getStates, (state: State) => state.makerCheckerList);
export const getSystemSettingState = createSelector(getStates, (state: State) => state.systemSetting);
export const getUpdateSystemSettingState = createSelector(getStates, (state: State) => state.updateSystemSetting);
export const getPenaltyCreateState = createSelector(getStates, (state: State) => state.penaltyCreate);
export const getPenaltiesState = createSelector(getStates, (state: State) => state.penalties);
export const getPenaltyUpdateState = createSelector(getStates, (state: State) => state.penaltyUpdate);
export const getTransactionTemplatesCreateState = createSelector(getStates, (state: State) => state.createTransactionTemplates);
export const getTransactionTemplatesInfoState = createSelector(getStates, (state: State) => state.transactionTemplatesInfo);
export const getTransactionTemplatesListState = createSelector(getStates, (state: State) => state.transactionTemplatesList);
export const getTransactionTemplatesUpdateState = createSelector(getStates, (state: State) => state.updateTransactionTemplates);
export const getPaymentMethodCreateState = createSelector(getStates, (state: State) => state.paymentMethodCreate);
export const getPaymentMethodListState = createSelector(getStates, (state: State) => state.paymentMethodList);
export const getPaymentMethodUpdateState = createSelector(getStates, (state: State) => state.paymentMethodUpdate);
export const getIntegrationWithBankExportState = createSelector(getStates, (state: State) => state.integrationWithBankExport);
export const getIntegrationWithBankExportFileListState =
  createSelector(getStates, (state: State) => state.integrationWithBankExportFileList);
export const getIntegrationWithBankImportFileListState =
  createSelector(getStates, (state: State) => state.integrationWithBankImportFileList);
export const getPaymentGatewayState = createSelector(getStates, (state: State) => state.paymentGateway);
export const getCreditLineState = createSelector(getStates, (state: State) => state.creditLine);
export const getCreditLineCreateState = createSelector(getStates, (state: State) => state.creditLineCreate);
export const getCreditLineUpdateState = createSelector(getStates, (state: State) => state.creditLineUpdate);

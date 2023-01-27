update permissions set module_type = 'LOANS' where module_type = 'ASSET_LOANS';
update permissions set module_type = 'GENERAL_LEDGER', name = 'GENERAL_LEDGER' where module_type = 'ACCOUNTING_ENTRIES';
update permissions set module_type = 'TRIAL_BALANCES', name = 'TRIAL_BALANCES' where module_type = 'ACCOUNTING_BALANCE';

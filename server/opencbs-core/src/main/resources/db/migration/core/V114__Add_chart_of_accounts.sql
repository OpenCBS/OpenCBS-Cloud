begin;

delete from accounting_entries;
alter sequence accounting_entries_id_seq restart;

delete from profiles_accounts;
delete from tills_accounts;
delete from vaults_accounts;

delete from accounts;
alter sequence accounts_id_seq restart;

update
	global_settings
set value = '3010'
where
	name = 'DEFAULT_CURRENT_ACCOUNT_GROUP';

insert into accounts (id, number, "name", is_debit, parent_id, start_date, close_date, "type", lft, rgt, currency_id)
values
(1,  '1000', 'Asset'						  , true, null,  '2017-01-01', null, 1, 0, 0, null),
(2,  '1011', 'Cash or other payment channels' , true, 1, 	 '2017-01-01', null, 2, 0, 0, null),
(3,  '1012', 'Till Rivendell/101'         	  , true, 2, 	 '2017-01-01', null, 4, 0, 0, 1),
(4,  '1013', 'Till Frunze/11'         		  , true, 2, 	 '2017-01-01', null, 4, 0, 0, 1),
(5,  '1014', 'Till Hobbitton/42'         	  , true, 2, 	 '2017-01-01', null, 4, 0, 0, 1),
(6,  '1015', 'Till Minas Tirith/42'           , true, 2,  	 '2017-01-01', null, 4, 0, 0, 1),
(7,  '1016', 'Vault Rivendell/101'         	  , true, 2, 	 '2017-01-01', null, 4, 0, 0, 1),
(8,  '1017', 'Vault Frunze/11'         		  , true, 2, 	 '2017-01-01', null, 4, 0, 0, 1),
(9,  '1018', 'Vault Hobbitton/42'         	  , true, 2, 	 '2017-01-01', null, 4, 0, 0, 1),
(10, '1019', 'Vault Minas Tirith/42'          , true, 2, 	 '2017-01-01', null, 4, 0, 0, 1),

(11, '2030', 'Loans'						   , true, 1,  '2017-01-01', null, 2, 0, 0, null),
(12, '2031', 'Loans to clients' 			   , true, 11, '2017-01-01', null, 4, 0, 0, 1),
(13, '2032', 'Rescheduled loans'               , true, 11, '2017-01-01', null, 4, 0, 0, 1),
(14, '2033', 'Past due loans'                  , true, 11, '2017-01-01', null, 4, 0, 0, 1),
(15, '2034', 'Unrecoverable loans'             , true, 11, '2017-01-01', null, 4, 0, 0, 1),
(16, '2035', 'Loan loss provision'             , true, 11, '2017-01-01', null, 4, 0, 0, 1),
(17, '2050', 'Interests and Penalties'         , true, 1,  '2017-01-01', null, 2, 0, 0, null),
(18, '2051', 'Interests accrued not due'       , true, 17, '2017-01-01', null, 4, 0, 0, 1),
(19, '2052', 'Interests receivable'            , true, 17, '2017-01-01', null, 4, 0, 0, 1),
(20, '2053', 'Accrued penalties'			   , true, 17, '2017-01-01', null, 4, 0, 0, 1),

(21, '3000', 'Liability'			, false, null, '2017-01-01', null, 1, 0, 0, null),
(22, '3010', 'Current accounts'		, false, 21,   '2017-01-01', null, 2, 0, 0, null),
(23, '3011', 'Current Accounts USD'	, false, 22,   '2017-01-01', null, 4, 0, 0, 1),

(24, '6000', 'Expense'	                   , false, null, '2017-01-01', null, 1, 0, 0, null),
(25, '6710', 'Loans expenses' 			   , false, 24,   '2017-01-01', null, 2, 0, 0, 1),
(26, '6712', 'Provision on past due loans' , false, 24,	  '2017-01-01', null, 4, 0, 0, 1),
(27, '6713', 'Loan Loss'                   , false, 24,   '2017-01-01', null, 4, 0, 0, 1),

(28, '7000', 'Income'					          , false, null, '2017-01-01', null, 1, 0, 0, null),
(29, '7021', 'Interests on Loans' 				  , false, 28, '2017-01-01', null, 4, 0, 0, 1),
(30, '7027', 'Penalties on past due loans'        , false, 28, '2017-01-01', null, 4, 0, 0, 1),
(31, '7028', 'Interests on past due loans'        , false, 28, '2017-01-01', null, 4, 0, 0, 1),
(32, '7029', 'Commissions'                        , false, 28, '2017-01-01', null, 4, 0, 0, 1),
(33, '7712', 'Provision reversal'                 , false, 28, '2017-01-01', null, 4, 0, 0, 1),
(34, '7999', 'Miscellaneous income'               , false, 28, '2017-01-01', null, 4, 0, 0, 1);
select setval('accounts_id_seq', (select max(id) from accounts));
end;
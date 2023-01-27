package com.opencbs.core.accounting.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountAdditionalInformation;
import com.opencbs.core.accounting.domain.AccountEntityType;
import com.opencbs.core.accounting.domain.AccountExtendedTag;
import com.opencbs.core.accounting.domain.AccountTagType;
import com.opencbs.core.accounting.dto.AccountCreateDto;
import com.opencbs.core.accounting.repositories.AccountAdditionalInformationRepository;
import com.opencbs.core.accounting.repositories.AccountEntityTypeRepository;
import com.opencbs.core.accounting.repositories.AccountRepository;
import com.opencbs.core.accounting.repositories.AccountingEntryRepository;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.dto.requests.AccountRequest;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.services.BranchService;
import com.opencbs.core.services.CrudService;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.audit.BaseHistoryService;
import com.opencbs.core.services.audit.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class AccountService extends BaseHistoryService<AccountRepository> implements CrudService<Account>, HistoryService {

    private final AccountRepository accountRepository;
    private final CurrencyService currencyService;
    private final AccountingEntryRepository accountingEntryRepository;
    private final BranchService branchService;
    private final AccountEntityTypeRepository accountEntityTypeRepository;
    private final AccountAdditionalInformationRepository accountAdditionalInformationRepository;
    private final AccountTagService accountTagService;

    private final String PAYEE_ACCOUNT = "Off Balance Target Account";

    @Autowired
    public AccountService(AccountRepository accountRepository,
                          CurrencyService currencyService,
                          AccountingEntryRepository accountingEntryRepository,
                          BranchService branchService,
                          AccountEntityTypeRepository accountEntityTypeRepository,
                          AccountAdditionalInformationRepository accountAdditionalInformationRepository,
                          AccountTagService accountTagService) {
        super(accountRepository);
        this.accountRepository = accountRepository;
        this.currencyService = currencyService;
        this.accountingEntryRepository = accountingEntryRepository;
        this.branchService = branchService;
        this.accountEntityTypeRepository = accountEntityTypeRepository;
        this.accountAdditionalInformationRepository = accountAdditionalInformationRepository;
        this.accountTagService = accountTagService;
    }

    public Optional<Account> getOne(Long id) {
        return Optional.ofNullable(this.accountRepository.findOne(id));
    }

    public AccountType getAccountTypeByAccountId(Long accountId) {
        return this.accountRepository.getAccountTypeByAccountId(accountId);
    }

    public Set<Account> findByIds(Set<Long> ids) {
        return new HashSet<>(this.accountRepository.findAll(ids));
    }

    public BigDecimal getAccountBalance(long accountId, LocalDateTime dateTime) {
        AccountEntityType account = accountEntityTypeRepository.findOne(accountId);
        if (account == null || account.getType() != AccountType.BALANCE) {
            throw new RuntimeException("Account doesn't exist or Account type is not balance");
        }

        return accountRepository.getAccountBalance(accountId, dateTime);
    }

    @Transactional
    public Account create(Account account) {
        account.setStartDate(DateHelper.getLocalDateTimeNow());
        return this.accountRepository.save(account);
    }

    @Transactional
    public Account update(Account account) {
        return this.accountRepository.save(account);
    }

    @Transactional
    public List<Account> create(List<Account> accounts) {
        return this.accountRepository.save(accounts);
    }

    public Optional<Account> findByNumber(String number) {
        return this.accountRepository.findByNumber(number);
    }

    public Optional<Account> findByNumberAndCurrencyIdAndBranchId(String number, Currency currency, Long branchId) {
        return this.accountRepository.findByNumberAndCurrencyAndBranchId(number, currency, branchId);
    }

    public List<Account> findRootAccounts() {
        return this.accountRepository.findRootAccounts()
                .stream()
                .sorted(Comparator.comparing(Account::getNumber))
                .collect(Collectors.toList());
    }

    public Page<Account> findLeavesByParent(Pageable pageable, Account account) {
        Long total = accountRepository.countByParent(account);
        List<Account> accountList = this.accountRepository.findLeavesByParent(pageable, account)
                .stream()
                .sorted(Comparator.comparing(Account::getNumber))
                .collect(Collectors.toList());
        return new PageImpl<>(
                accountList,
                pageable,
                total
        );
    }

    public Page<Account> findLeavesByParentAndBranch(Pageable pageable, Account account, Long branchId) {
        Long total = accountRepository.countByParent(account);
        Branch branch = this.branchService.findOne(branchId).get();
        List<Account> accountList = this.accountRepository.findLeavesByParentAndBranch(pageable, account, branch)
                .stream()
                .sorted(Comparator.comparing(Account::getNumber))
                .collect(Collectors.toList());
        return new PageImpl<>(
                accountList,
                pageable,
                total
        );
    }

    public List<Long> findAllAccountByParentId(Long parentId) {
        return this.accountRepository.findAllAccountIdByParentId(parentId);
    }

    public Page<Account> searchCurrentAccounts(String search, Pageable pageable) {
        List<Account> accounts = new ArrayList<>();

        if (search != null) {
            return this.accountRepository.searchCurrentAccounts(AccountTagType.CURRENT_ACCOUNT.getId(), search, AccountType.BALANCE, pageable);
        }

        List<AccountExtendedTag> accountExtendedTagList =
                this.accountTagService.getAllByAccountTagIdAndType(AccountTagType.CURRENT_ACCOUNT.getId(), AccountType.BALANCE);

        for (AccountExtendedTag accountExtendedTag : accountExtendedTagList) {
            accounts.add(accountExtendedTag.getAccount());
        }

        return new PageImpl<>(accounts);
    }

    public Page<Account> search(AccountRequest request, Pageable pageable) throws ResourceNotFoundException {
        List<AccountType> accountTypes = request.getAccountTypes() != null
                ? request.getAccountTypes()
                : Arrays.asList(AccountType.BALANCE);

        return this.accountRepository.search(request.getCurrencyId(), request.getSearch(), accountTypes, request.getTypeOfAccount(), pageable);

//        if (request.getSearch() != null & request.getCurrencyId() == null) {
//            return this.accountRepository.search(0L, request.getSearch(), accountTypes, request.getTypeOfAccount(), pageable);
//        }
//        if (request.getCurrencyId() != null & request.getSearch() == null) {
//            Currency currency = currencyService
//                    .findOne(request.getCurrencyId()).orElseThrow(()
//                            -> new ResourceNotFoundException(String.format("Currency is not found (ID=%d).", request.getCurrencyId())));
//            return this.findAccountsByCurrency(accountTypes, currency, request.getTypeOfAccount(), pageable);
//        }
//        if (request.getCurrencyId() == null & request.getSearch() == null) {
//            return this.findByAccountTypes(accountTypes, pageable);
//        }
    }

    private Page<Account> findAccountsByCurrency(List<AccountType> accountTypeList, Currency currency, AccountRequest.TypeOfAccount typeOfAccount, Pageable pageable) {
        if (typeOfAccount == null) {
            return this.accountRepository.findAllByTypeInAndCurrency(pageable, accountTypeList, currency);
        }

        return this.accountRepository.findAllByTypeInAndCurrencyAndIsDebit(pageable, accountTypeList, currency, (AccountRequest.TypeOfAccount.DEBIT.equals(typeOfAccount)));
    }

    private Page<Account> findByAccountTypes(List<AccountType> accountTypeList, Pageable pageable) {
        return this.accountRepository.findAllByTypeIn(pageable, accountTypeList);
    }

    public void validateOnUpdate(Long accountId) throws RuntimeException {
        Account account = this.getOne(accountId).get();
        Boolean hasAccountingEntry = this.hasTransactions(account.getId());
        if (hasAccountingEntry.equals(true)) {
            throw new RuntimeException("This account has accounting entries, you can't update it.");
        }
    }

    public Boolean hasTransactions(Long accountId) {
        return this.accountingEntryRepository.hasTransactions(accountId);
    }

    public Account mapToEntity(AccountCreateDto dto) {
        AccountType accountType = AccountType.CATEGORY;
        Account account = new Account();
        account.setValidateOff(false);
        if (dto.getParentAccountId() != null) {
            Account parentAccount = this.getOne(dto.getParentAccountId()).get();
            if (parentAccount.getType().equals(AccountType.BALANCE)) {
                throw new AccessDeniedException("You can't create a child for balance accounts.");
            }
            AccountType parentAccountType = parentAccount.getType();
            accountType = AccountType.getById(parentAccountType.getId() + 1);
            account.setParent(this.getOne(dto.getParentAccountId()).get());
            account.setValidateOff(parentAccount.getValidateOff());
            if (accountType.equals(AccountType.BALANCE)) {
                account.setCurrency(this.currencyService.findOne(dto.getCurrencyId()).get());
            }
        }
        account.setType(accountType);
        account.setBranch(this.branchService.findOne(dto.getBranchId()).get());
        account.setIsDebit(dto.getIsDebit());
        account.setNumber(dto.getParentNumber() + dto.getChildNumber());
        account.setName(dto.getName());
        this.setPermissionFields(accountType, account, dto);
        return account;
    }

    private void setPermissionFields(AccountType accountType, Account account, AccountCreateDto dto) {
        if (accountType == AccountType.SUBGROUP) {
            account.setLocked(false);
            account.setAllowedTransferFrom(true);
            account.setAllowedTransferTo(true);
            account.setAllowedCashDeposit(true);
            account.setAllowedCashWithdrawal(true);
            account.setAllowedManualTransaction(true);
            return;
        }
        if (accountType == AccountType.BALANCE) {
            account.setLocked(dto.getLocked());
            account.setAllowedTransferFrom(dto.getAllowedTransferFrom());
            account.setAllowedTransferTo(dto.getAllowedTransferTo());
            account.setAllowedCashDeposit(dto.getAllowedCashDeposit());
            account.setAllowedCashWithdrawal(dto.getAllowedCashWithdrawal());
            account.setAllowedManualTransaction(dto.getAllowedManualTransaction());
            return;
        }

        account.setLocked(dto.getLocked() == null ? true : dto.getLocked());
        account.setAllowedTransferFrom(dto.getAllowedTransferFrom() == null ? false : dto.getAllowedTransferFrom());
        account.setAllowedTransferTo(dto.getAllowedTransferTo() == null ? false : dto.getAllowedTransferTo());
        account.setAllowedCashDeposit(dto.getAllowedCashDeposit() == null ? false : dto.getAllowedCashDeposit());
        account.setAllowedCashWithdrawal(dto.getAllowedCashWithdrawal() == null ? false : dto.getAllowedCashWithdrawal());
        account.setAllowedManualTransaction(dto.getAllowedManualTransaction() == null ? false : dto.getAllowedManualTransaction());
    }

    public Account getBalanceAccount(Account parentAccount, Account account, Long id,
                                     String accountName, String profileName, String code) {

        return this.getBalanceAccount(parentAccount, account, new AccountCreatorInterface() {
            @Override
            public String getName() {
                return String.format("%s account for %s '%s'", accountName, profileName, code);
            }

            @Override
            public String getNumber() {
                return String.format("%s%s", parentAccount.getNumber(), String.format("%06d", id));
            }
        });
    }

    public Account getBalanceAccount(Account parentAccount, Account account, AccountCreatorInterface accountCreatorInterface) {
        if (parentAccount.getCloseDate() != null && parentAccount.getCloseDate().isBefore(DateHelper.getLocalDateTimeNow()))
            throw new RuntimeException(String.format("Account %s is closed", parentAccount.getNumber()));

        account.setParent(parentAccount);
        account.setId(null);
        account.setName(accountCreatorInterface.getName());
        account.setType(AccountType.BALANCE);
        account.setStartDate(DateHelper.getLocalDateTimeNow());
        account.setNumber(accountCreatorInterface.getNumber());
        account.setLocked(false);
        account.setAllowedTransferFrom(true);
        account.setAllowedTransferTo(true);
        account.setAllowedCashDeposit(false);
        account.setAllowedCashWithdrawal(false);
        account.setAllowedManualTransaction(false);
        return this.create(account);

    }

    @Override
    public Boolean isRequestSupported(RequestType requestType) {
        return RequestType.ACCOUNT_EDIT.equals(requestType) || RequestType.ACCOUNT_CREATE.equals(requestType);
    }

    @Override
    public List<Account> findAll() {
        return this.accountRepository.findAll();
    }

    public Optional<Account> findOne(Long id) {
        return this.getOne(id);
    }

    @Override
    public Class getTargetClass() {
        return Account.class;
    }

    public Map<Long, Long> findParentAccounts(List<Long> accountIds) {
        List<AccountAdditionalInformation> information = this.accountAdditionalInformationRepository.getAllByIdIn(accountIds);
        return information.stream()
                .collect(HashMap::new, (m, v) -> m.put(v.getId(), v.getParentId()), HashMap::putAll);
    }

    public List<Long> getAllChildIds(Long parentId) {
        return this.accountRepository.findAllAccountIdByParentId(parentId);
    }

    public Page<Account> getPayeeAccount(Pageable pageable) {
        return accountRepository.search(0L, PAYEE_ACCOUNT, Collections.singletonList(AccountType.BALANCE), null, pageable);
    }

    public Page<Account> searchAccountsByTags(List<AccountTagType> tags, Pageable pageable) {
        return this.accountTagService.getAccountsByTags(tags, pageable);
    }
}
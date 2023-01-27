package com.opencbs.core.accounting.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.domain.AccountingEntryTill;
import com.opencbs.core.accounting.dto.AccountBalanceDto;
import com.opencbs.core.accounting.dto.AccountDto;
import com.opencbs.core.accounting.repositories.TillRepository;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.TillEventType;
import com.opencbs.core.domain.enums.TillOperation;
import com.opencbs.core.domain.enums.TillStatus;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.domain.till.Operation;
import com.opencbs.core.domain.till.Till;
import com.opencbs.core.domain.till.TillEvent;
import com.opencbs.core.domain.till.Vault;
import com.opencbs.core.dto.OperationBaseDto;
import com.opencbs.core.dto.OperationDetailsDto;
import com.opencbs.core.dto.OperationDto;
import com.opencbs.core.dto.TransferDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.EnglishNumberToWordsHelper;
import com.opencbs.core.officedocuments.services.PrintingFormService;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.ProfileAccountService;
import com.opencbs.core.services.ProfileService;
import com.opencbs.core.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TillService {

    private final TillRepository tillRepository;
    private final UserService userService;
    private final TillEventService tillEventService;
    private final AccountingEntryService accountingEntryService;
    private final VaultService vaultService;
    private final AccountService accountService;
    private final CurrencyService currencyService;
    private final AccountingEntryTillService accountingEntryTillService;
    private final PrintingFormService printingFormService;
    private final ProfileService profileService;
    private final ProfileAccountService profileAccountService;

    private static final  String  REFERENCE_NUMBER = "REFERENCE_NUMBER";

    @Autowired
    public TillService(TillRepository tillRepository,
                       UserService userService,
                       TillEventService tillEventService,
                       AccountingEntryService accountingEntryService,
                       VaultService vaultService,
                       AccountService accountService,
                       CurrencyService currencyService,
                       AccountingEntryTillService accountingEntryTillService,
                       PrintingFormService printingFormService,
                       ProfileService profileService,
                       ProfileAccountService profileAccountService) {
        this.tillRepository = tillRepository;
        this.userService = userService;
        this.tillEventService = tillEventService;
        this.accountingEntryService = accountingEntryService;
        this.vaultService = vaultService;
        this.accountService = accountService;
        this.currencyService = currencyService;
        this.accountingEntryTillService = accountingEntryTillService;
        this.printingFormService = printingFormService;
        this.profileService = profileService;
        this.profileAccountService = profileAccountService;
    }

    public Page<Till> lookup(Pageable pageable, String searchString) {
        if (StringUtils.isEmpty(searchString)) {
            return this.tillRepository.findAll(pageable);
        }
        return this.tillRepository.findBySearchPattern(pageable, searchString.trim());
    }

    public Page<Till> findAll(Pageable pageable, String searchString) {
        if (StringUtils.isEmpty(searchString)) {
            return this.tillRepository.findAll(pageable);
        }
        return this.tillRepository.search(pageable, searchString);
    }

    public List<Till> findAll() {
        return this.tillRepository.findAll();
    }

    public Optional<Till> findOne(Long id) {
        return Optional.ofNullable(this.tillRepository.findOne(id));
    }

    public Optional<Till> findByName(String name) {
        return this.tillRepository.findByName(name);
    }

    @Transactional
    public Till create(Till till) {
        till.setId(null);
        till.setStatus(TillStatus.CLOSED);
        return this.tillRepository.save(till);
    }

    @Transactional
    public Till update(Till till) {
        return this.tillRepository.save(till);
    }

    @Transactional
    public void open(Till till, long tellerId, User currentUser) throws ResourceNotFoundException {
        till.setStatus(TillStatus.OPENED);
        till.setLastChangedBy(currentUser);
        till.setClosedAt(null);
        till.setOpenedAt(DateHelper.getLocalDateTimeNow());
        this.update(till);

        User teller = this.getTeller(tellerId);

        TillEvent tillEvent = new TillEvent();
        tillEvent.setEventType(TillEventType.OPEN);
        tillEvent.setTill(till);
        tillEvent.setTeller(teller);
        tillEvent.setCreatedBy(currentUser);
        tillEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        this.tillEventService.create(tillEvent);
    }

    @Transactional
    public void close(Till till, long tellerId, User currentUser) throws ResourceNotFoundException {
        till.setStatus(TillStatus.CLOSED);
        till.setLastChangedBy(currentUser);
        till.setClosedAt(DateHelper.getLocalDateTimeNow());
        this.update(till);

        User teller = this.getTeller(tellerId);

        TillEvent tillEvent = new TillEvent();
        tillEvent.setEventType(TillEventType.CLOSE);
        tillEvent.setTill(till);
        tillEvent.setTeller(teller);
        tillEvent.setCreatedBy(currentUser);
        tillEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        this.tillEventService.create(tillEvent);
    }

    @Transactional
    public void transferToVault(TransferDto transferDto, User currentUser) {
        this.transfer(transferDto, currentUser, TillOperation.TRANSFER_TO_VAULT);
    }

    @Transactional
    public void transferFromVault(TransferDto transferDto, User currentUser) {
        this.transfer(transferDto, currentUser, TillOperation.TRANSFER_FROM_VAULT);
    }

    public Optional<Account> findAccount(long currencyId, Set<Account> accounts) {
        return accounts
                .stream()
                .filter(t -> t.getCurrency() != null && t.getCurrency().getId().equals(currencyId))
                .findFirst();
    }

    public List<AccountBalanceDto> getBalance(Till till, LocalDateTime dateTime) {
        return till.getAccounts()
                .stream()
                .map(x -> {
                    AccountBalanceDto accountBalanceDto = new AccountBalanceDto();
                    accountBalanceDto.setAccount(new ModelMapper().map(x, AccountDto.class));
                    accountBalanceDto.setBalance(this.accountService.getAccountBalance(x.getId(), dateTime));
                    return accountBalanceDto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Long withdraw(Till till, OperationBaseDto dto, User currentUser) {
        AccountingEntry accountingEntry = this.createWithdrawAccountingEntry(till, dto, currentUser);
        AccountingEntry accountingEntryWithReference = this.generateReferenceNumber(till, accountingEntry);

        Profile existingwithdrawer = null;
        String newWithdrawer = null;

        if (!dto.getIsProfileExist()) {
            newWithdrawer = dto.getInitiator();
        }
        else {
            Optional<Profile> profile = this.profileService.findOne(dto.getInitiatorId());
            if (profile.isPresent()) {
                existingwithdrawer = profile.get();
            }
        }

        AccountingEntryTill accountEntryTills = this.accountingEntryTillService.createAccountingEntryTills(
                accountingEntryWithReference,
                TillOperation.WITHDRAW,
                existingwithdrawer,
                till,
                null,
                newWithdrawer);
        this.accountingEntryTillService.create(accountEntryTills);
        return accountingEntryWithReference.getId();
    }

    @Transactional
    public Long deposit(Till till, OperationBaseDto dto, User currentUser) {
        AccountingEntry accountingEntry = this.createDepositAccountingEntry(till, dto, currentUser);
        AccountingEntry accountingEntryWithReference = this.generateReferenceNumber(till, accountingEntry);

        Profile existingDepositor = null;
        String newDepositor = null;

        if (!dto.getIsProfileExist()) {
            newDepositor = dto.getInitiator();
        }
        else {
            Optional<Profile> profile = this.profileService.findOne(dto.getInitiatorId());
            if (profile.isPresent()) {
                existingDepositor = profile.get();
            }
        }

        AccountingEntryTill accountEntryTills = this.accountingEntryTillService.createAccountingEntryTills(
                accountingEntryWithReference,
                TillOperation.DEPOSIT,
                existingDepositor,
                till,
                null,
                newDepositor);
        this.accountingEntryTillService.create(accountEntryTills);
        return accountingEntryWithReference.getId();
    }

    private AccountingEntry generateReferenceNumber(Till till, AccountingEntry accountingEntry) {
        String number;
        LocalDate currentDate = DateHelper.getLocalDateNow();
        List<AccountingEntryTill> accountingEntryTills = this.accountingEntryTillService.getByTillAndDate(till, currentDate.atTime(LocalTime.MIN), currentDate.atTime(LocalTime.MAX));

        number = String.format("%1$s-%2$s-", till.getId(), currentDate.getYear()) + String.format("%02d-", currentDate.getMonth().getValue())
                + String.format("%1$s-", currentDate.getDayOfMonth()) + String.format("%04d", accountingEntryTills.size() + 1);

        ExtraJson extra = new ExtraJson();
        extra.put(REFERENCE_NUMBER, number);
        accountingEntry.setExtra(extra);
        return accountingEntry;
    }

    private AccountingEntry createDepositAccountingEntry(Till till, OperationBaseDto dto, User user) {
        Account creditAccount = this.findAccount(dto.getId());
        Account debitAccount = this.getTillAccount(till, creditAccount.getCurrency());
        AccountingEntry accountingEntry = this.createAccountingEntry(debitAccount, creditAccount, dto, user, till.getBranch(), null);
        return accountingEntry;
    }

    private AccountingEntry createWithdrawAccountingEntry(Till till, OperationBaseDto dto, User user) {
        Account creditAccount = this.findAccount(dto.getId());
        Account debitAccount = this.getTillAccount(till, creditAccount.getCurrency());
        AccountingEntry accountingEntry = this.createAccountingEntry(creditAccount, debitAccount, dto, user, till.getBranch(), null);
        return accountingEntry;
    }

    public Page<OperationDetailsDto> getOperations(Till till, Long currencyId, Pageable pageable) {
        ModelMapper modelMapper = new ModelMapper();
        LocalDateTime localDateTime = DateHelper.getLocalDateTimeNow();
        LocalDateTime fromDate = till.getStatus() == TillStatus.OPENED && till.getClosedAt() == null
                ? till.getOpenedAt()
                : localDateTime.toLocalDate().atStartOfDay();

        Page<Operation> operations = currencyId == null
                ? this.getOperations(till, pageable, fromDate, localDateTime)
                : this.getOperationsByCurrency(till, currencyId, pageable, fromDate, localDateTime);

        return operations
                .map(entry -> {
                    OperationDetailsDto dto = modelMapper.map(entry, OperationDetailsDto.class);
                    dto.setCreatedAt(entry.getEffectiveAt());
                    Account account = this.profileAccountService.getProfileAccount(entry.getProfileId(), entry.getCurrency().getId());
                    dto.setAccountName(account.getName());
                    dto.setAccountNumber(account.getNumber());
                    return dto;
                });
    }

    private Page<Operation> getOperationsByCurrency(Till till, Long currencyId, Pageable pageable,
                                                    LocalDateTime fromDate, LocalDateTime toDate) throws ResourceNotFoundException {
        Currency currency = this.currencyService.findOne(currencyId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Currency not found(ID=%d)", currencyId)));

        return this.tillRepository.getOperationsByCurrency(pageable, till, currency, fromDate, toDate);
    }

    private Page<Operation> getOperations(Till till, Pageable pageable,
                                          LocalDateTime fromDate, LocalDateTime toDate) throws ResourceNotFoundException {
        return this.tillRepository.getOperations(pageable, till, fromDate, toDate);
    }

    private void transfer(TransferDto transferDto, User currentUser, TillOperation tillOperation) {
        Till till = this.findOne(transferDto.getTillId()).get();
        Vault vault = this.vaultService.findById(transferDto.getVaultId()).get();
        List<AccountingEntry> accountingEntries = transferDto.getTransactions()
                .stream()
                .filter(x -> x.getAmount().doubleValue() > 0)
                .map(x -> {
                    Account debit;
                    Account credit;
                    if (TillOperation.TRANSFER_TO_VAULT.equals(tillOperation)) {
                        debit = this.findAccount(x.getCurrencyId(), vault.getAccounts()).get();
                        credit = this.findAccount(x.getCurrencyId(), till.getAccounts()).get();
                    } else {
                        debit = this.findAccount(x.getCurrencyId(), till.getAccounts()).get();
                        credit = this.findAccount(x.getCurrencyId(), vault.getAccounts()).get();
                    }

                    AccountingEntry accountingEntry = new AccountingEntry();
                    accountingEntry.setDebitAccount(debit);
                    accountingEntry.setCreditAccount(credit);
                    accountingEntry.setAmount(x.getAmount());
                    accountingEntry.setBranch(till.getBranch());
                    accountingEntry.setCreatedAt(DateHelper.getLocalDateTimeNow());
                    accountingEntry.setEffectiveAt(DateHelper.getLocalDateTimeNow());
                    accountingEntry.setCreatedBy(currentUser);
                    accountingEntry.setDescription(transferDto.getDescription());
                    accountingEntry.setDeleted(false);
                    return accountingEntry;
                }).collect(Collectors.toList());
        this.accountingEntryService.create(accountingEntries);
        this.accountingEntryTillService.create(this.accountingEntryTillService.getListAccountingEntryTill(accountingEntries, tillOperation, till));
    }

    private User getTeller(long tellerId) throws ResourceNotFoundException {
        return this.userService.findById(tellerId).orElseThrow(() ->
                new ResourceNotFoundException(String.format("Teller not found (ID=%d).", tellerId)));
    }

    private AccountingEntry createAccountingEntry(Account debit, Account credit, OperationBaseDto dto, User user, Branch branch, ExtraJson extra) {
        AccountingEntry accountingEntry = this.accountingEntryService.getAccountingEntry(dto.getDate(), dto.getAmount(),
                debit, credit, branch, dto.getDescription(), user, extra);
        return this.accountingEntryService.create(accountingEntry);
    }

    public Account findAccount(long id) throws ResourceNotFoundException {
        return this.accountService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Client's account not found (ID=%d).", id)));
    }

    private Profile findProfile(long id) throws ResourceNotFoundException {
        return this.profileService.getOne(id).orElseThrow(() -> new ResourceNotFoundException(String.format("Profile's account not found (ID=%d).", id)));
    }

    public Account getTillAccount(Till till, Currency currency) throws ResourceNotFoundException {
        return this.findAccount(currency.getId(), till.getAccounts())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Till has not account for this currency (CURRENCY=%s).", currency.getName())));
    }

    public ResponseEntity getReceipt(OperationDto dto, Till till) throws Exception {
        HashMap<String, Object> data = new HashMap<>();
        Profile profile = this.findProfile(dto.getProfileId());
        Profile initiator = this.findProfile(dto.getInitiatorId());
        Account creditAccount = this.findAccount(dto.getId());
        Account debitAccount = this.getTillAccount(till, creditAccount.getCurrency());
        data.put("accountNo", creditAccount.getNumber());
        data.put("accountName", creditAccount.getName());
        data.put("dbAccountNo", debitAccount.getNumber());
        data.put("dbAccountName", debitAccount.getName());
        data.put("amount", dto.getAmount());
        data.put("to_text", EnglishNumberToWordsHelper.convert(dto.getAmount().longValue()));
        data.put("description", dto.getDescription());
        data.put("profile", profile.getName());
        data.put("date", LocalDate.now());
        data.put("customer", initiator.getName());
        data.put("teller", till.getTeller().getFirstName() + till.getTeller().getLastName());
        data.put("cdv", LocalDate.now().format(DateTimeFormatter.ofPattern("YYYY-MM")));
        return this.printingFormService.getDocumentBy(data, "fast_deposit_receipt");
    }

    public List<Till> findAllByStatus(TillStatus status) {
        return this.tillRepository.findAllByStatus(status);
    }
}

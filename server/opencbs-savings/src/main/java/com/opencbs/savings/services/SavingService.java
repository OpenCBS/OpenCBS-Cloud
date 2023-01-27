package com.opencbs.savings.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.ProfileService;
import com.opencbs.savings.domain.Saving;
import com.opencbs.savings.domain.SavingSimplified;
import com.opencbs.savings.domain.enums.SavingStatus;
import com.opencbs.savings.dto.SavingWithAccountDto;
import com.opencbs.savings.repositories.SavingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.script.ScriptException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SavingService {

    private final SavingRepository savingRepository;
    private final SavingCodeGenerator savingCodeGenerator;
    private final AccountService accountService;
    private final SavingAccountingService savingAccountingService;
    private final AccountingEntryService accountingEntryService;
    private final DayClosureContractService dayClosureContractService;
    private final ProfileService profileService;
    private final static int DEFAULT_SCALE = 5;
    private final SavingContainer savingContainer;

    @Lazy
    @Autowired
    public SavingService(SavingRepository savingRepository,
                         SavingCodeGenerator savingCodeGenerator,
                         AccountService accountService,
                         SavingAccountingService savingAccountingService,
                         AccountingEntryService accountingEntryService,
                         DayClosureContractService dayClosureContractService,
                         ProfileService profileService,
                         SavingContainer savingContainer) {
        this.savingRepository = savingRepository;
        this.savingCodeGenerator = savingCodeGenerator;
        this.accountService = accountService;
        this.savingAccountingService = savingAccountingService;
        this.accountingEntryService = accountingEntryService;
        this.dayClosureContractService = dayClosureContractService;
        this.profileService = profileService;
        this.savingContainer = savingContainer;
    }

    public Page<SavingSimplified> getAll(String searchString, Pageable pageable) {
        if (searchString == null) {
            return this.savingRepository.getAll("", pageable);
        }
        return this.savingRepository.getAll(searchString, pageable);
    }

    public Optional<Saving> findOne(Long id) {
        Saving saving = this.savingRepository.findOne(id);
        if (saving == null || !saving.getStatus().equals(SavingStatus.OPEN)) {
            return Optional.ofNullable(saving);
        }
        return Optional.of(saving);
    }

    public Saving findById(Long id) throws ResourceNotFoundException {
        return this.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Saving not found (ID=%d).", id)));
    }

    public Page<Saving> findAllByProfileId(Pageable pageable, Long profileId) {
        return this.savingRepository.findAllByProfileId(pageable, profileId);
    }

    public List<Saving> findAllByProfile(Long profileId) {
        return this.savingRepository.findAllByProfileId(profileId);
    }

    @Transactional(rollbackFor = Exception.class)
    public Saving create(Saving saving, User user) throws ScriptException, ResourceNotFoundException {
        saving.setCreatedBy(user);
        saving.setCreatedAt(DateHelper.getLocalDateTimeNow());
        saving.setCode("");
        saving.setStatus(SavingStatus.IN_PROGRESS);
        saving.setBranch(user.getBranch());
        saving = this.savingRepository.save(saving);
        String code = this.savingCodeGenerator.generateCode(saving);
        saving.setCode(code);
        return this.savingRepository.save(saving);
    }

    @Transactional
    public Saving update(Saving saving) throws ScriptException, ResourceNotFoundException {
        String code = this.savingCodeGenerator.generateCode(saving);
        saving.setCode(code);
        return this.savingRepository.save(saving);
    }

    @Transactional
    public Saving save(Saving saving) throws ResourceNotFoundException {
        return this.savingRepository.save(saving);
    }

    @Transactional
    public Saving open(BigDecimal amount, Saving saving, User user) {
        this.checkState(saving, SavingStatus.IN_PROGRESS);
        Currency currency = saving.getProduct().getCurrency();
        Account currentAccount = this.profileService.getCurrentAccountByCurrency(saving.getProfile(), currency);
        saving.setAccounts(this.savingAccountingService.createAccounts(saving));
        saving = this.savingRepository.save(saving);
        List<AccountingEntry> entries;

        if(amount.doubleValue() > 0) {
            entries = this.getOpenEntries(amount, saving, currentAccount, user);
            saving.getAccountingEntries().addAll(entries);
        }

        saving.setOpenedBy(user);
        saving.setStatus(SavingStatus.OPEN);

        Saving saved = this.savingRepository.save(saving);
        this.updateDayClosureContract(saved.getId(), saved.getOpenDate().toLocalDate().plusDays(1), user.getBranch()); // TODO add plusDay(1) to interest accrual for my-finance

        return saved;
    }

    @Transactional
    public Saving deposit(Saving saving, BigDecimal amount, LocalDateTime date, User user) {
        this.checkState(saving, SavingStatus.OPEN);
        saving.setDepositDate(date);
        Account currentAccount = this.profileService.getCurrentAccountByCurrency(saving.getProfile(), saving.getProduct().getCurrency());

        List<AccountingEntry> entries = new ArrayList<>();
        entries.add(this.savingAccountingService.getDepositEntry(amount, saving, currentAccount, user));
        BigDecimal depositFeeRateAmount = this.getFeeRateAmount(amount, saving.getDepositFeeRate());
        entries.addAll(this.savingAccountingService.getDepositFeeAccountEntries(depositFeeRateAmount, saving, currentAccount, user));
        entries = this.accountingEntryService.create(entries);
        entries.addAll(saving.getAccountingEntries());

        saving.setAccountingEntries(entries);
        saving.setDepositedBy(user);
        return this.savingRepository.save(saving);
    }

    @Transactional
    public Saving withdraw(Saving saving, BigDecimal amount, LocalDateTime date, User user) {
        this.checkState(saving, SavingStatus.OPEN);
        saving.setWithdrawDate(date);
        Account currentAccount = this.profileService.getCurrentAccountByCurrency(saving.getProfile(), saving.getProduct().getCurrency());

        List<AccountingEntry> entries = new ArrayList<>();
        entries.add(this.savingAccountingService.getWithdrawEntry(amount, saving, currentAccount, user));
        BigDecimal withdrawFeeRateAmount = this.getFeeRateAmount(amount, saving.getWithdrawalFeeRate());
        entries.addAll(this.savingAccountingService.getWithdrawFeeAccountEntries(withdrawFeeRateAmount, saving, currentAccount, user));
        entries = this.accountingEntryService.create(entries);
        entries.addAll(saving.getAccountingEntries());

        saving.setAccountingEntries(entries);
        saving.setWithdrawBy(user);
        return this.savingRepository.save(saving);
    }

    public BigDecimal getSavingAccountBalance(Account account, LocalDateTime dateTime) {
        return this.accountService.getAccountBalance(account.getId(), dateTime);
    }

    public Page<SavingWithAccountDto> getAllWithAccount(String searchString, Pageable pageable) {
        return this.savingRepository.getAllSimplifiedSavingAccount(searchString, pageable);
    }

    public BigDecimal getFeeRateAmount(BigDecimal amount, BigDecimal feeRate) {
        if (feeRate.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal rate = feeRate.divide(BigDecimal.valueOf(100), DEFAULT_SCALE, RoundingMode.HALF_UP);
            return amount.multiply(rate);
        }
        return BigDecimal.ZERO;
    }

    public void checkState(Saving saving, SavingStatus wishStatus) {
        this.checkLock(saving);
        this.checkStatus(saving, wishStatus);
    }

    List<Long> findIdsWhenSavingHasStatus(SavingStatus open, Branch branch) {
        return this.savingRepository.findIdsWhenSavingHasStatus(open, branch);
    }

    private void checkLock(Saving saving) {
        if (saving.isLocked()) {
            throw new RuntimeException(String.format("Saving is locked (ID=%d).", saving.getId()));
        }
    }

    private void checkStatus(Saving saving, SavingStatus wishStatus) {
        if (!saving.getStatus().equals(wishStatus)) {
            throw new RuntimeException(String.format("Saving (ID=%d) should be in %s status.", saving.getId(), wishStatus));
        }
    }

    private void updateDayClosureContract(Long id, LocalDate date, Branch branch) {
        for (ProcessType containerType : this.savingContainer.getContractProcessTypes()) {
            this.dayClosureContractService.updateDayClosureContract(id, containerType, date, branch);
        }
    }

    private List<AccountingEntry> getOpenEntries(BigDecimal amount, Saving saving, Account currentAccount, User user) {
        BigDecimal entryFeeRateAmount = this.getFeeRateAmount(amount, saving.getEntryFeeRate());
        List<AccountingEntry> entries = new ArrayList<>(this.savingAccountingService.getEntryFeeAccountEntries(entryFeeRateAmount, saving, currentAccount, user));
        amount = amount.subtract(saving.getEntryFeeFlat().add(entryFeeRateAmount));
        entries.add(this.savingAccountingService.getInitialAmountEntry(amount, saving, currentAccount, user));
        entries = this.accountingEntryService.create(entries);
        return entries;
    }
}
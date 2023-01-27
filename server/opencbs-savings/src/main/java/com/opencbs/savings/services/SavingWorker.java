package com.opencbs.savings.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.annotations.Work;
import com.opencbs.core.domain.User;
import com.opencbs.core.services.ProfileService;
import com.opencbs.savings.domain.Saving;
import com.opencbs.savings.domain.enums.SavingStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Work
public class SavingWorker {

    private final ProfileService profileService;
    private final SavingAccountingService savingAccountingService;
    private final SavingService savingService;
    private final AccountingEntryService accountingEntryService;
    private final static int DEFAULT_SCALE = 5;

    @Autowired
    public SavingWorker(ProfileService profileService,
                        SavingAccountingService savingAccountingService,
                        SavingService savingService,
                        AccountingEntryService accountingEntryService) {
        this.profileService = profileService;
        this.savingAccountingService = savingAccountingService;
        this.savingService = savingService;
        this.accountingEntryService = accountingEntryService;
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

        return this.savingService.save(saving);
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

        return this.savingService.save(saving);
    }

    public Saving lock(Saving saving) {
        this.checkStatus(saving, SavingStatus.OPEN);
        saving.setLocked(!saving.isLocked());
        return this.savingService.save(saving);
    }

    private void checkState(Saving saving, SavingStatus wishStatus) {
        this.checkLock(saving);
        this.checkStatus(saving, wishStatus);
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

    private BigDecimal getFeeRateAmount(BigDecimal amount, BigDecimal feeRate) {
        BigDecimal rate = feeRate.divide(BigDecimal.valueOf(100), DEFAULT_SCALE, RoundingMode.HALF_UP);
        return amount.multiply(rate);
    }

}

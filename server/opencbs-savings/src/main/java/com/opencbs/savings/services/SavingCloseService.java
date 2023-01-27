package com.opencbs.savings.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.ProfileService;
import com.opencbs.savings.annotations.CustomSavingDayClosureProcessor;
import com.opencbs.savings.domain.Saving;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import com.opencbs.savings.domain.enums.SavingStatus;
import com.opencbs.savings.repositories.SavingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@ConditionalOnMissingBean(annotation = CustomSavingDayClosureProcessor.class)
public class SavingCloseService implements SavingCloseInterface {

    private final SavingService savingService;
    private final ProfileService profileService;
    private final SavingAccountingService savingAccountingService;
    private final AccountingEntryService accountingEntryService;
    private final SavingRepository savingRepository;

    @Override
    @Transactional
    public Saving close(Saving saving, LocalDate closeDate) {
        this.savingService.checkState(saving, SavingStatus.OPEN);
        LocalDateTime operationTime = LocalDateTime.of(closeDate, DateHelper.getLocalTimeNow());
        saving.setCloseDate(operationTime);
        List<AccountingEntry> entries = new ArrayList<>();

        Account credit;
        if (!saving.isCapitalized()) {
            credit = this.profileService.getCurrentAccountByCurrency(saving.getProfile(), saving.getProduct().getCurrency());
        }
        else {
            credit = this.savingAccountingService.getAccount(saving.getAccounts(), SavingAccountRuleType.SAVING);
        }
        Account debit = this.savingAccountingService.getAccount(saving.getAccounts(), SavingAccountRuleType.INTEREST);
        BigDecimal interestBalance = this.savingService.getSavingAccountBalance(debit, operationTime);
        if (!interestBalance.equals(BigDecimal.ZERO)) {
            entries.add(this.interestEntry(saving, operationTime, interestBalance, debit, credit, UserHelper.getCurrentUser()));
        }

        Currency productCurrency = saving.getProduct().getCurrency();
        Account currentAccount = this.profileService.getCurrentAccountByCurrency(saving.getProfile(), productCurrency);
        Account savingAccount = this.savingAccountingService.getAccount(saving.getAccounts(), SavingAccountRuleType.SAVING);
        BigDecimal savingBalance = this.savingService.getSavingAccountBalance(savingAccount, operationTime);
        entries.add(this.savingAccountingService.getCloseEntry(savingBalance, saving, currentAccount, UserHelper.getCurrentUser()));

        BigDecimal closeFeeRateAmount = this.savingService.getFeeRateAmount(savingBalance, saving.getCloseFeeRate());
        if (closeFeeRateAmount.compareTo(BigDecimal.ZERO) > 0) {
            entries.addAll(this.savingAccountingService.getCloseFeeAccountEntries(closeFeeRateAmount, saving, currentAccount, UserHelper.getCurrentUser()));
        }
        entries = this.accountingEntryService.create(entries);
        entries.addAll(saving.getAccountingEntries());

        saving.setAccountingEntries(entries);
        saving.setClosedBy(UserHelper.getCurrentUser());
        saving.setStatus(SavingStatus.CLOSED);
        return this.savingRepository.save(saving);
    }

    private AccountingEntry interestEntry(Saving saving, LocalDateTime date, BigDecimal amount, Account debit, Account credit,
                                          User user) {
        return this.accountingEntryService.getAccountingEntry(
                date,
                amount,
                debit,
                credit,
                saving.getProfile().getBranch(),
                String.format("Interest Posting for savings %s", saving.getCode()),
                user,
                null);
    }
}

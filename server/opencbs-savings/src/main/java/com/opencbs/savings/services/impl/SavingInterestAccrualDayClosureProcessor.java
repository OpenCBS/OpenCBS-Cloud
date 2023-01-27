package com.opencbs.savings.services.impl;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.savings.annotations.CustomSavingDayClosureProcessor;
import com.opencbs.savings.domain.SavingAccountingEntry;
import com.opencbs.savings.domain.SavingInterestAccrual;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import com.opencbs.savings.repositories.SavingAccountingEntryRepository;
import com.opencbs.savings.repositories.SavingInterestAccrualRepository;
import com.opencbs.savings.services.SavingAccountService;
import com.opencbs.savings.services.SavingDayClosureProcessor;
import com.opencbs.savings.services.SavingService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Year;

@Service
@RequiredArgsConstructor
@ConditionalOnMissingBean(annotation = CustomSavingDayClosureProcessor.class)
public class SavingInterestAccrualDayClosureProcessor implements SavingDayClosureProcessor {

    private static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_EVEN;
    private static final int DECIMAL_PLACE = 2;

    private final SavingService savingService;
    private final AccountingEntryService accountingEntryService;
    private final SavingAccountService savingAccountService;
    private final SavingInterestAccrualRepository savingRepository;
    private final SavingAccountingEntryRepository savingAccountingEntryRepository;


    @Override
    public void processContract(@NonNull Long savingId, @NonNull LocalDate closureDate, @NonNull User user) {
        SavingInterestAccrual saving = savingRepository.findOne(savingId);
        if (saving.getInterestRate().equals(BigDecimal.ZERO)) {
            return;
        }

        AccountingEntry entry = createDailyAccrualEntry(saving, closureDate, user);
        if (entry.getAmount().compareTo(BigDecimal.ZERO) > 0) {
            accountingEntryService.save(entry);
            savingAccountingEntryRepository.save(new SavingAccountingEntry(savingId, entry.getId()));
        }
    }

    @Override
    public ProcessType getProcessType() {
        return ProcessType.SAVING_INTEREST_ACCRUAL;
    }

    @Override
    public String getIdentityString() {
        return "saving.interest-accrual";
    }

    private AccountingEntry createAccountingEntry(@NonNull BigDecimal amount,
                                                  @NonNull SavingInterestAccrual saving,
                                                  @NonNull LocalDateTime dateTime,
                                                  @NonNull User user) {
        Account debit = savingAccountService.getSavingAccount(saving.getId(), SavingAccountRuleType.INTEREST_EXPENSE);
        Account credit = savingAccountService.getSavingAccount(saving.getId(), SavingAccountRuleType.INTEREST);

        return AccountingEntry.builder()
                .amount(amount)
                .debitAccount(debit)
                .creditAccount(credit)
                .deleted(false)
                .branch(saving.getBranch())
                .createdBy(user)
                .description(String.format("Interest accrual for savings %s", saving.getCode()))
                .createdAt(DateHelper.getLocalDateTimeNow())
                .effectiveAt(dateTime)
                .build();
    }

    private AccountingEntry createDailyAccrualEntry(@NonNull SavingInterestAccrual saving, @NonNull LocalDate date, @NonNull User user) {
        Account account = savingAccountService.getSavingAccount(saving.getId(), SavingAccountRuleType.SAVING);
        BigDecimal balance = savingService.getSavingAccountBalance(account, date.atTime(LocalTime.MAX));

        BigDecimal interest = BigDecimal.ZERO;
        if (balance.compareTo(saving.getProduct().getMinBalance()) >= 0) {
            interest = getInterest(date, balance, saving.getInterestRate());
        }

        return createAccountingEntry(interest, saving, date.atTime(getProcessType().getOperationTime()), user);
    }

    private BigDecimal getInterest(LocalDate date, BigDecimal amount, BigDecimal interest) {
        BigDecimal interestAmount = amount.multiply(interest.divide(BigDecimal.valueOf(100)))
                .divide(BigDecimal.valueOf(Year.of(date.getYear()).length()), RoundingMode.HALF_DOWN);
        return interestAmount.setScale(DECIMAL_PLACE, ROUNDING_MODE);
    }
}

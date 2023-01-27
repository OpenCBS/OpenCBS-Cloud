package com.opencbs.savings.services.impl;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.Frequency;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.ProfileAccountService;
import com.opencbs.savings.annotations.CustomSavingDayClosureProcessor;
import com.opencbs.savings.domain.SavingAccountingEntry;
import com.opencbs.savings.domain.SavingPosting;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import com.opencbs.savings.repositories.SavingAccountingEntryRepository;
import com.opencbs.savings.repositories.SavingPostingRepository;
import com.opencbs.savings.services.SavingAccountService;
import com.opencbs.savings.services.SavingDayClosureProcessor;
import com.opencbs.savings.services.SavingService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;

@Service
@RequiredArgsConstructor
@ConditionalOnMissingBean(annotation = CustomSavingDayClosureProcessor.class)
public class SavingPostingDayClosureProcessor implements SavingDayClosureProcessor {

    private final SavingService savingService;
    private final AccountingEntryService accountingEntryService;
    private final SavingAccountService savingAccountService;
    private final SavingPostingRepository savingRepository;
    private final ProfileAccountService profileAccountService;
    private final SavingAccountingEntryRepository savingAccountingEntryRepository;


    @Override
    public void processContract(@NonNull Long savingId, @NonNull LocalDate closureDate, @NonNull User user) {
        SavingPosting saving = savingRepository.findOne(savingId);

        LocalDateTime entryDate = getEntryEffectiveDate(closureDate, saving.getInterestPostingFrequency());
        if(entryDate == null) {
            return;
        }

        Account debitAccount = savingAccountService.getSavingAccount(saving.getId(), SavingAccountRuleType.INTEREST);
        BigDecimal entryAmount = savingService.getSavingAccountBalance(debitAccount, closureDate.atTime(getProcessType().getOperationTime()));
        if (entryAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        AccountingEntry entry = AccountingEntry.builder()
                .amount(entryAmount)
                .debitAccount(debitAccount)
                .creditAccount(getCreditAccount(saving))
                .deleted(false)
                .branch(saving.getBranch())
                .createdBy(user)
                .createdAt(DateHelper.getLocalDateTimeNow())
                .description(String.format("Interest Posting for savings %s", saving.getCode()))
                .effectiveAt(entryDate)
                .build();

        accountingEntryService.save(entry);
        savingAccountingEntryRepository.save(new SavingAccountingEntry(savingId, entry.getId()));
    }

    private Account getCreditAccount(@NonNull SavingPosting saving) {
        if (saving.isCapitalized()) {
            return savingAccountService.getSavingAccount(saving.getId(), SavingAccountRuleType.SAVING);
        }

        return profileAccountService.getProfileAccount(saving.getProfileId(), saving.getProduct().getCurrencyId());
    }

    private LocalDateTime getEntryEffectiveDate(@NonNull LocalDate closureDate, @NonNull Frequency frequency) {
        LocalDateTime effectiveDate = closureDate.atTime(getProcessType().getOperationTime());

        switch (frequency) {
            case DAILY:
                return effectiveDate;
            case MONTHLY:
                return closureDate.equals(closureDate.plusMonths(1))
                        ? effectiveDate
                        : null;
            case YEARLY:
                return closureDate.equals(closureDate.plusMonths(12))
                        ? effectiveDate
                        : null;
            case END_OF_MONTH:
                return closureDate.getDayOfMonth() == closureDate.getMonth().length(Year.isLeap(closureDate.getYear()))
                        ? effectiveDate
                        : null;
        }

        throw new RuntimeException("Unknown frequency type: " + frequency);
    }

    @Override
    public ProcessType getProcessType() {
        return ProcessType.SAVING_POSTING;
    }

    @Override
    public String getIdentityString() {
        return "saving.posting";
    }
}

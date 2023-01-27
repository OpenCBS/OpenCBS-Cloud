package com.opencbs.savings.services.impl;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.ProfileAccountService;
import com.opencbs.savings.annotations.CustomSavingDayClosureProcessor;
import com.opencbs.savings.domain.SavingAccountingEntry;
import com.opencbs.savings.domain.SavingManagementFee;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import com.opencbs.savings.repositories.SavingAccountingEntryRepository;
import com.opencbs.savings.repositories.SavingManagementFeeRepository;
import com.opencbs.savings.services.SavingAccountService;
import com.opencbs.savings.services.SavingDayClosureProcessor;
import com.opencbs.savings.services.SavingService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Year;

@Service
@RequiredArgsConstructor
@ConditionalOnMissingBean(annotation = CustomSavingDayClosureProcessor.class)
public class SavingManagementFeeDayClosureProcessor implements SavingDayClosureProcessor {

    private final SavingService savingService;
    private final DayClosureContractService dayClosureContractService;
    private final AccountingEntryService accountingEntryService;
    private final ProfileAccountService profileAccountService;
    private final SavingAccountService savingAccountService;
    private final SavingManagementFeeRepository savingRepository;
    private final SavingAccountingEntryRepository savingAccountingEntryRepository;


    @Override
    public void processContract(@NonNull Long savingId, @NonNull LocalDate closureDate, @NonNull User user) {
        if (closureDate.getDayOfMonth() != closureDate.getMonth().length(Year.isLeap(closureDate.getYear()))) {
            return;
        }

        SavingManagementFee saving = savingRepository.findOne(savingId);
        if (saving.getManagementFeeRate().equals(BigDecimal.ZERO) && saving.getManagementFeeFlat().equals(BigDecimal.ZERO)) {
            return;
        }

        createManagementEntries(saving, closureDate, user);
    }

    private void createManagementEntries(@NonNull SavingManagementFee saving, @NonNull LocalDate closureDate, @NonNull User user) {

        Account currentAccount = profileAccountService.getProfileAccount(saving.getProfileId(), saving.getProduct().getCurrencyId());

        BigDecimal managementFeeRateAmount = getManagementFeeAmount(saving, closureDate);
        createManagementFeeAccountEntries(closureDate.atTime(LocalTime.MAX), managementFeeRateAmount, saving, currentAccount, user);
    }

    @Override
    public ProcessType getProcessType() {
        return ProcessType.SAVING_MANAGEMENT_FEE;
    }

    @Override
    public String getIdentityString() {
        return "saving.management-fee";
    }

    private BigDecimal getManagementFeeAmount(@NonNull SavingManagementFee saving, @NonNull LocalDate closureDate) {
        LocalDate startDate = dayClosureContractService.getLastRunDay(saving.getId(), getProcessType());
        long days = Duration.between(startDate.atStartOfDay(), closureDate.atStartOfDay()).toDays();

        Account savingAccount = savingAccountService.getSavingAccount(saving.getId(), SavingAccountRuleType.SAVING);
        BigDecimal savingBalance = savingService.getSavingAccountBalance(savingAccount, closureDate.atTime(LocalTime.MAX));

        return savingBalance.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_EVEN)
                .multiply(saving.getManagementFeeRate())
                .divide(BigDecimal.valueOf(365), 2, RoundingMode.HALF_EVEN)
                .multiply(BigDecimal.valueOf(days));
    }

    private void createManagementFeeAccountEntries(@NonNull LocalDateTime date,
                                                   @NonNull BigDecimal feeRateAmount,
                                                   @NonNull SavingManagementFee saving,
                                                   @NonNull Account currentAccount,
                                                   @NonNull User user) {
        Account managementFeeAccount = savingAccountService.getSavingAccount(saving.getId(), SavingAccountRuleType.MANAGEMENT_FEE);
        Account managementFeeIncomeAccount = savingAccountService.getSavingAccount(saving.getId(), SavingAccountRuleType.MANAGEMENT_FEE_INCOME);

        getSavingFeeAccountingEntries(currentAccount, managementFeeAccount, managementFeeIncomeAccount,
                feeRateAmount, saving.getManagementFeeFlat(), saving, date,  user);
    }

    private void getSavingFeeAccountingEntries(@NonNull Account currentAccount,
                                               @NonNull Account feeAccount,
                                               @NonNull Account feeIncomeAccount,
                                               @NonNull BigDecimal feeRateAmount,
                                               @NonNull BigDecimal feeFlatAmount,
                                               @NonNull SavingManagementFee saving,
                                               @NonNull LocalDateTime operationDate,
                                               @NonNull User user){
        if (feeFlatAmount.compareTo(BigDecimal.ZERO) > 0) {
            createFeeFlatAccrualEntry(saving.getId(), currentAccount, feeAccount, feeFlatAmount, saving, user, operationDate);
        }

        if (feeRateAmount.compareTo(BigDecimal.ZERO) > 0) {
            createFeeRateAccrualEntry(saving.getId(), feeAccount, feeIncomeAccount, feeRateAmount, saving, user, operationDate);
            createFeeRateIncomeEntry(saving.getId(), currentAccount, feeAccount, feeRateAmount, saving, user, operationDate);
        }
    }

    private void createFeeFlatAccrualEntry(@NonNull Long savingId,
                                           @NonNull Account debitAccount,
                                           @NonNull Account creditAccount,
                                           @NonNull BigDecimal amount,
                                           @NonNull SavingManagementFee saving,
                                           @NonNull User user,
                                           @NonNull LocalDateTime operationDateTime) {
        AccountingEntry entry = accountingEntryService.create(
                AccountingEntry.builder()
                        .debitAccount(debitAccount)
                        .creditAccount(creditAccount)
                        .amount(amount)
                        .deleted(false)
                        .branch(saving.getBranch())
                        .createdBy(user)
                        .createdAt(DateHelper.getLocalDateTimeNow())
                        .effectiveAt(LocalDateTime.of(operationDateTime.toLocalDate(), DateHelper.getLocalTimeNow()))
                        .description("Management Fee flat income flat accrual")
                        .build()
        );

        savingAccountingEntryRepository.save(new SavingAccountingEntry(savingId, entry.getId()));
    }

    private void createFeeRateAccrualEntry(@NonNull Long savingId,
                                           @NonNull Account debitAccount,
                                           @NonNull Account creditAccount,
                                           @NonNull BigDecimal amount,
                                           @NonNull SavingManagementFee saving,
                                           @NonNull User user,
                                           @NonNull LocalDateTime operationDateTime) {
        AccountingEntry entry = accountingEntryService.create(
                AccountingEntry.builder()
                        .debitAccount(debitAccount)
                        .creditAccount(creditAccount)
                        .amount(amount)
                        .deleted(false)
                        .branch(saving.getBranch())
                        .createdBy(user)
                        .createdAt(DateHelper.getLocalDateTimeNow())
                        .effectiveAt(LocalDateTime.of(operationDateTime.toLocalDate(), DateHelper.getLocalTimeNow()))
                        .description("Management Fee rate accrual flat income")
                        .build()
        );

        savingAccountingEntryRepository.save(new SavingAccountingEntry(savingId, entry.getId()));
    }

    private void createFeeRateIncomeEntry(@NonNull Long savingId,
                                          @NonNull Account debitAccount,
                                          @NonNull Account creditAccount,
                                          @NonNull BigDecimal amount,
                                          @NonNull SavingManagementFee saving,
                                          @NonNull User user,
                                          @NonNull LocalDateTime operationDateTime) {
        AccountingEntry entry = accountingEntryService.create(
                AccountingEntry.builder()
                        .debitAccount(debitAccount)
                        .creditAccount(creditAccount)
                        .amount(amount)
                        .deleted(false)
                        .branch(saving.getBranch())
                        .createdBy(user)
                        .createdAt(DateHelper.getLocalDateTimeNow())
                        .effectiveAt(LocalDateTime.of(operationDateTime.toLocalDate(), DateHelper.getLocalTimeNow()))
                        .description("Management Fee rate accrual flat income")
                        .build()
        );

        savingAccountingEntryRepository.save(new SavingAccountingEntry(savingId, entry.getId()));
    }
}

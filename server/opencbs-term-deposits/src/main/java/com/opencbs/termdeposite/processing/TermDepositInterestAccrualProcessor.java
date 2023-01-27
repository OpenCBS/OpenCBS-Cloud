package com.opencbs.termdeposite.processing;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.termdeposite.annotaions.CustomTermDepositDayClosureProcessor;
import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.domain.TermDepositAccountingEntry;
import com.opencbs.termdeposite.domain.TermDepositInterestAccrual;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;
import com.opencbs.termdeposite.domain.enums.TermDepositStatus;
import com.opencbs.termdeposite.repositories.TermDepositInterestAccrualRepository;
import com.opencbs.termdeposite.services.TermDepositAccountService;
import com.opencbs.termdeposite.services.TermDepositAccountingEntryService;
import com.opencbs.termdeposite.services.TermDepositService;
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
@ConditionalOnMissingBean(annotation = CustomTermDepositDayClosureProcessor.class)
public class TermDepositInterestAccrualProcessor implements TermDepositDayClosureProcessor {

    private static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_EVEN;
    private static final int DECIMAL_PLACE = 2;

    private final TermDepositService termDepositService;
    private final AccountService accountService;
    private final TermDepositInterestAccrualRepository termDepositRepository;
    private final TermDepositAccountService termDepositAccountService;
    private final AccountingEntryService accountingEntryService;
    private final TermDepositAccountingEntryService termDepositAccountingEntryService;


    @Override
    public void processContract(@NonNull Long termDepositId, @NonNull LocalDate closureDate, @NonNull User user) {
        TermDepositInterestAccrual termDeposit = termDepositRepository.findOne(termDepositId);
        if (BigDecimal.ZERO.equals(termDeposit.getInterestRate())) {
            return;
        }

        if (termDeposit.getStatus() != TermDepositStatus.OPEN) {
            return;
        }

        LocalDate expirationDate = termDepositService.getExpiredDate(termDeposit.getOpenDate(), termDeposit.getTermAgreement());
        if (DateHelper.greater(closureDate, expirationDate)) {
            return;
        }

        processDayClosure(termDeposit, closureDate, user);
    }

    @Override
    public ProcessType getProcessType() {
        return ProcessType.TERM_DEPOSIT_INTEREST_ACCRUAL;
    }

    @Override
    public String getIdentityString() {
        return "term-deposit.interest-accrual";
    }

    private void processDayClosure(@NonNull TermDepositInterestAccrual termDeposit, @NonNull LocalDate closureDate, @NonNull User user) {
        Account account = termDepositAccountService.getTermDepositAccount(termDeposit.getId(), TermDepositAccountType.PRINCIPAL);
        BigDecimal balance = accountService.getAccountBalance(account.getId(), closureDate.atTime(LocalTime.MAX));
        BigDecimal interest = getInterestAmount(closureDate, balance, termDeposit.getInterestRate());

        AccountingEntry accountingEntry = createAccountingEntry(termDeposit,
                interest,
                closureDate.atTime(getProcessType().getOperationTime()),
                user);

        accountingEntryService.save(accountingEntry);
        termDepositAccountingEntryService.save(new TermDepositAccountingEntry(new TermDeposit(termDeposit.getId()), accountingEntry));
    }

    private BigDecimal getInterestAmount(@NonNull LocalDate date, @NonNull BigDecimal amount, @NonNull BigDecimal interest) {
        BigDecimal interestAmount = amount.multiply(interest.divide(BigDecimal.valueOf(100)))
                .divide(BigDecimal.valueOf(Year.of(date.getYear()).length()), RoundingMode.HALF_DOWN);

        return interestAmount.setScale(DECIMAL_PLACE, ROUNDING_MODE);
    }

    private AccountingEntry createAccountingEntry(@NonNull TermDepositInterestAccrual termDeposit,
                                                  @NonNull BigDecimal amount,
                                                  @NonNull LocalDateTime dateTime,
                                                  @NonNull User user) {
        Account debitAccount = termDepositAccountService.getTermDepositAccount(termDeposit.getId(), TermDepositAccountType.INTEREST_EXPENSE);
        Account creditAccount = termDepositAccountService.getTermDepositAccount(termDeposit.getId(), TermDepositAccountType.INTEREST_ACCRUAL);

        return AccountingEntry.builder()
                .amount(amount)
                .debitAccount(debitAccount)
                .creditAccount(creditAccount)
                .deleted(false)
                .branch(termDeposit.getBranch())
                .createdBy(user)
                .createdAt(DateHelper.getLocalDateTimeNow())
                .description(String.format("Interest accrual for term deposit %s", termDeposit.getCode()))
                .effectiveAt(dateTime)
                .build();
    }
}

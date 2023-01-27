package com.opencbs.termdeposite.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.ProfileService;
import com.opencbs.termdeposite.annotaions.CustomTermDepositDayClosureProcessor;
import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;
import com.opencbs.termdeposite.domain.enums.TermDepositAction;
import com.opencbs.termdeposite.domain.enums.TermDepositStatus;
import com.opencbs.termdeposite.work.TermDepositWork;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@ConditionalOnMissingBean(annotation = CustomTermDepositDayClosureProcessor.class)
public class TermDepositCloseService implements TermDepositCloseInterface {

    private final TermDepositWork termDepositWork;
    private final ProfileService profileService;
    private final TermDepositAccountingService termDepositAccountingService;
    private final TermDepositService termDepositService;
    private final AccountService accountService;

    @Override
    @Transactional
    public TermDeposit close(Long termDepositId, LocalDate closeDate) {
        TermDeposit termDeposit = this.termDepositWork.getExistingTermDepositById(termDepositId);
        Branch branch = termDeposit.getProfile().getBranch();

        Account currentAccount = this.profileService.getCurrentAccountByCurrency(
                termDeposit.getProfile(),
                termDeposit.getTermDepositProduct().getCurrency());

        Account principalAccount = termDepositAccountingService.getAccountByType(
                termDeposit.getAccounts(),
                TermDepositAccountType.PRINCIPAL);

        Account interestAccrualAccount = termDepositAccountingService.getAccountByType(
                termDeposit.getAccounts(),
                TermDepositAccountType.INTEREST_ACCRUAL);

        LocalDateTime operationTime = LocalDateTime.of(closeDate, DateHelper.getLocalTimeNow());

        Optional<LocalDateTime> maxInterestAccrualEntry = termDeposit.getAccountingEntries()
                .stream()
                .filter(x -> x.getCreditAccount().getId().equals(interestAccrualAccount.getId())
                        && !x.getDeleted())
                .map(AccountingEntry::getEffectiveAt)
                .max(LocalDateTime::compareTo);

        if (maxInterestAccrualEntry.isPresent()) {
            LocalDate lastAccrualDate = maxInterestAccrualEntry.get().toLocalDate();
            if (closeDate.isBefore(lastAccrualDate)) {
                throw new RuntimeException(String.format("You can't close Term deposit before last accrual date(DATE=%s).", lastAccrualDate));
            }
        }

        this.termDepositWork.makeTransaction(
                termDeposit,
                operationTime,
                principalAccount,
                currentAccount,
                branch,
                accountService.getAccountBalance(principalAccount.getId(), operationTime),
                TermDepositAction.TRANSACTION_BASE_BALANCE_TO_CURRENT_ACCOUNT);

        BigDecimal sumInterestAccrual =
                this.accountService.getAccountBalance(interestAccrualAccount.getId(), LocalDateTime.of(closeDate, DateHelper.getLocalTimeNow()));

        if (this.isBeforeExpectedClose(operationTime.toLocalDate(), termDeposit)) {
            Account interestWriteOffAccount = termDepositAccountingService.getAccountByType(
                    termDeposit.getAccounts(),
                    TermDepositAccountType.INTEREST_WRITE_OFF);
            Account earlyCloseFeeAccount = termDepositAccountingService.getAccountByType(
                    termDeposit.getAccounts(),
                    TermDepositAccountType.INTEREST_WRITE_OFF);

            if (sumInterestAccrual.compareTo(BigDecimal.ZERO) > 0) {
                this.termDepositWork.makeTransaction(
                        termDeposit,
                        operationTime,
                        interestAccrualAccount,
                        interestWriteOffAccount,
                        branch,
                        sumInterestAccrual,
                        TermDepositAction.TRANSACTION_ACCRUAL_INTEREST_TO_BANK);
            }

            BigDecimal sumEarlyCloseFee = termDeposit.getEarlyCloseFeeFlat()
                    .add(termDeposit.getAmount()
                    .multiply(termDeposit.getEarlyCloseFeeRate()
                    .divide(BigDecimal.valueOf(100))));

            if (sumEarlyCloseFee.compareTo(BigDecimal.ZERO) > 0) {
                this.termDepositWork.makeTransaction(
                        termDeposit,
                        operationTime,
                        currentAccount,
                        earlyCloseFeeAccount,
                        branch,
                        sumEarlyCloseFee,
                        TermDepositAction.TRANSACTION_AMOUNT_TO_EARLY_CLOSE_FEE);
            }
        }
        else {
            if (sumInterestAccrual.compareTo(BigDecimal.ZERO) > 0) {
                this.termDepositWork.makeTransaction(
                        termDeposit,
                        operationTime,
                        interestAccrualAccount,
                        currentAccount,
                        branch,
                        sumInterestAccrual,
                        TermDepositAction.TRANSACTION_ACCRUAL_INTEREST_TO_CURRENT_ACCOUNT);
            }
        }

        termDeposit.setStatus(TermDepositStatus.CLOSED);
        termDeposit.setCloseDate(operationTime);
        return termDepositService.save(termDeposit);
    }

    private boolean isBeforeExpectedClose(LocalDate operationDate, TermDeposit termDeposit) {
        return operationDate.isBefore(termDepositService.getExpiredDate(termDeposit.getOpenDate(), termDeposit.getTermAgreement()));
    }
}

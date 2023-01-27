package com.opencbs.loans.services.repayment.impl;

import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.services.EventGroupKeyService;
import com.opencbs.loans.annotations.repayment.DefaultRepaymentService;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.domain.LoanPenaltyAccount;
import com.opencbs.loans.domain.LoanPenaltyAmount;
import com.opencbs.loans.dto.RepaymentResult;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.services.*;
import com.opencbs.loans.services.repayment.LoanRepaymentBaseService;
import com.opencbs.loans.services.repayment.LoanRepaymentService;
import com.opencbs.loans.services.repayment.RepaymentEventService;
import lombok.NonNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@DefaultRepaymentService("EARLY_TOTAL_REPAYMENT")
public class EarlyTotalRepaymentService extends LoanRepaymentBaseService implements LoanRepaymentService {

    private final LoanPenaltyEventService loanPenaltyEventService;


    protected EarlyTotalRepaymentService(@NonNull LoanInstallmentRepository loanInstallmentRepository,
                                         @NonNull LoanEventService loanEventService,
                                         @NonNull EventGroupKeyService eventGroupKeyService,
                                         @NonNull RepaymentEventService repaymentEventService,
                                         @NonNull LoanPenaltyEventService loanPenaltyEventService,
                                         @NonNull LoanAccountingService loanAccountingService,
                                         @NonNull LoanService loanService) {
        super(loanInstallmentRepository,
                loanEventService,
                eventGroupKeyService,
                repaymentEventService,
                loanAccountingService,
                loanPenaltyEventService,
                loanService
        );

        this.loanPenaltyEventService = loanPenaltyEventService;
    }

    @Override
    public RepaymentSplit split(@NonNull Long loanId, @NonNull RepaymentSplit repaymentSplit) {
        repaymentSplit.setMax(getMaxRepaymentAmount(
                loanInstallmentRepository.findByLoanIdAndDateTime(loanId, null))
        );

        return repaymentSplit;
    }

    @Override
    protected RepaymentResult repayImpl(@NonNull RepaymentResult result, @NonNull RepaymentSplit repaymentSplit, boolean persist) {
        List<LoanInstallment> installments = loanInstallmentRepository.findByLoanIdAndDateTime(result.getLoan().getId(), null)
                .stream()
                .sorted(Comparator.comparing(LoanInstallment::getNumber))
                .collect(Collectors.toList());
        result.setInstallments(installments);

        List<LoanInstallment> unpaidInstallments = InstallmentsHelper.getUnpaidInstallments(installments);

        processPenaltyRepaymentInternal(
                result.getLoan().getId(),
                repaymentSplit.getPenalty(),
                repaymentSplit.getTimestamp(),
                result,
                persist
        );

        processInterestRepaymentInternal(
                unpaidInstallments,
                repaymentSplit.getInterest(),
                repaymentSplit.getTimestamp(),
                result,
                persist
        );

        processPrincipalRepaymentInternal(
                unpaidInstallments,
                repaymentSplit.getPrincipal(),
                repaymentSplit.getTimestamp(),
                result,
                persist
        );

        return result;
    }

    protected void processPenaltyRepaymentInternal(@NonNull Long loanId, @NonNull BigDecimal penaltyAmount, @NonNull LocalDateTime timestamp, @NonNull RepaymentResult result, boolean isRepayment) {
        if (penaltyAmount.compareTo(BigDecimal.ZERO) == 0) {
            return;
        }

        List<LoanPenaltyAmount> penaltyAmounts = loanPenaltyEventService.getPenaltyAmounts(loanId, timestamp.toLocalDate());
        for (LoanPenaltyAmount loanPenaltyAmount : penaltyAmounts){
            if (penaltyAmount.compareTo(BigDecimal.ZERO) == 0) {
                break;
            }

            BigDecimal penaltyToPaid = loanPenaltyAmount.getAmount();
            if (penaltyToPaid.compareTo(BigDecimal.ZERO) == 0) {
                continue;
            }

            penaltyToPaid = penaltyToPaid.compareTo(penaltyAmount) > 0 ? penaltyAmount : penaltyToPaid;
            penaltyAmount = penaltyAmount.subtract(penaltyToPaid);
            if (isRepayment) {
                createPenaltyRepaymentEvents(
                        loanId,
                        penaltyToPaid,
                        timestamp,
                        loanPenaltyAmount.getPenaltyAccount(),
                        result
                );
            }
        }
    }

    protected void processInterestRepaymentInternal(@NonNull List<LoanInstallment> installments, @NonNull BigDecimal interestAmount, @NonNull LocalDateTime timestamp, @NonNull RepaymentResult result, boolean isRepayment) {
        for (LoanInstallment i : installments) {
            if (interestAmount.compareTo(BigDecimal.ZERO) == 0) {
                break;
            }

            BigDecimal interestToPaid = i.getInterestDue();
            interestToPaid = interestToPaid.compareTo(interestAmount) > 0 ? interestAmount : interestToPaid;
            i.setPaidInterest(i.getPaidInterest().add(interestToPaid));

            interestAmount = interestAmount.subtract(interestToPaid);
            if (isRepayment) {
                createInterestRepaymentEvents(result.getLoan().getId(),
                        i.getNumber(),
                        interestToPaid,
                        timestamp,
                        result
                );
            }
        }
    }

    protected void processPrincipalRepaymentInternal(@NonNull List<LoanInstallment> installments, @NonNull BigDecimal principalAmount, @NonNull LocalDateTime timestamp, @NonNull RepaymentResult result, boolean isRepayment) {
        for (LoanInstallment i : installments) {
            if (principalAmount.compareTo(BigDecimal.ZERO) == 0) {
                break;
            }

            BigDecimal principalToPaid = i.getPrincipalDue();
            principalToPaid = principalToPaid.compareTo(principalAmount) > 0 ? principalAmount : principalToPaid;
            i.setPaidPrincipal(i.getPaidPrincipal().add(principalToPaid));

            principalAmount = principalAmount.subtract(principalToPaid);
            if (isRepayment) {
                createPrincipalRepaymentEvents(result.getLoan().getId(),
                        i.getNumber(),
                        principalToPaid,
                        timestamp,
                        result
                );
            }
        }
    }

    protected void createPenaltyRepaymentEvents(@NonNull Long loanId, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp, @NonNull LoanPenaltyAccount penaltyAccount, @NonNull RepaymentResult result) {
        createPenaltyRepaymentEvent(loanId,
                amount,
                timestamp,
                penaltyAccount,
                result
        );
    }

    protected void createInterestRepaymentEvents(@NonNull Long loanId, @NonNull Integer number, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp, @NonNull RepaymentResult result) {
        createInterestRepaymentEvent(loanId,
                number,
                amount,
                timestamp,
                result
        );
    }

    protected void createPrincipalRepaymentEvents(@NonNull Long loanId, @NonNull Integer number, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp, @NonNull RepaymentResult result) {
        createPrincipalRepaymentEvent(loanId,
                number,
                amount,
                timestamp,
                result
        );
    }
}

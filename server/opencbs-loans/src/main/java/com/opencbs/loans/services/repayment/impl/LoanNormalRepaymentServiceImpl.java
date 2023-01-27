package com.opencbs.loans.services.repayment.impl;

import com.opencbs.core.domain.BaseInstallment;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.RepaymentTypes;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.helpers.ActualizeHelper;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.schedulegenerators.ScheduleGenerator;
import com.opencbs.core.services.schedulegenerators.ScheduleService;
import com.opencbs.loans.annotations.repayment.DefaultRepaymentService;
import com.opencbs.loans.domain.*;
import com.opencbs.loans.dto.RepaymentResult;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.services.LoanEventService;
import com.opencbs.loans.services.LoanPenaltyEventService;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.earlyfee.EarlyFeeRepaymentService;
import com.opencbs.loans.services.repayment.LoanRepaymentService;
import com.opencbs.loans.services.repayment.RepaymentEventService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ConditionalOnMissingBean(name = "ImpactFinanceLoanNormalRepaymentServiceImpl")
@DefaultRepaymentService("NORMAL_REPAYMENT")
@Service
@RequiredArgsConstructor
public class LoanNormalRepaymentServiceImpl implements LoanRepaymentService {

    private static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_EVEN;
    private static final int DECIMAL_PLACE = 2;

    private final LoanPenaltyEventService loanPenaltyEventService;
    private final LoanService loanService;
    private final EarlyFeeRepaymentService feeRepaymentService;
    private final RepaymentHelperService repaymentHelperService;
    private final RepaymentEventService repaymentEventService;
    private final LoanInstallmentRepository loanInstallmentRepository;
    private final LoanEventService loanEventService;
    private final ScheduleService scheduleService;


    @Override
    public RepaymentSplit split(@NonNull Long loanId, @NonNull RepaymentSplit repaymentSplit) {
        if (repaymentSplit.getTotal() == null) {
            return defaultSplitInternal(loanId, repaymentSplit.getTimestamp());
        }

        return splitInternal(loanId, repaymentSplit.getTimestamp(), repaymentSplit.getTotal());
    }

    @Override
    public List<LoanInstallment> preview(Loan loan, RepaymentSplit repaymentSplit) {
        RepaymentResult result = proceedRepayment(
                RepaymentResult.builder()
                        .loan(loan)
                        .currentUser(UserHelper.getCurrentUser())
                        .timestamp(repaymentSplit.getTimestamp())
                        .build(),
                repaymentSplit,
                false,
                false
        );

        return result.getInstallments();
    }

    @Override
    public RepaymentResult repay(Loan loan, RepaymentSplit repaymentSplit) {
        RepaymentResult result = proceedRepayment(
                RepaymentResult.builder()
                        .loan(loan)
                        .currentUser(UserHelper.getCurrentUser())
                        .timestamp(repaymentSplit.getTimestamp())
                        .build(),
                repaymentSplit,
                true,
                false
        );

        return result;
    }

    @Override
    public boolean isNeedClose() {
        return true;
    }

    private RepaymentSplit defaultSplitInternal(Long loanId, LocalDateTime timestamp) {
        List<LoanInstallment> installments = loanInstallmentRepository.findByLoanIdAndDateTime(loanId, timestamp);
        ExpiredRepaymentSplit expiredRepaymentAmount = this.repaymentHelperService.getExpiredInstallmentsRepaymentAmount(
                loanId,
                installments,
                timestamp.toLocalDate()
        );

        return RepaymentSplit.builder()
                .timestamp(timestamp)
                .repaymentType(RepaymentTypes.NORMAL_REPAYMENT)
                .principal(expiredRepaymentAmount.getPrincipal())
                .interest(expiredRepaymentAmount.getInterest())
                .penalty(expiredRepaymentAmount.getPenalty())
                .total(expiredRepaymentAmount.getTotal())
                .max(this.repaymentHelperService.getEarlyTotalRepaymentAmount(loanId, installments, timestamp))
                .build();
    }

    private RepaymentSplit splitInternal(@NonNull Long loanId, @NonNull LocalDateTime timestamp, @NonNull BigDecimal totalAmount) {
        List<LoanInstallment> installments = loanInstallmentRepository.findByLoanIdAndDateTime(loanId, null);
        BigDecimal maxAmount = this.repaymentHelperService.getEarlyTotalRepaymentAmount(loanId, installments, timestamp);

        RepaymentSplit repaymentSplit = RepaymentSplit.builder()
                .timestamp(timestamp)
                .repaymentType(RepaymentTypes.NORMAL_REPAYMENT)
                .total(totalAmount)
                .max(maxAmount)
                .build();

        RepaymentResult repaymentResult = proceedRepayment(
                RepaymentResult.builder()
                        .loan(loanService.getLoanById(loanId))
                        .currentUser(UserHelper.getCurrentUser())
                        .timestamp(repaymentSplit.getTimestamp())
                        .build(),
                repaymentSplit,
                true,
                true
        );

        repaymentSplit.setPrincipal(getEventsAmount(repaymentResult.getEvents(), EventType.REPAYMENT_OF_PRINCIPAL));
        repaymentSplit.setInterest(getEventsAmount(repaymentResult.getEvents(), EventType.REPAYMENT_OF_INTEREST));
        repaymentSplit.setPenalty(getEventsAmount(repaymentResult.getEvents(), EventType.REPAYMENT_OF_PENALTY));
        repaymentSplit.setEarlyRepaymentFee(getEventsAmount(repaymentResult.getEvents(), EventType.OTHER_FEE_REPAY));

        return repaymentSplit;
    }

    private BigDecimal getEventsAmount(List<LoanEvent> events, @NonNull EventType eventType) {
        if (CollectionUtils.isEmpty(events)) {
            return BigDecimal.ZERO;
        }

        return events.stream()
                .filter(x -> x.getEventType() == eventType)
                .map(LoanEvent::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private RepaymentResult proceedRepayment(@NonNull RepaymentResult result, @NonNull RepaymentSplit repaymentSplit, boolean isRepayment, boolean preview) {
        LocalDate repaymentDate = repaymentSplit.getTimestamp().toLocalDate();
        BigDecimal totalAmount = repaymentSplit.getTotal();
        List<LoanInstallment> installments = this.detachedCopyInstallments(loanInstallmentRepository.findByLoanIdAndDateTime(result.getLoan().getId(), null));
        result.setInstallments(installments);

        // Repay expired installments
        List<LoanInstallment> expiredInstallments = InstallmentsHelper.getUnpaidInstallmentsByDate(installments, repaymentDate);
        totalAmount = this.repayPenalty(totalAmount, result, isRepayment);

        if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
            return result;
        }

        if (!expiredInstallments.isEmpty()) {
            totalAmount = this.repayExpiredInstallments(expiredInstallments, totalAmount, result, isRepayment);
        }

        if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
            return result;
        }

        // Check if loan actualized in case of early repayment
        if (isRepayment && !preview) {
            ActualizeHelper.isActualized(result.getLoan().getId(), ModuleType.LOANS, repaymentDate);
        }

        // Repay current and early installments
        Optional<LoanInstallment> currentInstallment = InstallmentsHelper.getInstalmentByMaturityDate(installments, repaymentDate);

        if (currentInstallment.isPresent()) {
            totalAmount = this.repayCurrentInstallment(currentInstallment.get(), totalAmount, result, isRepayment);

            if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
                return result;
            }

            BigDecimal earlyRepaymentFee = processEarlyRepaymentFee(totalAmount, currentInstallment.get().getOlb(), currentInstallment.get().getNumber(), isRepayment, result, false);
            totalAmount = totalAmount.subtract(earlyRepaymentFee);
            currentInstallment.get().setPrincipal(currentInstallment.get().getPrincipal().add(totalAmount));
            currentInstallment.get().setPaidPrincipal(currentInstallment.get().getPaidPrincipal().add(totalAmount));
            result.addAffectedNumber(currentInstallment.get().getNumber());

            if(isRepayment) {
                LoanEvent principalRepaymentEvent = this.repaymentEventService.getPrincipalRepaymentEvent(result.getLoan().getId(), currentInstallment.get().getNumber(), totalAmount, result.getTimestamp());
                result.addEvent(principalRepaymentEvent);
            }

            List<LoanInstallment> unpaidInstallments = InstallmentsHelper.getUnpaidInstallments(installments);
            this.reducePrincipalAndInterest(unpaidInstallments, installments, totalAmount, result);
        }
        else {
            List<LoanInstallment> unpaidInstallments = InstallmentsHelper.getUnpaidInstallments(installments);
            LoanInstallment firstUnpaidInstallment = unpaidInstallments.stream().findFirst().orElse(null);
            int earlyInstallmentNumber = 0;
            if (firstUnpaidInstallment != null) {
                earlyInstallmentNumber = firstUnpaidInstallment.getNumber();
            }
            LoanInstallment newInstallment = new LoanInstallment();
            BigDecimal paidPrincipal = new BigDecimal(0);
            BigDecimal sumOfPaidInterest = new BigDecimal(0);

            for (LoanInstallment installment : installments) {
                paidPrincipal = paidPrincipal.add(installment.getPaidPrincipal());
                sumOfPaidInterest = sumOfPaidInterest.add(installment.getPaidInterest());
            }

            BigDecimal sumOfInterestAccrual = this.loanEventService.findAllByLoanIdAndDeletedAndEventType(result.getLoan().getId(), false, EventType.ACCRUAL_OF_INTEREST)
                    .stream()
                    .filter(x -> x.getEffectiveAt().toLocalDate().isBefore(repaymentDate) || x.getEffectiveAt().toLocalDate().isEqual(repaymentDate))
                    .map(LoanEvent::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal interest = sumOfInterestAccrual.subtract(sumOfPaidInterest);
            BigDecimal paidInterest = interest.compareTo(totalAmount) > 0 ? totalAmount : interest;
            totalAmount = totalAmount.subtract(paidInterest);
            BigDecimal earlyRepaymentFee = processEarlyRepaymentFee(totalAmount, result.getLoan().getAmount().subtract(paidPrincipal), earlyInstallmentNumber, isRepayment, result, false);
            totalAmount = totalAmount.subtract(earlyRepaymentFee);

            newInstallment.setNumber(earlyInstallmentNumber);
            newInstallment.setMaturityDate(repaymentDate);
            newInstallment.setInterest(interest);
            newInstallment.setPaidInterest(paidInterest);
            newInstallment.setPrincipal(totalAmount);
            newInstallment.setPaidPrincipal(totalAmount);
            newInstallment.setOlb(result.getLoan().getAmount().subtract(paidPrincipal));
            newInstallment.setLastAccrualDate(repaymentDate);
            newInstallment.setLoanId(result.getLoan().getId());
            newInstallment.setEffectiveAt(DateHelper.getLocalDateTimeNow());
            newInstallment.setAccruedInterest(interest);

            if(isRepayment) {
                LoanEvent principalRepaymentEvent = this.repaymentEventService.getPrincipalRepaymentEvent(result.getLoan().getId(), earlyInstallmentNumber, totalAmount, result.getTimestamp());
                result.addEvent(principalRepaymentEvent);

                LoanEvent interestRepaymentEvent = this.repaymentEventService.getInterestRepaymentEvent(result.getLoan().getId(), earlyInstallmentNumber, paidInterest, result.getTimestamp());
                result.addEvent(interestRepaymentEvent);
            }

            installments.add(newInstallment);
            int number = newInstallment.getNumber();
            for (LoanInstallment installment : unpaidInstallments) {
                number++;
                installment.setNumber(number);
            }
            List<LoanInstallment> sortedInstallments = installments.stream().sorted(Comparator.comparing(BaseInstallment::getNumber)).collect(Collectors.toList());
            result.setInstallments(sortedInstallments);

            for (LoanInstallment installment : sortedInstallments) {
                result.addAffectedNumber(installment.getNumber());
            }

            if (totalAmount.compareTo(BigDecimal.ZERO) > 0) {
                unpaidInstallments.stream().findFirst().ifPresent(firstInstallment -> firstInstallment.setStartDate(newInstallment.getMaturityDate()));
                this.reducePrincipalAndInterest(unpaidInstallments, sortedInstallments, totalAmount, result);
            }
        }

        return result;
    }

    private List<LoanInstallment> detachedCopyInstallments(List<LoanInstallment> installments) {
        return installments.stream()
                .map(LoanInstallment::new)
                .collect(Collectors.toList());
    }

    private BigDecimal repayPenalty(@NonNull BigDecimal totalAmount, @NonNull RepaymentResult repaymentResult, boolean isRepayment) {
        List<LoanPenaltyAmount> penaltyAmounts = this.loanPenaltyEventService.getPenaltyAmounts(repaymentResult.getLoan().getId(), repaymentResult.getTimestamp().toLocalDate());
        for (LoanPenaltyAmount penaltyAmount : penaltyAmounts) {
            if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
                break;
            }

            BigDecimal penaltyToPaid = penaltyAmount.getAmount();
            if (penaltyToPaid.compareTo(BigDecimal.ZERO) == 0) {
                continue;
            }

            penaltyToPaid = penaltyToPaid.compareTo(totalAmount) > 0 ? totalAmount : penaltyToPaid;
            totalAmount = totalAmount.subtract(penaltyToPaid);

            if (isRepayment) {
                LoanEvent event = this.repaymentEventService.getPenaltyRepaymentEvent(repaymentResult.getLoan().getId(), penaltyAmount.getPenaltyAccount(), penaltyToPaid, repaymentResult.getTimestamp());
                repaymentResult.addEvent(event);
            }
        }

        return totalAmount;
    }

    private BigDecimal repayExpiredInstallments(@NonNull List<LoanInstallment> installments, @NonNull BigDecimal totalAmount, @NonNull RepaymentResult repaymentResult, boolean isRepayment) {
        for (LoanInstallment installment : installments) {
            totalAmount = this.repayInterest(installment, totalAmount, repaymentResult, isRepayment);
            if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
                break;
            }
            totalAmount = this.repayPrincipal(installment, totalAmount, repaymentResult, isRepayment);
            if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
                break;
            }
        }
        return totalAmount;
    }

    private BigDecimal repayCurrentInstallment(@NonNull LoanInstallment installment, @NonNull BigDecimal totalAmount, @NonNull RepaymentResult repaymentResult, boolean isRepayment) {
        totalAmount = this.repayInterest(installment, totalAmount, repaymentResult, isRepayment);
        if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
            return totalAmount;
        }
        totalAmount = this.repayPrincipal(installment, totalAmount, repaymentResult, isRepayment);
        if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
            return totalAmount;
        }
        return totalAmount;
    }

    private BigDecimal repayInterest(@NonNull LoanInstallment installment, @NonNull BigDecimal totalAmount, @NonNull RepaymentResult repaymentResult, boolean isRepayment) {
        if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
            return totalAmount;
        }

        BigDecimal sumOfInterestAccrual = this.loanEventService.findAllByLoanIdAndDeletedAndEventType(repaymentResult.getLoan().getId(), false, EventType.ACCRUAL_OF_INTEREST)
                .stream()
                .filter(x -> x.getInstallmentNumber().equals(installment.getNumber()))
                .map(LoanEvent::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal sumOfPaidInterest = this.loanEventService.findAllByLoanIdAndDeletedAndEventType(repaymentResult.getLoan().getId(), false, EventType.REPAYMENT_OF_INTEREST)
                .stream()
                .filter(x -> x.getInstallmentNumber().equals(installment.getNumber()))
                .map(LoanEvent::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal notPaidInterest = sumOfInterestAccrual.subtract(sumOfPaidInterest);
        BigDecimal interest = notPaidInterest.compareTo(totalAmount) > 0 ? totalAmount : notPaidInterest;
        if (interest.compareTo(BigDecimal.ZERO) == 0) {
            return totalAmount;
        }
        installment.setPaidInterest(installment.getPaidInterest().add(interest));
        totalAmount = totalAmount.subtract(interest);

        if (isRepayment) {
            LoanEvent event = this.repaymentEventService.getInterestRepaymentEvent(installment.getLoanId(), installment.getNumber(), interest, repaymentResult.getTimestamp());
            repaymentResult.addAffectedNumber(installment.getNumber());
            repaymentResult.addEvent(event);
        }

        return totalAmount;
    }

    private BigDecimal repayPrincipal(@NonNull LoanInstallment installment, @NonNull BigDecimal totalAmount, @NonNull RepaymentResult repaymentResult, boolean isRepayment) {
        if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
            return totalAmount;
        }

        BigDecimal principal = installment.getPrincipalDue().compareTo(totalAmount) > 0 ? totalAmount : installment.getPrincipalDue();
        if (principal.compareTo(BigDecimal.ZERO) == 0) {
            return totalAmount;
        }
        installment.setPaidPrincipal(installment.getPaidPrincipal().add(principal));
        totalAmount = totalAmount.subtract(principal);

        if(isRepayment) {
            LoanEvent event = this.repaymentEventService.getPrincipalRepaymentEvent(installment.getLoanId(), installment.getNumber(), principal, repaymentResult.getTimestamp());
            repaymentResult.addAffectedNumber(installment.getNumber());
            repaymentResult.addEvent(event);
        }

        return totalAmount;
    }

    private void reducePrincipalAndInterest(@NonNull List<LoanInstallment> unpaidInstallments, @NonNull List<LoanInstallment> installments, @NonNull BigDecimal totalAmount, @NonNull RepaymentResult result) {
        final ScheduleGenerator schedule = scheduleService.getScheduleByType(result.getLoan().getScheduleType());
        BigDecimal paidPrincipal = new BigDecimal(0);

        for (LoanInstallment installment : installments) {
            paidPrincipal = paidPrincipal.add(installment.getPaidPrincipal());
        }

        BigDecimal olb = result.getLoan().getAmount().subtract(paidPrincipal);

        for (int i = 0; i < unpaidInstallments.size(); i++) {
            if (totalAmount.compareTo(BigDecimal.ZERO) == 0) {
                break;
            }

            BigDecimal principal = unpaidInstallments.get(i).getPrincipal().compareTo(totalAmount) > 0 ? totalAmount : unpaidInstallments.get(i).getPrincipal();
            unpaidInstallments.get(i).setPrincipal(unpaidInstallments.get(i).getPrincipal().subtract(principal));

            Long days = schedule.getIfFact() ? DateHelper.daysBetween(unpaidInstallments.get(i).getStartDate(), unpaidInstallments.get(i).getMaturityDate())
                    : DateHelper.daysBetweenAs_30_360(unpaidInstallments.get(i).getStartDate(), unpaidInstallments.get(i).getMaturityDate());

            unpaidInstallments.get(i).setInterest(this.calculateInterest(result.getLoan().getId(), olb, days));
            if (i == 0) {
                unpaidInstallments.get(i).setOlb(olb);
            }
            else {
                unpaidInstallments.get(i).setOlb(unpaidInstallments.get(i - 1).getOlb().subtract(unpaidInstallments.get(i - 1).getPrincipal()));
            }
            unpaidInstallments.get(i).setAccruedInterest(BigDecimal.ZERO);
            result.addAffectedNumber(unpaidInstallments.get(i).getNumber());
            totalAmount = totalAmount.subtract(principal);
        }
    }

    private BigDecimal calculateInterest(Long loanId, BigDecimal olb, Long days) {
        BigDecimal interestRate = this.loanService.getLoanById(loanId).getInterestRate();
        BigDecimal percent = olb.multiply(interestRate.divide(BigDecimal.valueOf(100), ROUNDING_MODE))
                .multiply(BigDecimal.valueOf(days))
                .divide(BigDecimal.valueOf(360), ROUNDING_MODE)
                .setScale(DECIMAL_PLACE, ROUNDING_MODE);

        return percent;
    }

    private BigDecimal processEarlyRepaymentFee(@NonNull BigDecimal totalAmount, @NonNull BigDecimal olb, @NonNull Integer number, boolean isRepayment, @NonNull RepaymentResult result, boolean totalRepayment) {
        BigDecimal earlyRepaymentFee = getEarlyRepaymentFee(
                result.getLoan().getId(),
                result.getTimestamp(),
                totalAmount,
                olb,
                totalRepayment);

        if (isRepayment && earlyRepaymentFee.compareTo(BigDecimal.ZERO) != 0) {
            createEarlyRepaymentFeeEvent(
                    result.getLoan().getId(),
                    number,
                    earlyRepaymentFee,
                    result.getTimestamp(),
                    result,
                    totalRepayment
            );
        }

        return earlyRepaymentFee;
    }

    private BigDecimal getEarlyRepaymentFee(@NonNull Long loanId, @NonNull LocalDateTime repaymentDate, @NonNull BigDecimal totalAmount, @NonNull BigDecimal olb, boolean totalRepayment) {
        return totalRepayment
                ? feeRepaymentService.getTotalRepaymentEarlyFee(loanId, repaymentDate, totalAmount, olb)
                : feeRepaymentService.getPartialRepaymentEarlyFee(loanId, repaymentDate, totalAmount, olb);
    }

    private void createEarlyRepaymentFeeEvent(@NonNull Long loanId, @NonNull Integer number, @NonNull BigDecimal amount, @NonNull LocalDateTime timestamp, @NonNull RepaymentResult result, @NonNull Boolean isTotalRepayment) {
        LoanEvent event = repaymentEventService.getEarlyRepaymentFeeEvent(loanId, number, amount, timestamp, isTotalRepayment);
        result.addAffectedNumber(number);
        result.addEvent(event);
    }
}

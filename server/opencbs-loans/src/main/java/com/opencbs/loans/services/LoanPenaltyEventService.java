package com.opencbs.loans.services;

import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.loans.domain.LoanPenaltyAccount;
import com.opencbs.loans.domain.LoanPenaltyAmount;
import com.opencbs.loans.domain.LoanPenaltyEvent;
import com.opencbs.loans.repositories.LoanPenaltyAccountRepository;
import com.opencbs.loans.repositories.LoanPenaltyEventRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanPenaltyEventService {

    private final LoanPenaltyEventRepository loanPenaltyEventRepository;
    private final LoanPenaltyAccountRepository loanPenaltyAccountRepository;
    private final AccountingEntryService accountingEntryService;


    public List<LoanPenaltyEvent> getAllEventsByLoanId(Long loanId, Boolean showDeleted){
        return showDeleted
                ? loanPenaltyEventRepository.findByLoanId(loanId)
                : loanPenaltyEventRepository.findByLoanIdAndDeleted(loanId, Boolean.FALSE);
    }

    public List<LoanPenaltyAmount> getPenaltyAmounts(@NonNull Long loanId, @NonNull LocalDate dateTime) {
        Map<Long, List<LoanPenaltyEvent>> loanPenaltyAccrualEvents = loanPenaltyEventRepository.findByLoanIdAndEventTypeInAndEffectiveAtBeforeAndDeletedFalse(
                loanId,
                Collections.singletonList(EventType.ACCRUAL_OF_PENALTY),
                LocalDateTime.of(dateTime, LocalTime.MAX))
                .stream()
                .collect(
                        Collectors.groupingBy(
                                LoanPenaltyEvent::getLoanApplicationPenaltyId
                        )
                );

        Map<Long, List<LoanPenaltyEvent>> loanPenaltyRepaymentEvents = loanPenaltyEventRepository.findByLoanIdAndEventTypeInAndEffectiveAtBeforeAndDeletedFalse(
                loanId,
                Arrays.asList(EventType.REPAYMENT_OF_PENALTY, EventType.WRITE_OFF_PENALTY),
                LocalDateTime.of(dateTime, LocalTime.MAX))
                .stream()
                .collect(
                        Collectors.groupingBy(
                                LoanPenaltyEvent::getLoanApplicationPenaltyId
                        )
                );

        List<LoanPenaltyAccount> penaltyAccounts = loanPenaltyAccountRepository.findAllByLoanId(loanId);

        List<LoanPenaltyAmount> result = new ArrayList<>();
        for (Map.Entry<Long, List<LoanPenaltyEvent>> accrualEvents : loanPenaltyAccrualEvents.entrySet()) {
            BigDecimal accruedPenaltyAmount = accrualEvents.getValue()
                    .stream()
                    .map(LoanPenaltyEvent::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (accruedPenaltyAmount.compareTo(BigDecimal.ZERO) == 0) {
                continue;
            }

            BigDecimal paidPenaltyAmount = BigDecimal.ZERO;
            if (loanPenaltyRepaymentEvents.containsKey(accrualEvents.getKey())) {
                paidPenaltyAmount = loanPenaltyRepaymentEvents.get(accrualEvents.getKey())
                        .stream()
                        .map(LoanPenaltyEvent::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
            }

            LoanPenaltyAccount penaltyAccount = penaltyAccounts.stream()
                    .filter(x -> x.getLoanApplicationPenaltyId().equals(accrualEvents.getKey()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Loan application penalty ot found?: " + accrualEvents.getKey()));

            result.add(new LoanPenaltyAmount(accruedPenaltyAmount.subtract(paidPenaltyAmount), penaltyAccount));
        }

        return result;
    }

    public LoanPenaltyEvent save(LoanPenaltyEvent loanPenaltyEvent){
        return this.loanPenaltyEventRepository.save(loanPenaltyEvent);
    }

    public BigDecimal getPenaltyAmount(Long loanId, LocalDate localDate) {
        BigDecimal accrual  =
                this.loanPenaltyEventRepository.findByLoanIdAndEventTypeInAndEffectiveAtBeforeAndDeletedFalse(loanId, Collections.singletonList(EventType.ACCRUAL_OF_PENALTY), LocalDateTime.of(localDate, LocalTime.MAX)).stream()
                .map(LoanPenaltyEvent::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal payment  =
                this.loanPenaltyEventRepository.findByLoanIdAndEventTypeInAndEffectiveAtBeforeAndDeletedFalse(loanId, Arrays.asList(EventType.REPAYMENT_OF_PENALTY, EventType.WRITE_OFF_PENALTY), LocalDateTime.of(localDate, LocalTime.MAX)).stream()
                .map(LoanPenaltyEvent::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

         return accrual.subtract(payment);
    }

    public void rollBackPenalties(Long loanId, LocalDateTime beginDateTime, LocalDateTime endDateTime) {
        List<LoanPenaltyEvent> penaltiesEvents = this.loanPenaltyEventRepository.findAllByLoanIdAndEffectiveAtBetweenAndDeletedFalse(loanId, beginDateTime, endDateTime);
        if (!penaltiesEvents.isEmpty()) {
            penaltiesEvents.forEach(loanPenaltyEvent -> loanPenaltyEvent.setDeleted(true));
            this.loanPenaltyEventRepository.save(penaltiesEvents);
        }
    }

    public Optional<LocalDateTime> getLastEffectiveAt(Long loanId) {
        return this.loanPenaltyEventRepository.getLastEffectiveAt(loanId);
    }
}

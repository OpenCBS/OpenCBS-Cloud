package com.opencbs.loans.services.impl;

import com.opencbs.core.domain.enums.EventType;
import com.opencbs.loans.domain.LoanEventInterestAccrual;
import com.opencbs.loans.repositories.LoanEventInterestAccrualRepository;
import com.opencbs.loans.services.LoanEventInterestAccrualService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoanEventInterestAccrualServiceImpl implements LoanEventInterestAccrualService {

    private final LoanEventInterestAccrualRepository repository;


    @Override
    public LocalDateTime getDisbursementDate(@NonNull Long loanId) {
        Optional<LoanEventInterestAccrual> event = repository.findFirstByLoanIdAndEventType(loanId, EventType.DISBURSEMENT);
        if (event.isPresent()) {
            return event.get().getEffectiveAt();
        }

        throw new RuntimeException("Loan event not found for type DISBURSEMENT");
    }

    @Override
    public List<LoanEventInterestAccrual> getEvents(@NonNull Long loanId, @NonNull EventType eventType, @NonNull Integer installmentNumber) {
        return repository.findByLoanIdAndEventTypeAndInstallmentNumber(loanId, eventType, installmentNumber);
    }

}

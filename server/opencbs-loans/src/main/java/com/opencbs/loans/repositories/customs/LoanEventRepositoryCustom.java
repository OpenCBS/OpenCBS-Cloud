package com.opencbs.loans.repositories.customs;

import com.opencbs.core.domain.enums.EventType;
import com.opencbs.loans.domain.LoanEvent;

import java.time.LocalDateTime;
import java.util.List;

public interface LoanEventRepositoryCustom {

    List<LoanEvent> findAllByLoanIdAndDeletedAndEventTypeAndEffectiveAt(Long loanId, boolean isDeleted, EventType eventType, LocalDateTime localDateTime);
    List<LoanEvent> findAllByLoanIdAndEffectiveAt(Long loanId, LocalDateTime from, LocalDateTime to);
    List<LoanEvent> findAllByLoanIdAndDeletedAndEventTypeAndEffectiveAtBetween(Long loanId,boolean isDeleted, EventType eventType, LocalDateTime startPeriod, LocalDateTime endPeriod);
}

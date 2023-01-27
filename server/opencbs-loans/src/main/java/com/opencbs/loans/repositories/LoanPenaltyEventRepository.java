package com.opencbs.loans.repositories;

import com.opencbs.core.domain.enums.EventType;
import com.opencbs.loans.domain.LoanPenaltyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface LoanPenaltyEventRepository extends JpaRepository<LoanPenaltyEvent, Long> {
    List<LoanPenaltyEvent> findAllByLoanIdAndLoanApplicationPenaltyId(Long loanId, Long penaltyId);
    List<LoanPenaltyEvent> findByLoanId(Long loanId);
    List<LoanPenaltyEvent> findByLoanIdAndDeleted(Long loanId, Boolean deleted);
    List<LoanPenaltyEvent> findByLoanIdAndEventTypeInAndEffectiveAtBeforeAndDeletedFalse(Long loanId, List<EventType> eventType, LocalDateTime effectiveAt);
    List<LoanPenaltyEvent> findAllByLoanIdAndEffectiveAtBetweenAndDeletedFalse(Long loanId, LocalDateTime begin, LocalDateTime end);
    List<LoanPenaltyEvent> findAllByLoanIdAndLoanApplicationPenaltyIdAndEventTypeAndDeletedFalseAndEffectiveAtAfter(Long loanId, Long penaltyId, EventType eventType, LocalDateTime dateTime);

    @Query("select max(lpe.effectiveAt) from LoanPenaltyEvent lpe where lpe.loanId = :loanId")
    Optional<LocalDateTime> getLastEffectiveAt(@Param(value = "loanId") Long loanId);

    void deleteByIdIn(Collection<Long> ids);
}

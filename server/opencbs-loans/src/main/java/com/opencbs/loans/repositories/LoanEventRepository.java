package com.opencbs.loans.repositories;

import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.audit.LoanAuditEventIdentificator;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanRollBackEvent;
import com.opencbs.loans.repositories.customs.LoanEventRepositoryCustom;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface LoanEventRepository extends Repository<LoanEvent>, LoanEventRepositoryCustom {

    List<LoanEvent> findAllByGroupKey(Long groupKey);

    List<LoanEvent> findAllByLoanId(Long loanId);

    List<LoanEvent> findAllByLoanIdAndDeletedAndEventType(Long loanId, boolean isDeleted, EventType eventType);

    @Query("select max(le.effectiveAt) from LoanEvent le where le.loanId = :loanId and le.deleted = false")
    Optional<LocalDateTime> getLastEffectiveAt(@Param(value = "loanId") Long loanId);

    @Query("select max(le.effectiveAt) from LoanEvent le where le.loanId = :loanId and le.effectiveAt between :beginDate and :endDate and le.deleted = false")
    Optional<LocalDateTime> getMaxEffectiveAtBetweenDates(@Param(value = "loanId") Long loanId, @Param(value = "beginDate") LocalDateTime beginDate, @Param(value = "endDate") LocalDateTime endDate);

    @Query("select le.effectiveAt from LoanEvent le where le.loanId = ?1 and le.eventType = ?2 and le.deleted = false order by le.effectiveAt desc")
    Optional<LocalDateTime> getDisbursementDate(Long loanId, EventType eventType);

    @Query("select new com.opencbs.loans.audit.LoanAuditEventIdentificator(le.id, le.effectiveAt) from LoanEvent le where le.effectiveAt between ?1 and ?2 and (le.createdById = ?3 or ?3 is null) and le.system=FALSE")
    List<LoanAuditEventIdentificator> getAllByEffectiveAtBetweenAndCreatedBy(LocalDateTime fromDate, LocalDateTime toDate, Long userId);

    @Query("select new com.opencbs.loans.domain.LoanRollBackEvent(le.groupKey, MAX(le.rolledBackBy), MAX(le.rolledBackTime), SUM(le.amount)) from LoanEvent le where le.rolledBackTime between ?1 and ?2 and (le.rolledBackBy = ?3 or ?3 is null) group by le.groupKey")
    List<LoanRollBackEvent> getAllRoolbackEventsByDateAndUser(LocalDateTime fromDate, LocalDateTime toDate, Long userId);

    Boolean existsByLoanIdAndEffectiveAtAfterAndEventTypeInAndDeletedIsFalse(Long loanId, LocalDateTime dateTime, Collection<EventType> eventTypes);

    List<LoanEvent> findByLoanIdAndEventTypeInAndDeletedIsFalse(Long loanId, Collection<EventType> eventTypes);

    Optional<LoanEvent> findFirstByLoanIdAndDeletedFalseOrderByEffectiveAtDesc(Long loanId);
}

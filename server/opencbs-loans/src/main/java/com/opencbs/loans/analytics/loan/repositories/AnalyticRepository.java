package com.opencbs.loans.analytics.loan.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.analytics.loan.domain.Analytic;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

public interface AnalyticRepository extends Repository<Analytic>, AnalyticRepositoryCustom {

    String scriptDeleteFutureAnalytics = "delete from analytics_active_loans " +
            "where loan_id = :loanId and calculated_date >= :ddate ;";

    @Modifying
    @Transactional
    @Query(value = scriptDeleteFutureAnalytics, nativeQuery = true)
    void deleteFutureAnalytics(@Param("ddate") LocalDate date, @Param("loanId") Long loanId);

    Analytic getFirstByLoanIdAndCalculatedDate(long loanId, LocalDate calculatedDate);
}
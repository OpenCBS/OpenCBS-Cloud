package com.opencbs.loans.repositories;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.enums.LoanStatus;
import com.opencbs.loans.repositories.customs.LoanRepositoryCustom;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LoanRepository extends LoanRepositoryCustom, Repository<Loan> {

    Loan findByLoanApplicationIdAndProfileId(Long loanApplicationId, Long profileId);

    List<Loan> findAllByLoanApplication(LoanApplication application);

    List<Loan> findAllByProfile(Profile profile);

    String scriptActiveIds = "select id from loans where id not in ( " +
            "  select loan_id from loans_events where deleted = false " +
            "    and cast(effective_at as timestamp) <= cast(:dateTime as timestamp) " +
            "    and event_type in ('CLOSED', 'WRITE_OFF_OLB')) " +
            "  and cast(disbursement_date as date) <= cast(:dateTime as date) ;";

    @Query(value = scriptActiveIds, nativeQuery = true)
    List<BigInteger> getIdsOfActiveLoans(@Param("dateTime") LocalDateTime dateTime);

    @Query("select l.id as id from Loan l where l.status = ?1 and l.branch = ?2")
    List<Long> findIdsWhenLoanHasStatus(LoanStatus loanStatus, Branch branch);

    List<Loan> findAllByCodeIn(List<String> codes);

    Loan findByCode(String code);

    Optional<Loan> findByLoanApplication(LoanApplication loanApplication);
}

package com.opencbs.loans.repositories.customs;

import com.opencbs.loans.domain.LoanEventAccountingEntry;
import org.springframework.data.jpa.repository.JpaRepository;


public interface LoanEventAccountingEntryRepository extends JpaRepository<LoanEventAccountingEntry, Long> {
}

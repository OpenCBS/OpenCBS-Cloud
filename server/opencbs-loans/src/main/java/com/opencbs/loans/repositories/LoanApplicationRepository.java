package com.opencbs.loans.repositories;

import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.credit.lines.domain.CreditLine;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.repositories.customs.LoanApplicationRepositoryCustom;
import org.springframework.data.repository.history.RevisionRepository;

import java.util.List;
import java.util.Optional;

public interface LoanApplicationRepository extends RevisionRepository<LoanApplication, Long, Integer>,
                                                   Repository<LoanApplication>, LoanApplicationRepositoryCustom {
    List<LoanApplication> findAllByProfile(Profile profile);
    Optional<LoanApplication> findById(Long id);
    Optional<LoanApplication> findLoanApplicationByCode(String code);
    List<LoanApplication> findAllByCreditLine(CreditLine creditLine);
}

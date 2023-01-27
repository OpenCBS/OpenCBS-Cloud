package com.opencbs.loans.repositories.customs;

import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.SimplifiedLoanApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoanApplicationRepositoryCustom {
    Page<LoanApplication> findByProfile(Pageable pageable, Profile profile);
    Page<SimplifiedLoanApplication> findAllSimplifiedLoanApplication(String searchString, Pageable pageable, String order, Boolean isAsc);
}

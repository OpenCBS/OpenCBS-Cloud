package com.opencbs.loans.repositories.customs;

import com.opencbs.loans.domain.LoanAdditionalInfo;
import com.opencbs.loans.domain.SimplifiedLoan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoanRepositoryCustom {

    LoanAdditionalInfo getAdditionalInfo(Long loanId) throws Exception;
    Page<SimplifiedLoan> findAllLoans(String searchString, Pageable pageable);
}

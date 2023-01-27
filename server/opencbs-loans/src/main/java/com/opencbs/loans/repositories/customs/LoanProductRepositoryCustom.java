package com.opencbs.loans.repositories.customs;

import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.dto.requests.LoanProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoanProductRepositoryCustom {
    Page<LoanProduct> search(Pageable pageable, LoanProductRequest request);
}

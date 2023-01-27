package com.opencbs.loans.repositories;

import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.repositories.customs.LoanProductRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.history.RevisionRepository;

import java.util.Optional;

public interface LoanProductRepository extends RevisionRepository<LoanProduct, Long, Integer>, Repository<LoanProduct>, LoanProductRepositoryCustom {

    Optional<LoanProduct> findByName(String name);

    Optional<LoanProduct> findByCode(String code);

    Page<LoanProduct> findAllByStatusTypeEquals(StatusType statusType, Pageable pageable);
}
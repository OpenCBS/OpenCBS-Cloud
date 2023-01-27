package com.opencbs.savings.repositories;

import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.repositories.Repository;
import com.opencbs.savings.domain.SavingProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.history.RevisionRepository;

import java.util.List;
import java.util.Optional;

public interface SavingProductRepository extends RevisionRepository<SavingProduct, Long, Integer>, Repository<SavingProduct> {

    Optional<SavingProduct> findByName(String name);

    Optional<SavingProduct> findByCode(String code);

    Page<SavingProduct> findAllByNameContainingIgnoreCaseAndStatusTypeIn(String pattern, List<StatusType> statusTypes, Pageable pageable);
}
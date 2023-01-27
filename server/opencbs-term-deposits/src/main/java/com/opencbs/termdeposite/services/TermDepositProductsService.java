package com.opencbs.termdeposite.services;

import com.opencbs.core.services.CrudService;
import com.opencbs.core.services.audit.HistoryService;
import com.opencbs.termdeposite.domain.TermDepositProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface TermDepositProductsService extends HistoryService, CrudService<TermDepositProduct> {
    Page<TermDepositProduct> getAll(Pageable pageable, String searchString);

    TermDepositProduct save(TermDepositProduct termDepositProduct);

    Optional<TermDepositProduct> findByName(String name);

    Optional<TermDepositProduct> findByCode(String code);

    Page<TermDepositProduct> getActiveTermDepositProduct(Pageable pageable, String searchString);
}

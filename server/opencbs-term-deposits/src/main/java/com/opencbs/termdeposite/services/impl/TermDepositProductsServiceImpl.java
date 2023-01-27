package com.opencbs.termdeposite.services.impl;

import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.services.audit.BaseHistoryService;
import com.opencbs.termdeposite.domain.TermDepositProduct;
import com.opencbs.termdeposite.repositories.TermDepositProductRepository;
import com.opencbs.termdeposite.services.TermDepositProductsService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class TermDepositProductsServiceImpl extends BaseHistoryService<TermDepositProductRepository> implements TermDepositProductsService {

    private final TermDepositProductRepository termDepositProductRepository;


    @Autowired
    public TermDepositProductsServiceImpl(TermDepositProductRepository termDepositProductRepository) {
        super(termDepositProductRepository);
        this.termDepositProductRepository = termDepositProductRepository;
    }

    @Override
    public Page getAll(Pageable pageable, String searchString) {
        if (searchString == null) {
            return this.termDepositProductRepository.findAll(pageable);
        }
        List<StatusType> statusTypes = Arrays.asList(StatusType.values());
        return this.termDepositProductRepository.findAllByNameIgnoreCaseContainingAndStatusTypeIn(pageable, searchString, statusTypes);
    }

    @Override
    public Optional<TermDepositProduct> getOne(@NonNull Long id) {
        return Optional.of(termDepositProductRepository.getOne(id));
    }

    @Override
    public TermDepositProduct update(TermDepositProduct termDepositProduct) {
        return this.termDepositProductRepository.save(termDepositProduct);
    }

    @Override
    public TermDepositProduct save(TermDepositProduct termDepositProduct) {
        return this.termDepositProductRepository.save(termDepositProduct);
    }

    @Override
    public Optional<TermDepositProduct> findByName(String name) {
        return termDepositProductRepository.findByName(name);
    }

    @Override
    public Optional<TermDepositProduct> findByCode(String code) {
        return termDepositProductRepository.findByCode(code);
    }

    @Override
    public Page<TermDepositProduct> getActiveTermDepositProduct(Pageable pageable, String searchString) {
        List<StatusType> statusTypes = Collections.singletonList(StatusType.ACTIVE);
        if (StringUtils.isEmpty(searchString)) {
            searchString = "";
        }
        return this.termDepositProductRepository.findAllByNameIgnoreCaseContainingAndStatusTypeIn(pageable, searchString, statusTypes);
    }

    @Override
    public TermDepositProduct create(TermDepositProduct termDepositProduct) {
        return this.save(termDepositProduct);
    }

    @Override
    public List<TermDepositProduct> findAll() {
        return this.termDepositProductRepository.findAll();
    }

    @Override
    public Boolean isRequestSupported(RequestType requestType) {
        return RequestType.TERM_DEPOSIT_PRODUCT_EDIT.equals(requestType) || RequestType.TERM_DEPOSIT_PRODUCT_CREATE.equals(requestType);
    }

    @Override
    public Class getTargetClass() {
        return TermDepositProduct.class;
    }
}

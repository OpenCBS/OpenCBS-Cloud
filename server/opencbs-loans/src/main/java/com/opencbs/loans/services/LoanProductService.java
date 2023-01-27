package com.opencbs.loans.services;

import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.services.CrudService;
import com.opencbs.core.services.audit.BaseHistoryService;
import com.opencbs.core.services.audit.HistoryService;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.dto.requests.LoanProductRequest;
import com.opencbs.loans.repositories.LoanProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class LoanProductService extends BaseHistoryService<LoanProductRepository> implements CrudService<LoanProduct>, HistoryService {

    private final LoanProductRepository loanProductRepository;


    @Autowired
    public LoanProductService(LoanProductRepository loanProductRepository) {
        super(loanProductRepository);
        this.loanProductRepository = loanProductRepository;
    }

    public Page<LoanProduct> findAll(Pageable pageable) {
        return this.loanProductRepository.findAll(pageable);
    }

    public Optional<LoanProduct> getOne(Long id) {
        return Optional.ofNullable(this.loanProductRepository.findOne(id));
    }

    public Optional<LoanProduct> findByName(String name) {
        return this.loanProductRepository.findByName(name);
    }

    public Optional<LoanProduct> findByCode(String code) {
        return this.loanProductRepository.findByCode(code);
    }

    @Transactional
    public LoanProduct create(LoanProduct loanProduct) {
        loanProduct.setId(null);
        return this.loanProductRepository.save(loanProduct);
    }

    @Transactional
    public LoanProduct update(LoanProduct loanProduct) {
        return this.loanProductRepository.save(loanProduct);
    }

    public Page<LoanProduct> lookup(Pageable pageable, LoanProductRequest request) {
        if (request.getSearch() == null && request.getAvailability() == null){
            return this.findActiveLoanProduct(pageable);
        }
        request.getStatusTypes().add(StatusType.ACTIVE);
        return this.loanProductRepository.search(pageable, request);
    }

    public Page<LoanProduct> findActiveLoanProduct(Pageable pageable) {
        return this.loanProductRepository.findAllByStatusTypeEquals(StatusType.ACTIVE, pageable);
    }

    public List<LoanProduct> findAll() {
        return this.loanProductRepository.findAll();
    }

    @Override
    public Boolean isRequestSupported(RequestType requestType) {
        return RequestType.LOAN_PRODUCT_CREATE.equals(requestType) || RequestType.LOAN_PRODUCT_EDIT.equals(requestType) ;
    }

    @Override
    public Class getTargetClass() {
        return LoanProduct.class;
    }
}

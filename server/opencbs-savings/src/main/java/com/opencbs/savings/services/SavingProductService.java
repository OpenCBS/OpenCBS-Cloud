package com.opencbs.savings.services;

import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.services.CrudService;
import com.opencbs.core.services.audit.BaseHistoryService;
import com.opencbs.core.services.audit.HistoryService;
import com.opencbs.savings.domain.SavingProduct;
import com.opencbs.savings.repositories.SavingProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class SavingProductService extends BaseHistoryService<SavingProductRepository> implements CrudService<SavingProduct>, HistoryService {

    private final SavingProductRepository savingProductRepository;

    @Autowired
    public SavingProductService(SavingProductRepository savingProductRepository) {
        super(savingProductRepository);
        this.savingProductRepository = savingProductRepository;
    }

    public Page<SavingProduct> searchActiveProductsByString(Pageable pageable, String search) {
        List<StatusType> statusTypes = Collections.singletonList(StatusType.ACTIVE);
        if (StringUtils.isEmpty(search) ){
            search = "";
        }
        return this.savingProductRepository.findAllByNameContainingIgnoreCaseAndStatusTypeIn(search, statusTypes, pageable);
    }

    public Optional<SavingProduct> getOne(Long id) {
        return Optional.ofNullable(this.savingProductRepository.findOne(id));
    }

    public Optional<SavingProduct> findByName(String name) {
        return this.savingProductRepository.findByName(name);
    }

    public Optional<SavingProduct> findByCode(String code) {
        return this.savingProductRepository.findByCode(code);
    }

    @Transactional
    public SavingProduct create(SavingProduct savingProduct) {
        savingProduct.setId(null);
        return this.savingProductRepository.save(savingProduct);
    }

    @Override
    public List<SavingProduct> findAll() {
        return this.savingProductRepository.findAll();
    }

    @Transactional
    public SavingProduct update(SavingProduct savingProduct) {
        return this.savingProductRepository.save(savingProduct);
    }

    public Page<SavingProduct> findAll(Pageable pageable) {
        return this.savingProductRepository.findAll(pageable);
    }

    @Override
    public Boolean isRequestSupported(RequestType requestType) {
        return RequestType.SAVING_PRODUCT_EDIT.equals(requestType) || RequestType.SAVING_PRODUCT_CREATE.equals(requestType);
    }

    @Override
    public Class getTargetClass() {
        return SavingProduct.class;
    }
}
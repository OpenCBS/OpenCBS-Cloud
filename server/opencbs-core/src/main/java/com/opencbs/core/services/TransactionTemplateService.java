package com.opencbs.core.services;

import com.opencbs.core.domain.TransactionTemplate;
import com.opencbs.core.repositories.TransactionTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class TransactionTemplateService {

    private final TransactionTemplateRepository transactionTemplateRepository;

    public Optional<TransactionTemplate> findByName(String name) {
        return this.transactionTemplateRepository.findByName(name);
    }

    public Optional<TransactionTemplate> findById(Long id) {
        return Optional.of(this.transactionTemplateRepository.findOne(id));
    }

    @Transactional
    public TransactionTemplate create(TransactionTemplate transactionTemplate) {
        transactionTemplate.setId(null);
        return this.transactionTemplateRepository.save(transactionTemplate);
    }

    @Transactional
    public TransactionTemplate update(TransactionTemplate transactionTemplate) {
        return this.transactionTemplateRepository.save(transactionTemplate);
    }

    public Page<TransactionTemplate> findAll(Pageable pageable) {
        return this.transactionTemplateRepository.findAll(pageable);
    }

    public Page<TransactionTemplate> search(String search, Pageable pageable) {
        if (StringUtils.isEmpty(search)){
            return this.transactionTemplateRepository.findAll(pageable);
        }

        return this.transactionTemplateRepository.findByNameLike(search, pageable);
    }
}

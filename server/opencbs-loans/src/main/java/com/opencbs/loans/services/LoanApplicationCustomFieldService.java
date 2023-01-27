package com.opencbs.loans.services;

import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.services.customFields.CustomFieldService;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomField;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomFieldValue;
import com.opencbs.loans.repositories.LoanApplicationCustomFieldRepository;
import com.opencbs.loans.repositories.LoanApplicationCustomFieldValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoanApplicationCustomFieldService extends CustomFieldService<LoanApplicationCustomField,
        LoanApplicationCustomFieldValue,
        LoanApplicationCustomFieldRepository,
        LoanApplicationCustomFieldValueRepository> {

    private final LoanApplicationCustomFieldValueRepository loanApplicationCustomFieldValueRepository;
    private final LoanApplicationCustomFieldRepository loanApplicationCustomFieldRepository;

    @Autowired
    LoanApplicationCustomFieldService(LoanApplicationCustomFieldRepository repository,
                                      LoanApplicationCustomFieldValueRepository customFieldValueRepository) {
        super(repository, customFieldValueRepository);
        this.loanApplicationCustomFieldValueRepository = customFieldValueRepository;
        this.loanApplicationCustomFieldRepository = repository;
    }

    public List<LoanApplicationCustomFieldValue> findByLoanApplication(LoanApplication loanApplication) {
        return this.loanApplicationCustomFieldValueRepository.findAllByOwner(loanApplication);
    }

    public Optional<LoanApplicationCustomFieldValue> findOneByFieldIdAndValueAndStatus(Long id, String value, EntityStatus status) {
        return this.loanApplicationCustomFieldValueRepository.findOneByCustomFieldIdAndValueAndStatus(id, value, status);
    }

    public Optional<LoanApplicationCustomField> findOne(Long id) {
        return Optional.ofNullable(this.loanApplicationCustomFieldRepository.findOne(id));
    }
}

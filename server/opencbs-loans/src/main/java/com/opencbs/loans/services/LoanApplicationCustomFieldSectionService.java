package com.opencbs.loans.services;

import com.opencbs.core.services.customFields.CustomFieldSectionService;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomFieldSection;
import com.opencbs.loans.repositories.LoanApplicationCustomFieldSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoanApplicationCustomFieldSectionService extends CustomFieldSectionService<LoanApplicationCustomFieldSection, LoanApplicationCustomFieldSectionRepository> {

    @Autowired
    public LoanApplicationCustomFieldSectionService(LoanApplicationCustomFieldSectionRepository repository) {
        super(repository);
    }
}

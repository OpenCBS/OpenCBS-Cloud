package com.opencbs.core.services.customFields;

import com.opencbs.core.domain.customfields.CompanyCustomField;
import com.opencbs.core.domain.customfields.CompanyCustomFieldValue;
import com.opencbs.core.repositories.customFields.CompanyCustomFieldRepository;
import com.opencbs.core.repositories.customFields.CompanyCustomFieldValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyCustomFieldService extends CustomFieldService<CompanyCustomField,
        CompanyCustomFieldValue,
        CompanyCustomFieldRepository,
        CompanyCustomFieldValueRepository> {

    @Autowired
    public CompanyCustomFieldService(CompanyCustomFieldRepository repository, CompanyCustomFieldValueRepository customFieldValueRepository) {
        super(repository, customFieldValueRepository);
    }
}

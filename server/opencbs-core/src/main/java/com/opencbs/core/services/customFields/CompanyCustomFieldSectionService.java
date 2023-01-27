package com.opencbs.core.services.customFields;

import com.opencbs.core.domain.customfields.CompanyCustomFieldSection;
import com.opencbs.core.repositories.customFields.CompanyCustomFieldSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyCustomFieldSectionService extends CustomFieldSectionService<CompanyCustomFieldSection, CompanyCustomFieldSectionRepository> {

    @Autowired
    public CompanyCustomFieldSectionService(CompanyCustomFieldSectionRepository repository) {
        super(repository);
    }
}

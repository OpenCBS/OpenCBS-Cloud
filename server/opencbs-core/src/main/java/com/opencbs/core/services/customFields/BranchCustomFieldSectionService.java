package com.opencbs.core.services.customFields;

import com.opencbs.core.domain.customfields.BranchCustomFieldSection;
import com.opencbs.core.repositories.customFields.BranchCustomFieldSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BranchCustomFieldSectionService extends CustomFieldSectionService<BranchCustomFieldSection, BranchCustomFieldSectionRepository>{

    @Autowired
    public BranchCustomFieldSectionService(BranchCustomFieldSectionRepository repository) {
        super(repository);
    }
}

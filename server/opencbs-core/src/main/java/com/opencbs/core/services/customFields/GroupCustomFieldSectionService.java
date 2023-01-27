package com.opencbs.core.services.customFields;

import com.opencbs.core.domain.customfields.GroupCustomFieldSection;
import com.opencbs.core.repositories.customFields.GroupCustomFieldSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupCustomFieldSectionService extends CustomFieldSectionService<GroupCustomFieldSection, GroupCustomFieldSectionRepository> {

    @Autowired
    public GroupCustomFieldSectionService(GroupCustomFieldSectionRepository repository) {
        super(repository);
    }
}

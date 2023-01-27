package com.opencbs.core.services.customFields;

import com.opencbs.core.domain.customfields.GroupCustomField;
import com.opencbs.core.domain.customfields.GroupCustomFieldValue;
import com.opencbs.core.repositories.customFields.GroupCustomFieldRepository;
import com.opencbs.core.repositories.customFields.GroupCustomFieldValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupCustomFieldService extends CustomFieldService<GroupCustomField,
        GroupCustomFieldValue,
        GroupCustomFieldRepository,
        GroupCustomFieldValueRepository> {

    @Autowired
    public GroupCustomFieldService(GroupCustomFieldRepository repository,
                                   GroupCustomFieldValueRepository customFieldValueRepository) {
        super(repository, customFieldValueRepository);
    }
}

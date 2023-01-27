package com.opencbs.core.repositories.customFields;

import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.GroupCustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.repositories.CustomFieldValueRepository;

public interface GroupCustomFieldValueRepository extends CustomFieldValueRepository<GroupCustomFieldValue> {

    Boolean existsByCustomFieldAndStatus(CustomField customField, EntityStatus entityStatus);
}

package com.opencbs.core.repositories.customFields;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.customfields.BranchCustomFieldValue;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.repositories.CustomFieldValueRepository;

public interface BranchCustomFieldValueRepository extends CustomFieldValueRepository<BranchCustomFieldValue> {

    BranchCustomFieldValue findByOwnerAndCustomField(Branch branch, CustomField customField);
    Boolean existsByCustomFieldAndStatus(CustomField customField, EntityStatus entityStatus);
}

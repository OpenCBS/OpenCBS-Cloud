package com.opencbs.core.repositories.customFields;

import com.opencbs.core.domain.customfields.CompanyCustomFieldValue;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.repositories.CustomFieldValueRepository;

public interface CompanyCustomFieldValueRepository extends CustomFieldValueRepository<CompanyCustomFieldValue> {

    CompanyCustomFieldValue findByOwnerAndCustomField(Profile profile, CustomField customField);

    Boolean existsByCustomFieldAndStatus(CustomField customField, EntityStatus entityStatus);
}

package com.opencbs.core.repositories.customFields;

import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.PersonCustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.repositories.CustomFieldValueRepository;

public interface PersonCustomFieldValueRepository extends CustomFieldValueRepository<PersonCustomFieldValue> {

    PersonCustomFieldValue findByOwnerAndCustomField(Profile profile, CustomField customField);
    Boolean existsByCustomFieldAndStatus(CustomField customField, EntityStatus entityStatus);
}

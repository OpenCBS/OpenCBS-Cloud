package com.opencbs.loans.repositories;

import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.repositories.CustomFieldValueRepository;
import com.opencbs.loans.domain.customfields.CollateralCustomFieldValue;

public interface TypeOfCollateralCustomFieldValueRepository extends CustomFieldValueRepository<CollateralCustomFieldValue> {

    Boolean existsByCustomFieldAndStatus(CustomField customField, EntityStatus entityStatus);
}

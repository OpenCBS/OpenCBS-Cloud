package com.opencbs.loans.repositories;

import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.repositories.CustomFieldValueRepository;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomFieldValue;

import java.util.List;
import java.util.Optional;

public interface LoanApplicationCustomFieldValueRepository extends CustomFieldValueRepository<LoanApplicationCustomFieldValue> {

    List<LoanApplicationCustomFieldValue> findAllByOwner(LoanApplication loanApplication);

    Optional<LoanApplicationCustomFieldValue> findOneByCustomFieldIdAndValueAndStatus(Long id, String value, EntityStatus status);

    Boolean existsByCustomFieldAndStatus(CustomField customField, EntityStatus entityStatus);
}

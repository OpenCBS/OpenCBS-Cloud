package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.validators.customfields.CustomFieldDtoValidator;
import com.opencbs.core.validators.customfields.CustomFieldValidator;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomField;
import com.opencbs.loans.repositories.LoanApplicationCustomFieldRepository;
import com.opencbs.loans.repositories.LoanApplicationCustomFieldValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;


@Validator
public class LoanApplicationCustomFieldDtoValidator extends CustomFieldDtoValidator implements CustomFieldValidator {

    private final LoanApplicationCustomFieldValueRepository loanApplicationCustomFieldValueRepository;

    @Autowired
    public LoanApplicationCustomFieldDtoValidator(LoanApplicationCustomFieldRepository loanApplicationCustomFieldRepository,
                                                  LoanApplicationCustomFieldValueRepository loanApplicationCustomFieldValueRepository) {
        super(loanApplicationCustomFieldRepository);
        this.loanApplicationCustomFieldValueRepository = loanApplicationCustomFieldValueRepository;
    }

    public void validateOnEdit(LoanApplicationCustomField loanApplicationCustomField, CustomFieldDto customFieldDto) {
        if (this.loanApplicationCustomFieldValueRepository.existsByCustomFieldAndStatus(loanApplicationCustomField, EntityStatus.LIVE)) {
            Assert.isTrue(loanApplicationCustomField.getFieldType().equals(customFieldDto.getFieldType()), "You cannot change custom field type");
            Assert.isTrue(loanApplicationCustomField.isUnique() == customFieldDto.isUnique(), "You cannot edit custom field uniqueness");
        }
    }
}

package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.customfields.PersonCustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.services.customFields.PersonCustomFieldService;
import com.opencbs.loans.dto.impotrpaymenthistory.ImportPaymentHistoryDto;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@RequiredArgsConstructor
@Validator
public class ImportPaymentHistoryDtoValidator {

    private final PersonCustomFieldService personCustomFieldService;

    public void validate(ImportPaymentHistoryDto dto) {
        Optional<PersonCustomFieldValue> oneByFieldIdAndStatusAndValue =
                personCustomFieldService.findOneByFieldIdAndStatusAndValue(
                        personCustomFieldService.findByName("passport").get().getId(),
                        EntityStatus.LIVE, dto.getFormattedNumber());
        if (!oneByFieldIdAndStatusAndValue.isPresent()) {
            throw new ResourceNotFoundException("Contract not found!");
        }
    }
}

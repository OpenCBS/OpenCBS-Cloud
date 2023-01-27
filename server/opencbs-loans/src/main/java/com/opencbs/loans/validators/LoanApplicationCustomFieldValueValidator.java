package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomField;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomFieldValue;
import com.opencbs.loans.services.LoanApplicationCustomFieldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Validator
public class LoanApplicationCustomFieldValueValidator {

    private final LoanApplicationCustomFieldService loanApplicationCustomFieldService;

    @Autowired
    public LoanApplicationCustomFieldValueValidator(LoanApplicationCustomFieldService loanApplicationCustomFieldService) {
        this.loanApplicationCustomFieldService = loanApplicationCustomFieldService;
    }

    public void validate(List<LoanApplicationCustomFieldValue> loanApplicationCustomFieldValues, List<LoanApplicationCustomFieldValue> loanApplicationCustomFieldOldValues) {
        for (LoanApplicationCustomFieldValue loanApplicationCustomFieldValue : loanApplicationCustomFieldValues) {
            Optional<LoanApplicationCustomField> loanApplicationCustomField = loanApplicationCustomFieldService.
                    findOne(loanApplicationCustomFieldValue.getCustomField().getId());
            Assert.isTrue(loanApplicationCustomField.isPresent(),
                    String.format("Value for custom field {id: %d} not found.",
                            loanApplicationCustomField.get().getId()));
            Optional<LoanApplicationCustomFieldValue> loanApplicationCustomFieldOldValueOptional =
                    loanApplicationCustomFieldOldValues.stream()
                            .filter(o -> {
                                return o.getCustomField().getId().equals(loanApplicationCustomField.get().getId());
                            })
            .findFirst();
            this.validate(
                    loanApplicationCustomFieldValue,
                    loanApplicationCustomField.get(),
                    loanApplicationCustomFieldOldValueOptional
            );
        }
    }

    private void validate(LoanApplicationCustomFieldValue loanApplicationCustomFieldValue,
                          LoanApplicationCustomField loanApplicationCustomField,
                          Optional<LoanApplicationCustomFieldValue> loanApplicationCustomFieldOldValueOptional) {
        boolean isEmpty = StringUtils.isEmpty(loanApplicationCustomFieldValue.getValue());
        boolean isRequired = loanApplicationCustomField.isRequired();
        boolean isRequiredAndEmpty = isEmpty && isRequired;
        Assert.isTrue(!isRequiredAndEmpty, String.format("Value for custom field {id: %d} is required.", loanApplicationCustomField.getId()));

        if (isEmpty) return;

        if (loanApplicationCustomField.isUnique()) {
            Optional<LoanApplicationCustomFieldValue> uniqueCustomFieldValue =
                    loanApplicationCustomFieldService.findOneByFieldIdAndValueAndStatus(
                            loanApplicationCustomField.getId(),
                            loanApplicationCustomFieldValue.getValue(),
                            EntityStatus.LIVE);

            if (loanApplicationCustomFieldOldValueOptional.isPresent()) {
                LoanApplicationCustomFieldValue loanApplicationCustomFieldOldValue;
                loanApplicationCustomFieldOldValue = loanApplicationCustomFieldOldValueOptional.get();
                if (isCustomFieldItSelf(uniqueCustomFieldValue, loanApplicationCustomFieldOldValue)) return;
            }

            if (uniqueCustomFieldValue.isPresent()) {
                throw new IllegalArgumentException("Custom field with Name: " + loanApplicationCustomField.getCaption() + " should be unique.");
            }
        }
    }

    private boolean isCustomFieldItSelf(Optional<LoanApplicationCustomFieldValue> newCustomFieldValue, LoanApplicationCustomFieldValue oldCustomFieldValue) {
        if(!newCustomFieldValue.isPresent()){
            return false;
        }
        return newCustomFieldValue.get().getOwner().getId().equals(oldCustomFieldValue.getOwner().getId());
    }
}

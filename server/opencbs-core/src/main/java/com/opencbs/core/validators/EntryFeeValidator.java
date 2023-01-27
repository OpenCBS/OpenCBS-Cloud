package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.EntryFee;
import com.opencbs.core.dto.CreateEntryFeeDto;
import com.opencbs.core.repositories.EntryFeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.util.Optional;

@Validator
@RequiredArgsConstructor
public class EntryFeeValidator extends BaseValidator {

    private final EntryFeeRepository entryFeeRepository;


    public void validate(CreateEntryFeeDto entryFee) {
        stringIsNotEmpty(entryFee.getName(), "Name is required.");
        Optional<EntryFee> fee = this.entryFeeRepository.findByName(entryFee.getName());
        fee.ifPresent(entryFee1 -> Assert.isTrue(fee.get().getId() == entryFee.getId(), "The name of entry fee is taken"));

        Assert.notNull(entryFee.getMaxValue(), "Maximum value is required.");
        Assert.isTrue(entryFee.getMaxValue().compareTo(BigDecimal.ZERO) > 0, "The maximum value must be greater than zero.");
        Assert.isTrue(entryFee.getMaxValue().precision() - entryFee.getMaxValue().scale() <= 8, "The maximum allowed number must be less than 10000000.");

        Assert.notNull(entryFee.getMinValue(), "Minimum value is required.");
        Assert.isTrue(entryFee.getMinValue().compareTo(BigDecimal.ZERO) >= 0, "The minimum value must be non-negative.");
        Assert.isTrue(entryFee.getMinValue().precision() - entryFee.getMinValue().scale() <= 8, "The maximum allowed number must be less than 10000000.");
        Assert.isTrue(entryFee.getMinValue().compareTo(entryFee.getMaxValue()) <= 0,
                "The minimum value must be less than or equal to the maximum value.");

        Assert.notNull(entryFee.getAccountId(), "Account is required.");

        if (entryFee.isPercentage()) {
            Assert.isTrue(entryFee.getMaxValue().compareTo(BigDecimal.valueOf(100)) <= 0, "The maximum value can not exceed 100.");
        }

        if (entryFee.getMinLimit() != null) {
            Assert.isTrue(entryFee.getMinLimit().precision() - entryFee.getMinValue().scale() <= 8, "The minimum allowed number must be less than 10000000.");
            Assert.isTrue(entryFee.getMinLimit().compareTo(BigDecimal.ZERO) >= 0, "The minimum limit value must be non-negative.");
        }

        if (entryFee.getMaxLimit() != null) {
            Assert.isTrue(entryFee.getMaxLimit().precision() - entryFee.getMaxLimit().scale() <= 8, "The maximum allowed number must be less than 10000000.");
            Assert.isTrue(entryFee.getMaxLimit().compareTo(BigDecimal.ZERO) >= 0, "The maximum limit value must be non-negative.");
        }

        if (entryFee.getMinLimit() != null && entryFee.getMaxLimit() != null) {
            Assert.isTrue(entryFee.getMinLimit().compareTo(entryFee.getMaxLimit()) <= 0,
                    "The minimum limit must be less than or equal to the maximum limit.");
        }
    }
}

package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.loans.domain.customfields.TypeOfCollateral;
import com.opencbs.loans.dto.CollateralUpdateDto;
import com.opencbs.loans.services.TypeOfCollateralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Validator
public class CollateralDtoValidator {

    private final TypeOfCollateralService typeOfCollateralService;

    @Autowired
    public CollateralDtoValidator(TypeOfCollateralService typeOfCollateralService) {
        this.typeOfCollateralService = typeOfCollateralService;
    }

    public void validate(CollateralUpdateDto collateralUpdateDto) {
        Assert.isTrue(!StringUtils.isEmpty(collateralUpdateDto.getName()), "Name is required.");
        Assert.isTrue(!StringUtils.isEmpty(collateralUpdateDto.getName().trim()), "Name is required.");
        Assert.notNull(collateralUpdateDto.getTypeOfCollateralId(), "Type of collateral is required.");
        Optional<TypeOfCollateral> typeOfCollateral = typeOfCollateralService.findOne(collateralUpdateDto.getTypeOfCollateralId());
        Assert.isTrue(typeOfCollateral.isPresent(), String.format("Type of collateral not found (ID=%d).", collateralUpdateDto.getTypeOfCollateralId()));
    }
}

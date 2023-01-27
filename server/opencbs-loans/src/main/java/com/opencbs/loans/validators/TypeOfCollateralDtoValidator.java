package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.dto.UpdateCustomFieldSectionDto;
import com.opencbs.loans.domain.customfields.TypeOfCollateral;
import com.opencbs.loans.repositories.TypeOfCollateralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Validator
public class TypeOfCollateralDtoValidator {
    private final TypeOfCollateralRepository typeOfCollateralRepository;

    @Autowired
    public TypeOfCollateralDtoValidator(TypeOfCollateralRepository typeOfCollateralRepository){
        this.typeOfCollateralRepository = typeOfCollateralRepository;
    }

    public void validate(UpdateCustomFieldSectionDto updateDto){
        Assert.isTrue(!StringUtils.isEmpty(updateDto.getCaption()), "Caption is required.");
        Assert.isTrue(!this.typeOfCollateralRepository.findByCaption(updateDto.getCaption()).isPresent(), "Type of collateral caption must be unique.");
    }

    public void validateOnUpdate(UpdateCustomFieldSectionDto updateDto, TypeOfCollateral typeOfCollateral) {
        Assert.isTrue(!StringUtils.isEmpty(updateDto.getCaption()), "Caption is required.");
        Optional<TypeOfCollateral> typeOfCollateralByCaption = this.typeOfCollateralRepository.findByCaption(updateDto.getCaption());
        if(typeOfCollateralByCaption.isPresent())
            Assert.isTrue(typeOfCollateralByCaption.get().getId().equals(typeOfCollateral.getId()), "Type of collateral caption must be unique.");
    }
}

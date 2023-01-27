package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.OtherFee;
import com.opencbs.core.dto.CreateOtherFeeDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.services.OtherFeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import java.util.Optional;

@Validator
public class OtherFeeValidation extends BaseValidator {
    private final OtherFeeService otherFeeService;

    @Autowired
    public OtherFeeValidation(OtherFeeService otherFeeService) {this.otherFeeService = otherFeeService;}

    public void validateOnCreate(CreateOtherFeeDto otherFeeDto){
        this.baseValidate(otherFeeDto);
        boolean nameIsTaken = this.otherFeeService.getByName(otherFeeDto.getName()).isPresent();
        Assert.isTrue(!nameIsTaken,"The name of other fee is already taken");
    }

    public void validateOnUpdate(CreateOtherFeeDto otherFeeDto, long id) throws ResourceNotFoundException{
        this.baseValidate(otherFeeDto);
        if(!otherFeeService.getById(id).isPresent()){
            throw new ResourceNotFoundException(String.format("Other fee not found (ID=%d)", id));
        }

        Optional<OtherFee> otherFee = this.otherFeeService.getByName(otherFeeDto.getName());
        if(otherFee.isPresent()) {
            Assert.isTrue(otherFee.get().getId() == id, "The name of other fee is already taken");
        }
    }

    private void baseValidate(CreateOtherFeeDto otherFeeDto){
        stringIsNotEmpty(otherFeeDto.getName(), "Name is required");
        Assert.notNull(otherFeeDto.getChargeAccountId(), "Charge account is required");
        Assert.notNull(otherFeeDto.getIncomeAccountId(), "Income account is required");
        Assert.notNull(otherFeeDto.getExpenseAccountId(),"Expense account is required");
    }
}
package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.dto.BranchUpdateDto;
import com.opencbs.core.services.BranchService;
import com.opencbs.core.validators.customfields.BranchCustomFieldValueDtoValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;

import java.util.Optional;

@RequiredArgsConstructor
@Validator
public class BranchDtoValidator {

    private final BranchService branchService;
    private final BranchCustomFieldValueDtoValidator branchCustomFieldValueDtoValidator;

    public void validate(BranchUpdateDto branchDto, Long branchId) {
        this.branchCustomFieldValueDtoValidator.validate(branchDto.getFieldValues(), branchId);
    }

    public void validateOnUpdate(BranchUpdateDto branchDto, Long id) {
        this.validate(branchDto, id);
        Optional<Branch> branchByName = this.branchService.findByName(branchDto.getName());
        Assert.isTrue(!branchByName.isPresent() || branchByName.get().getId().equals(id), "Branch name already taken.");
    }

    public void validateOnCreate(BranchUpdateDto branchDto) {
        this.validate(branchDto, (long) 0);
        Assert.isTrue(!this.branchService.findByName(branchDto.getName()).isPresent(), "Branch name already taken.");
    }
}

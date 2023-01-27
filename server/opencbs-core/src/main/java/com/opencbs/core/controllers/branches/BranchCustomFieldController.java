package com.opencbs.core.controllers.branches;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.customfields.BranchCustomField;
import com.opencbs.core.domain.customfields.BranchCustomFieldSection;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.customFields.BranchCustomFieldMapper;
import com.opencbs.core.services.customFields.BranchCustomFieldService;
import com.opencbs.core.validators.customfields.BranchCustomFieldDtoValidator;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/branches/custom-fields")
public class BranchCustomFieldController extends BaseController {

    private final BranchCustomFieldDtoValidator customFieldDtoValidator;
    private final BranchCustomFieldMapper branchCustomFieldMapper;
    private final BranchCustomFieldService branchCustomFieldService;

    @RequestMapping(method = RequestMethod.POST)
    public List<CustomFieldSectionDto> create(@RequestBody CustomFieldDto customFieldDto) {
        this.customFieldDtoValidator.validate(customFieldDto);
        BranchCustomField branchCustomField = new BranchCustomField();
        branchCustomField = this.branchCustomFieldMapper.zip(branchCustomField, customFieldDto);
        branchCustomField.setSection(this.branchCustomFieldService.getSection(customFieldDto.getSectionId()));

        this.branchCustomFieldService.create(branchCustomField);
        return this.branchCustomFieldService.getSections();
    }

    @RequestMapping(path = "/{id}", method = PUT)
    public List<CustomFieldSectionDto> edit(@PathVariable long id, @RequestBody CustomFieldDto customFieldDto) {
        BranchCustomField branchCustomField = this.branchCustomFieldService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("CustomField not found (ID=%d).", id)));
        customFieldDto.setId(id);
        this.customFieldDtoValidator.validateOnEdit(branchCustomField, customFieldDto);
        this.customFieldDtoValidator.validate(customFieldDto);

        int oldOrder = branchCustomField.getOrder();
        BranchCustomFieldSection newSection = this.branchCustomFieldService.getSection(customFieldDto.getSectionId());
        branchCustomField = this.branchCustomFieldMapper.zip(branchCustomField, customFieldDto);

        if(!branchCustomField.getSection().getId().equals(newSection.getId())) {
            branchCustomField.setOrder(oldOrder);
            this.branchCustomFieldService.updateWithSection(branchCustomField, newSection);
        } else {
            this.branchCustomFieldService.updateInsideSection(branchCustomField, oldOrder);
        }

        return this.branchCustomFieldService.getSections();
    }

    @DeleteMapping(value = "/{fieldId}")
    public void deleteCustomField(@PathVariable @NonNull Long fieldId) {
        CustomField customField = this.branchCustomFieldService.findOne(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Field not found (ID=%d).")));

        this.branchCustomFieldService.delete(customField);
    }
}
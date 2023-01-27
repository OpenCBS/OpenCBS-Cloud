package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.loans.domain.customfields.TypeOfCollateral;
import com.opencbs.loans.domain.customfields.TypeOfCollateralCustomField;
import com.opencbs.loans.mappers.TypeOfCollateralCustomFieldMapper;
import com.opencbs.loans.services.TypeOfCollateralCustomFieldService;
import com.opencbs.loans.services.TypeOfCollateralService;
import com.opencbs.loans.validators.TypeOfCollateralCustomFieldDtoValidator;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/types-of-collateral/{typeOfCollateralId}/custom-fields")
@SuppressWarnings("unused")
public class TypeOfCollateralCustomFieldController {

    private final TypeOfCollateralCustomFieldService typeOfCollateralCustomFieldService;
    private final TypeOfCollateralService typeOfCollateralService;
    private final TypeOfCollateralCustomFieldDtoValidator typeOfCollateralCustomFieldDtoValidator;
    private final TypeOfCollateralCustomFieldMapper typeOfCollateralCustomFieldMapper;


    @RequestMapping(method = POST)
    public CustomFieldDto post(@PathVariable("typeOfCollateralId") long typeOfCollateralId, @RequestBody CustomFieldDto customFieldDto) {
        this.typeOfCollateralCustomFieldDtoValidator.validateOnCreate(customFieldDto);
        TypeOfCollateralCustomField typeOfCollateralCustomField = new TypeOfCollateralCustomField();
        typeOfCollateralCustomField = this.typeOfCollateralCustomFieldMapper.zip(typeOfCollateralCustomField, customFieldDto);
        typeOfCollateralCustomField.setSection(getTypeOfCollateral(typeOfCollateralId));

        typeOfCollateralCustomField = this.typeOfCollateralCustomFieldService.create(typeOfCollateralCustomField);

        return typeOfCollateralCustomFieldMapper.map(typeOfCollateralCustomField);
    }

    @RequestMapping(value = "/{id}", method = PUT)
    public CustomFieldDto put(@PathVariable("typeOfCollateralId") long typeOfCollateralId, @PathVariable("id") long id, @RequestBody CustomFieldDto customFieldDto) {
        TypeOfCollateralCustomField typeOfCollateralCustomField = this.typeOfCollateralCustomFieldService
                .findOne(id).orElseThrow(() -> new ResourceNotFoundException(String.format("CustomField not found (ID=%d).", id)));
        this.typeOfCollateralCustomFieldDtoValidator.validate(customFieldDto);
        this.typeOfCollateralCustomFieldDtoValidator.validateOnEdit(typeOfCollateralCustomField, customFieldDto);
        int oldOrder = typeOfCollateralCustomField.getOrder();
        TypeOfCollateral newTypeOfCollateral = this.getTypeOfCollateral(typeOfCollateralId);
        typeOfCollateralCustomField = this.typeOfCollateralCustomFieldMapper.zip(typeOfCollateralCustomField, customFieldDto);

        if(!typeOfCollateralCustomField.getSection().getId().equals(newTypeOfCollateral.getId())) {
            typeOfCollateralCustomField.setOrder(oldOrder);
            this.typeOfCollateralCustomFieldService.updateWithSection(typeOfCollateralCustomField, newTypeOfCollateral);
        } else {
            this.update(typeOfCollateralCustomField, oldOrder);
        }

        return typeOfCollateralCustomFieldMapper.map(typeOfCollateralCustomField);
    }

    @DeleteMapping(value = "/{fieldId}")
    public void deleteCustomField(@PathVariable @NonNull Long fieldId) {
        CustomField customField = this.typeOfCollateralCustomFieldService.findOne(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Field not found (ID=%d).")));

        this.typeOfCollateralCustomFieldService.delete(customField);
    }

    private void update(TypeOfCollateralCustomField typeOfCollateralCustomField, int oldOrder) {
        if (oldOrder == typeOfCollateralCustomField.getOrder()) {
            this.typeOfCollateralCustomFieldService.update(typeOfCollateralCustomField);
        } else {
            this.typeOfCollateralCustomFieldService.updateWithOrder(typeOfCollateralCustomField, oldOrder);
        }
    }

    private TypeOfCollateral getTypeOfCollateral(long id) throws ResourceNotFoundException {
        return this.typeOfCollateralService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("TypeOfCollateral not found (ID=%d).", id)));
    }
}

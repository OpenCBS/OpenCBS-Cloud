package com.opencbs.core.controllers.profiles;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.customfields.CompanyCustomField;
import com.opencbs.core.domain.customfields.CompanyCustomFieldSection;
import com.opencbs.core.domain.customfields.CompanyCustomFieldValue;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.customFields.CompanyCustomFieldMapper;
import com.opencbs.core.mappers.customFields.CompanyCustomFieldSectionMapper;
import com.opencbs.core.services.customFields.CompanyCustomFieldSectionService;
import com.opencbs.core.services.customFields.CompanyCustomFieldService;
import com.opencbs.core.validators.customfields.CompanyCustomFieldDtoValidator;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/profiles/companies/custom-fields")
@SuppressWarnings("unused")
public class CompanyCustomFieldController extends BaseController {

    private final CompanyCustomFieldService companyCustomFieldService;
    private final CompanyCustomFieldSectionService companyCustomFieldSectionService;
    private final CompanyCustomFieldMapper companyCustomFieldMapper;
    private final CompanyCustomFieldSectionMapper companyCustomFieldSectionMapper;
    private final CompanyCustomFieldDtoValidator customFieldDtoValidator;

    @RequestMapping(method = POST)
    public List<CustomFieldSectionDto> post(@RequestBody CustomFieldDto customFieldDto) throws Exception {
        this.customFieldDtoValidator.validate(customFieldDto);

        CompanyCustomField companyCustomField = new CompanyCustomField();
        companyCustomField = this.companyCustomFieldMapper.zip(companyCustomField, customFieldDto);
        companyCustomField.setSection(getSection(customFieldDto.getSectionId()));
        this.companyCustomFieldService.create(companyCustomField);

        return this.getSections();
    }

    @RequestMapping(path = "/{id}", method = PUT)
    public List<CustomFieldSectionDto> put(@PathVariable long id, @RequestBody CustomFieldDto customFieldDto) throws Exception {
        CompanyCustomField customField = this.companyCustomFieldService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("CustomField not found (ID=%d).", id)));
        customFieldDto.setId(id);
        this.customFieldDtoValidator.validateOnEdit(customField, customFieldDto);
        this.customFieldDtoValidator.validate(customFieldDto);

        int oldOrder = customField.getOrder();
        CompanyCustomFieldSection newSection = getSection(customFieldDto.getSectionId());
        customField = this.companyCustomFieldMapper.zip(customField, customFieldDto);

        if (!customField.getSection().getId().equals(newSection.getId())) {
            customField.setOrder(oldOrder);
            this.companyCustomFieldService.updateWithSection(customField, newSection);
        } else {
            this.updateInsideSection(customField, oldOrder);
        }

        return this.getSections();
    }

    private void updateInsideSection(CompanyCustomField customField, int oldOrder) {
        if (oldOrder == customField.getOrder()) {
            this.companyCustomFieldService.update(customField);
        } else {
            this.companyCustomFieldService.updateWithOrder(customField, oldOrder);
        }
    }

    private CompanyCustomFieldSection getSection(long id) {
        return this.companyCustomFieldSectionService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Section not found (ID=%d).", id)));
    }

    private List<CustomFieldSectionDto> getSections() {
        return this.companyCustomFieldSectionService
                .findAll()
                .stream()
                .map(this.companyCustomFieldSectionMapper::map)
                .collect(Collectors.toList());
    }

    @RequestMapping(path = "/{fieldId}/{value}", method = RequestMethod.GET)
    public Long isExist(@PathVariable long fieldId,
                        @PathVariable String value) {
        Optional<CompanyCustomFieldValue> companyCustomFieldValue =
                this.companyCustomFieldService.findOneByFieldIdAndStatusAndValue(fieldId, EntityStatus.LIVE, value);
        return companyCustomFieldValue.map(CompanyCustomFieldValue::getOwnerId).orElse(null);
    }

    @DeleteMapping(value = "/{fieldId}")
    public void deleteCustomField(@PathVariable @NonNull Long fieldId) throws Throwable {
        CustomField customField = this.companyCustomFieldService.findOne(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Field not found (ID=%d).")));

        this.companyCustomFieldService.delete(customField);
    }
}

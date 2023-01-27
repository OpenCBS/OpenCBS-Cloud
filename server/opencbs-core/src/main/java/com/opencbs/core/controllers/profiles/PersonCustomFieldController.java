package com.opencbs.core.controllers.profiles;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.PersonCustomField;
import com.opencbs.core.domain.customfields.PersonCustomFieldSection;
import com.opencbs.core.domain.customfields.PersonCustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.customFields.PersonCustomFieldMapper;
import com.opencbs.core.mappers.customFields.PersonCustomFieldSectionMapper;
import com.opencbs.core.services.customFields.PersonCustomFieldSectionService;
import com.opencbs.core.services.customFields.PersonCustomFieldService;
import com.opencbs.core.validators.customfields.PersonCustomFieldDtoValidator;
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

import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/profiles/people/custom-fields")
public class PersonCustomFieldController extends BaseController {

    private final PersonCustomFieldService personCustomFieldService;
    private final PersonCustomFieldSectionService personCustomFieldSectionService;
    private final PersonCustomFieldMapper personCustomFieldMapper;
    private final PersonCustomFieldSectionMapper personCustomFieldSectionMapper;
    private final PersonCustomFieldDtoValidator personCustomFieldDtoValidator;


    @RequestMapping(method = RequestMethod.POST)
    public List<CustomFieldSectionDto> post(@RequestBody CustomFieldDto customFieldDto) throws Exception {
        this.personCustomFieldDtoValidator.validate(customFieldDto);
        PersonCustomField personCustomField = new PersonCustomField();
        personCustomField = this.personCustomFieldMapper.zip(personCustomField, customFieldDto);
        personCustomField.setSection(getSection(customFieldDto.getSectionId()));

        this.personCustomFieldService.create(personCustomField);
        return this.getSections();
    }

    @RequestMapping(path = "/{id}", method = PUT)
    public List<CustomFieldSectionDto> put(@PathVariable long id, @RequestBody CustomFieldDto customFieldDto) throws Exception {
        PersonCustomField customField = this.personCustomFieldService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("CustomField not found (ID=%d).", id)));

        customFieldDto.setId(id);
        this.personCustomFieldDtoValidator.validate(customFieldDto);
        this.personCustomFieldDtoValidator.validateOnEdit(customField, customFieldDto);

        int oldOrder = customField.getOrder();
        PersonCustomFieldSection newSection = getSection(customFieldDto.getSectionId());
        customField = this.personCustomFieldMapper.zip(customField, customFieldDto);

        if(!customField.getSection().getId().equals(newSection.getId())) {
            customField.setOrder(oldOrder);
            this.personCustomFieldService.updateWithSection(customField, newSection);
        } else {
            this.updateInsideSection(customField, oldOrder);
        }

        return this.getSections();
    }

    private void updateInsideSection(PersonCustomField customField, int oldOrder) {
        if (oldOrder == customField.getOrder()) {
            this.personCustomFieldService.update(customField);
        } else {
            this.personCustomFieldService.updateWithOrder(customField, oldOrder);
        }
    }

    private PersonCustomFieldSection getSection(long id) throws ResourceNotFoundException {
        return this.personCustomFieldSectionService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Section not found (ID=%d).", id)));
    }

    private List<CustomFieldSectionDto> getSections() {
        return this.personCustomFieldSectionService
                .findAll()
                .stream()
                .map(this.personCustomFieldSectionMapper::map)
                .collect(Collectors.toList());
    }

    @RequestMapping(path = "/{fieldId}/{value}", method = RequestMethod.GET)
    public Long isExist(@PathVariable long fieldId,
                        @PathVariable String value) {
        Optional<PersonCustomFieldValue> personCustomFieldValue =
                this.personCustomFieldService.findOneByFieldIdAndStatusAndValue(fieldId, EntityStatus.LIVE, value);
        return personCustomFieldValue.map(PersonCustomFieldValue::getOwnerId).orElse(null);
    }

    @DeleteMapping(value = "/{fieldId}")
    public void deleteCustomField(@PathVariable @NonNull Long fieldId) {
        CustomField customField = this.personCustomFieldService.findOne(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Field not found (ID=%d).")));

        this.personCustomFieldService.delete(customField);
    }
}

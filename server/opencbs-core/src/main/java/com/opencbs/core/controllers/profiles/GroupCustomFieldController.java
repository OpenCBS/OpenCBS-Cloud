package com.opencbs.core.controllers.profiles;

import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.GroupCustomField;
import com.opencbs.core.domain.customfields.GroupCustomFieldSection;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.customFields.GroupCustomFieldMapper;
import com.opencbs.core.mappers.customFields.GroupCustomFieldSectionMapper;
import com.opencbs.core.services.customFields.GroupCustomFieldSectionService;
import com.opencbs.core.services.customFields.GroupCustomFieldService;
import com.opencbs.core.validators.customfields.GroupCustomFieldDtoValidator;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/profiles/groups/custom-fields")
@SuppressWarnings("unused")
public class GroupCustomFieldController {

    private final GroupCustomFieldService groupCustomFieldService;
    private final GroupCustomFieldSectionService groupCustomFieldSectionService;
    private final GroupCustomFieldMapper groupCustomFieldMapper;
    private final GroupCustomFieldSectionMapper groupCustomFieldSectionMapper;
    private final GroupCustomFieldDtoValidator groupCustomFieldDtoValidator;


    @RequestMapping(method = POST)
    public List<CustomFieldSectionDto> post(@RequestBody CustomFieldDto customFieldDto) throws Exception {
        this.groupCustomFieldDtoValidator.validate(customFieldDto);

        GroupCustomField groupCustomField = new GroupCustomField();
        groupCustomField = this.groupCustomFieldMapper.zip(groupCustomField, customFieldDto);
        groupCustomField.setSection(getSection(customFieldDto.getSectionId()));
        this.groupCustomFieldService.create(groupCustomField);

        return this.getSections();
    }

    @RequestMapping(path = "/{id}", method = PUT)
    public List<CustomFieldSectionDto> put(@PathVariable long id, @RequestBody CustomFieldDto customFieldDto) throws Exception {
        GroupCustomField customField = this.groupCustomFieldService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("CustomField is not found (ID=%d).", id)));

        customFieldDto.setId(id);
        this.groupCustomFieldDtoValidator.validateOnEdit(customField, customFieldDto);
        this.groupCustomFieldDtoValidator.validate(customFieldDto);

        int oldOrder = customField.getOrder();
        GroupCustomFieldSection newSection = getSection(customFieldDto.getSectionId());
        customField = this.groupCustomFieldMapper.zip(customField, customFieldDto);

        if (!customField.getSection().getId().equals(newSection.getId())) {
            customField.setOrder(oldOrder);
            this.groupCustomFieldService.updateWithSection(customField, newSection);
        } else {
            this.updateInsideSection(customField, oldOrder);
        }

        return this.getSections();
    }

    private void updateInsideSection(GroupCustomField customField, int oldOrder) {
        if (oldOrder == customField.getOrder()) {
            this.groupCustomFieldService.update(customField);
        } else {
            this.groupCustomFieldService.updateWithOrder(customField, oldOrder);
        }
    }

    private GroupCustomFieldSection getSection(long id) {
        return this.groupCustomFieldSectionService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Section is not found (ID=%d).", id)));
    }

    private List<CustomFieldSectionDto> getSections() {
        return this.groupCustomFieldSectionService
                .findAll()
                .stream()
                .map(this.groupCustomFieldSectionMapper::map)
                .collect(Collectors.toList());
    }

    @DeleteMapping(value = "/{fieldId}")
    public void deleteCustomField(@PathVariable @NonNull Long fieldId) {
        CustomField customField = this.groupCustomFieldService.findOne(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Field not found (ID=%d).")));

        this.groupCustomFieldService.delete(customField);
    }
}

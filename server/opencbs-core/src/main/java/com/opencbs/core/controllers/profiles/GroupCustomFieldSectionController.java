package com.opencbs.core.controllers.profiles;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.customfields.GroupCustomFieldSection;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.dto.UpdateCustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.customFields.GroupCustomFieldSectionMapper;
import com.opencbs.core.services.customFields.GroupCustomFieldSectionService;
import com.opencbs.core.validators.customfields.CustomFieldSectionDtoValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
@RequestMapping(value = "/api/profiles/groups/custom-field-sections")
@SuppressWarnings("unused")
public class GroupCustomFieldSectionController extends BaseController {

    private final GroupCustomFieldSectionService groupCustomFieldSectionService;
    private final GroupCustomFieldSectionMapper groupCustomFieldSectionMapper;
    private final CustomFieldSectionDtoValidator customFieldSectionDtoValidator;

    @Autowired
    public GroupCustomFieldSectionController(GroupCustomFieldSectionService groupCustomFieldSectionService,
                                             GroupCustomFieldSectionMapper groupCustomFieldSectionMapper,
                                             CustomFieldSectionDtoValidator customFieldSectionDtoValidator) {
        this.groupCustomFieldSectionService = groupCustomFieldSectionService;
        this.groupCustomFieldSectionMapper = groupCustomFieldSectionMapper;
        this.customFieldSectionDtoValidator = customFieldSectionDtoValidator;
    }

    @RequestMapping(method = GET)
    public List<CustomFieldSectionDto> get() {
        return this.getSections();
    }

    @RequestMapping(path = "/{id}", method = GET)
    public CustomFieldSectionDto get(@PathVariable long id) throws ResourceNotFoundException {
        return this.groupCustomFieldSectionService.findOne(id)
                .map(this.groupCustomFieldSectionMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Custom field section is not found (ID=%d).", id)));
    }

    @RequestMapping(method = POST)
    public List<CustomFieldSectionDto> post(@RequestBody UpdateCustomFieldSectionDto sectionDto) {
        this.customFieldSectionDtoValidator.validate(sectionDto);
        GroupCustomFieldSection section = new GroupCustomFieldSection();
        section = this.groupCustomFieldSectionMapper.zip(section, sectionDto);
        this.groupCustomFieldSectionService.create(section);
        return this.getSections();
    }

    @RequestMapping(value = "/{id}", method = PUT)
    public List<CustomFieldSectionDto> put(@PathVariable long id, @RequestBody UpdateCustomFieldSectionDto sectionDto) throws ResourceNotFoundException {
        GroupCustomFieldSection section = this.groupCustomFieldSectionService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Section is not found (ID=%d).", id)));

        this.customFieldSectionDtoValidator.validate(sectionDto);

        int oldOrder = section.getOrder();
        section = this.groupCustomFieldSectionMapper.zip(section, sectionDto);

        if (oldOrder == section.getOrder()) {
            this.groupCustomFieldSectionService.update(section);
        } else {
            this.groupCustomFieldSectionService.updateWithOrder(section, oldOrder);
        }
        return this.getSections();
    }

    private List<CustomFieldSectionDto> getSections() {
        return this.groupCustomFieldSectionService
                .findAll()
                .stream()
                .map(this.groupCustomFieldSectionMapper::map)
                .collect(Collectors.toList());
    }
}

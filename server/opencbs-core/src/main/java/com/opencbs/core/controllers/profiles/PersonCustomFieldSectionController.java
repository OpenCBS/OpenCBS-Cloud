package com.opencbs.core.controllers.profiles;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.customfields.PersonCustomFieldSection;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.dto.UpdateCustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.customFields.PersonCustomFieldSectionMapper;
import com.opencbs.core.services.customFields.PersonCustomFieldSectionService;
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
@RequestMapping(path = "/api/profiles/people/custom-field-sections")
@SuppressWarnings("unused")
public class PersonCustomFieldSectionController extends BaseController {

    private final PersonCustomFieldSectionService personCustomFieldSectionService;
    private final PersonCustomFieldSectionMapper personCustomFieldSectionMapper;
    private final CustomFieldSectionDtoValidator customFieldSectionDtoValidator;

    @Autowired
    public PersonCustomFieldSectionController(
            PersonCustomFieldSectionService personCustomFieldSectionService,
            PersonCustomFieldSectionMapper personCustomFieldSectionMapper,
            CustomFieldSectionDtoValidator customFieldSectionDtoValidator) {
        this.personCustomFieldSectionService = personCustomFieldSectionService;
        this.personCustomFieldSectionMapper = personCustomFieldSectionMapper;
        this.customFieldSectionDtoValidator = customFieldSectionDtoValidator;
    }

    @RequestMapping(method = GET)
    public List<CustomFieldSectionDto> get() {
        return this.getSections();
    }

    @RequestMapping(path = "/{id}", method = GET)
    public CustomFieldSectionDto get(@PathVariable long id) throws ResourceNotFoundException {
        return this.personCustomFieldSectionService.findOne(id)
                .map(this.personCustomFieldSectionMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Custom field section not found (ID=%d).", id)));
    }

    @RequestMapping(method = POST)
    public List<CustomFieldSectionDto> post(@RequestBody UpdateCustomFieldSectionDto sectionDto) {
        this.customFieldSectionDtoValidator.validate(sectionDto);
        PersonCustomFieldSection section = new PersonCustomFieldSection();
        section = this.personCustomFieldSectionMapper.zip(section, sectionDto);
        this.personCustomFieldSectionService.create(section);
        return this.getSections();
    }

    @RequestMapping(path = "/{id}", method = PUT)
    public List<CustomFieldSectionDto> put(@PathVariable long id, @RequestBody UpdateCustomFieldSectionDto sectionDto) throws ResourceNotFoundException {
        PersonCustomFieldSection section = this.personCustomFieldSectionService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Section not found (ID=%d).", id)));

        this.customFieldSectionDtoValidator.validate(sectionDto);

        int oldOrder = section.getOrder();
        section = this.personCustomFieldSectionMapper.zip(section, sectionDto);

        if (oldOrder == section.getOrder()) {
            this.personCustomFieldSectionService.update(section);
        } else {
            this.personCustomFieldSectionService.updateWithOrder(section, oldOrder);
        }

        return this.getSections();
    }

    private List<CustomFieldSectionDto> getSections() {
        return this.personCustomFieldSectionService
                .findAll()
                .stream()
                .map(this.personCustomFieldSectionMapper::map)
                .collect(Collectors.toList());
    }
}

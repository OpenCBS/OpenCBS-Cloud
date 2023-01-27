package com.opencbs.core.controllers.profiles;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.customfields.CompanyCustomFieldSection;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.dto.UpdateCustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.customFields.CompanyCustomFieldSectionMapper;
import com.opencbs.core.services.customFields.CompanyCustomFieldSectionService;
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
@RequestMapping(value = "/api/profiles/companies/custom-field-sections")
@SuppressWarnings("unused")
public class CompanyCustomFieldSectionController extends BaseController {

    private final CompanyCustomFieldSectionService companyCustomFieldSectionService;
    private final CompanyCustomFieldSectionMapper companyCustomFieldSectionMapper;
    private final CustomFieldSectionDtoValidator customFieldSectionDtoValidator;

    @Autowired
    public CompanyCustomFieldSectionController(CompanyCustomFieldSectionService companyCustomFieldSectionService,
                                               CompanyCustomFieldSectionMapper companyCustomFieldSectionMapper,
                                               CustomFieldSectionDtoValidator customFieldSectionDtoValidator) {
        this.companyCustomFieldSectionService = companyCustomFieldSectionService;
        this.companyCustomFieldSectionMapper = companyCustomFieldSectionMapper;
        this.customFieldSectionDtoValidator = customFieldSectionDtoValidator;
    }

    @RequestMapping(method = GET)
    public List<CustomFieldSectionDto> get() {
        return this.getSections();
    }

    @RequestMapping(path = "/{id}", method = GET)
    public CustomFieldSectionDto get(@PathVariable long id) throws ResourceNotFoundException {
        return this.companyCustomFieldSectionService.findOne(id)
                .map(this.companyCustomFieldSectionMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Custom field section not found (ID=%d).", id)));
    }

    @RequestMapping(method = POST)
    public List<CustomFieldSectionDto> post(@RequestBody UpdateCustomFieldSectionDto sectionDto) {
        this.customFieldSectionDtoValidator.validate(sectionDto);
        CompanyCustomFieldSection section = new CompanyCustomFieldSection();
        section = this.companyCustomFieldSectionMapper.zip(section, sectionDto);
        this.companyCustomFieldSectionService.create(section);
        return this.getSections();
    }

    @RequestMapping(value = "/{id}", method = PUT)
    public List<CustomFieldSectionDto> put(@PathVariable long id, @RequestBody UpdateCustomFieldSectionDto sectionDto) throws ResourceNotFoundException {
        CompanyCustomFieldSection section = this.companyCustomFieldSectionService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Section not found (ID=%d).", id)));

        this.customFieldSectionDtoValidator.validate(sectionDto);

        int oldOrder = section.getOrder();
        section = this.companyCustomFieldSectionMapper.zip(section, sectionDto);

        if (oldOrder == section.getOrder()) {
            this.companyCustomFieldSectionService.update(section);
        } else {
            this.companyCustomFieldSectionService.updateWithOrder(section, oldOrder);
        }
        return this.getSections();
    }

    private List<CustomFieldSectionDto> getSections() {
        return this.companyCustomFieldSectionService
                .findAll()
                .stream()
                .map(this.companyCustomFieldSectionMapper::map)
                .collect(Collectors.toList());
    }
}

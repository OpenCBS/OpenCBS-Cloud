package com.opencbs.core.controllers.branches;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.customfields.BranchCustomFieldSection;
import com.opencbs.core.dto.UpdateCustomFieldSectionDto;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.customFields.BranchCustomFieldSectionMapper;
import com.opencbs.core.services.customFields.BranchCustomFieldSectionService;
import com.opencbs.core.validators.customfields.CustomFieldSectionDtoValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/branches/custom-field-sections")
public class BranchCustomFieldSectionController extends BaseController {

    private final BranchCustomFieldSectionService branchCustomFieldSectionService;
    private final BranchCustomFieldSectionMapper branchCustomFieldSectionMapper;
    private final CustomFieldSectionDtoValidator customFieldSectionDtoValidator;

    @RequestMapping(method = GET)
    public List<CustomFieldSectionDto> get() {
        return this.getSections();
    }

    @RequestMapping(path = "/{id}", method = GET)
    public CustomFieldSectionDto get(@PathVariable long id) throws ResourceNotFoundException {
        return this.branchCustomFieldSectionService.findOne(id)
                .map(this.branchCustomFieldSectionMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Custom field section not found (ID=%d).", id)));
    }

    @RequestMapping(method = POST)
    public List<CustomFieldSectionDto> post(@RequestBody UpdateCustomFieldSectionDto sectionDto) {
        this.customFieldSectionDtoValidator.validate(sectionDto);
        BranchCustomFieldSection branchCustomFieldSection = new BranchCustomFieldSection();
        branchCustomFieldSection = this.branchCustomFieldSectionMapper.zip(branchCustomFieldSection, sectionDto);
        this.branchCustomFieldSectionService.create(branchCustomFieldSection);
        return this.getSections();
    }

    @RequestMapping(path = "/{id}", method = PUT)
    public List<CustomFieldSectionDto> put(@PathVariable long id, @RequestBody UpdateCustomFieldSectionDto sectionDto) throws ResourceNotFoundException {
        BranchCustomFieldSection section = this.branchCustomFieldSectionService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Section not found (ID=%d).", id)));

        this.customFieldSectionDtoValidator.validate(sectionDto);

        int oldOrder = section.getOrder();
        section = this.branchCustomFieldSectionMapper.zip(section, sectionDto);

        if (oldOrder == section.getOrder()) {
            this.branchCustomFieldSectionService.update(section);
        } else {
            this.branchCustomFieldSectionService.updateWithOrder(section, oldOrder);
        }

        return this.getSections();
    }

    private List<CustomFieldSectionDto> getSections() {
        return this.branchCustomFieldSectionService
                .findAll()
                .stream()
                .map(this.branchCustomFieldSectionMapper::map)
                .collect(Collectors.toList());
    }
}

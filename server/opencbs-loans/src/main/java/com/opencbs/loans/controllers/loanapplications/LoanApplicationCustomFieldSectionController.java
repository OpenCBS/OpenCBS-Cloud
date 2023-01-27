package com.opencbs.loans.controllers.loanapplications;


import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.dto.UpdateCustomFieldSectionDto;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.validators.customfields.CustomFieldSectionDtoValidator;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomFieldSection;
import com.opencbs.loans.mappers.LoanApplicationCustomFieldSectionMapper;
import com.opencbs.loans.services.LoanApplicationCustomFieldSectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/loan-applications/custom-field-sections")
@SuppressWarnings("unused")
public class LoanApplicationCustomFieldSectionController extends BaseController {

    private final LoanApplicationCustomFieldSectionService loanApplicationCustomFieldSectionService;
    private final LoanApplicationCustomFieldSectionMapper loanApplicationCustomFieldSectionMapper;
    private final CustomFieldSectionDtoValidator customFieldSectionDtoValidator;

    @Autowired
    public LoanApplicationCustomFieldSectionController(LoanApplicationCustomFieldSectionService loanApplicationCustomFieldSectionService,
                                                       LoanApplicationCustomFieldSectionMapper loanApplicationCustomFieldSectionMapper,
                                                       CustomFieldSectionDtoValidator customFieldSectionDtoValidator) {
        this.loanApplicationCustomFieldSectionService = loanApplicationCustomFieldSectionService;
        this.loanApplicationCustomFieldSectionMapper = loanApplicationCustomFieldSectionMapper;
        this.customFieldSectionDtoValidator = customFieldSectionDtoValidator;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<CustomFieldSectionDto> get() {
        return this.getSections();
    }

    @RequestMapping(path = "/{id}", method = RequestMethod.GET)
    public CustomFieldSectionDto get(@PathVariable long id) throws ResourceNotFoundException {
        return this.loanApplicationCustomFieldSectionService.findOne(id)
                .map(this.loanApplicationCustomFieldSectionMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Custom field section not found (ID=%d).", id)));
    }

    @RequestMapping(method = RequestMethod.POST)
    public List<CustomFieldSectionDto> post(@RequestBody UpdateCustomFieldSectionDto sectionDto) {
        this.customFieldSectionDtoValidator.validate(sectionDto);
        LoanApplicationCustomFieldSection section = new LoanApplicationCustomFieldSection();
        section = this.loanApplicationCustomFieldSectionMapper.zip(section, sectionDto);
        this.loanApplicationCustomFieldSectionService.create(section);
        return this.getSections();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public List<CustomFieldSectionDto> put(@PathVariable long id, @RequestBody UpdateCustomFieldSectionDto sectionDto) throws ResourceNotFoundException {
        LoanApplicationCustomFieldSection section = this.loanApplicationCustomFieldSectionService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Section not found (ID=%d).", id)));

        this.customFieldSectionDtoValidator.validate(sectionDto);

        int oldOrder = section.getOrder();
        section = this.loanApplicationCustomFieldSectionMapper.zip(section, sectionDto);

        if (oldOrder == section.getOrder()) {
            this.loanApplicationCustomFieldSectionService.update(section);
        } else {
            this.loanApplicationCustomFieldSectionService.updateWithOrder(section, oldOrder);
        }
        return this.getSections();
    }

    private List<CustomFieldSectionDto> getSections() {
        return this.loanApplicationCustomFieldSectionService
                .findAll()
                .stream()
                .map(this.loanApplicationCustomFieldSectionMapper::map)
                .collect(Collectors.toList());
    }
}

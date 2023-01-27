package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomField;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomFieldSection;
import com.opencbs.loans.mappers.LoanApplicationCustomFieldMapper;
import com.opencbs.loans.mappers.LoanApplicationCustomFieldSectionMapper;
import com.opencbs.loans.services.LoanApplicationCustomFieldSectionService;
import com.opencbs.loans.services.LoanApplicationCustomFieldService;
import com.opencbs.loans.validators.LoanApplicationCustomFieldDtoValidator;
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
@RequestMapping(value = "/api/loan-applications/custom-fields")
@SuppressWarnings("unused")
public class LoanApplicationCustomFieldController extends BaseController {

    private final LoanApplicationCustomFieldService loanApplicationCustomFieldService;
    private final LoanApplicationCustomFieldSectionService loanApplicationCustomFieldSectionService;
    private final LoanApplicationCustomFieldDtoValidator customFieldDtoValidator;
    private final LoanApplicationCustomFieldMapper loanApplicationCustomFieldMapper;
    private final LoanApplicationCustomFieldSectionMapper loanApplicationCustomFieldSectionMapper;


    @RequestMapping(method = POST)
    public List<CustomFieldSectionDto> post(@RequestBody CustomFieldDto customFieldDto) throws Exception {
        this.customFieldDtoValidator.validate(customFieldDto);

        LoanApplicationCustomField loanApplicationCustomField = new LoanApplicationCustomField();
        loanApplicationCustomField = this.loanApplicationCustomFieldMapper.zip(loanApplicationCustomField, customFieldDto);
        loanApplicationCustomField.setSection(getSection(customFieldDto.getSectionId()));
        this.loanApplicationCustomFieldService.create(loanApplicationCustomField);

        return this.getSections();
    }

    @RequestMapping(path = "/{id}", method = PUT)
    public List<CustomFieldSectionDto> put(@PathVariable long id, @RequestBody CustomFieldDto customFieldDto) throws Exception {
        LoanApplicationCustomField customField = this.loanApplicationCustomFieldService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("CustomField not found (ID=%d).", id)));
        customFieldDto.setId(id);
        this.customFieldDtoValidator.validateOnEdit(customField, customFieldDto);
        this.customFieldDtoValidator.validate(customFieldDto);

        int oldOrder = customField.getOrder();
        LoanApplicationCustomFieldSection newSection = getSection(customFieldDto.getSectionId());
        customField = this.loanApplicationCustomFieldMapper.zip(customField, customFieldDto);

        if (!customField.getSection().getId().equals(newSection.getId())) {
            customField.setOrder(oldOrder);
            this.loanApplicationCustomFieldService.updateWithSection(customField, newSection);
        } else {
            this.updateInsideSection(customField, oldOrder);
        }

        return this.getSections();
    }

    private void updateInsideSection(LoanApplicationCustomField customField, int oldOrder) {
        if (oldOrder == customField.getOrder()) {
            this.loanApplicationCustomFieldService.update(customField);
        } else {
            this.loanApplicationCustomFieldService.updateWithOrder(customField, oldOrder);
        }
    }

    private LoanApplicationCustomFieldSection getSection(long id) throws Exception {
        return this.loanApplicationCustomFieldSectionService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Section not found (ID=%d).", id)));
    }

    private List<CustomFieldSectionDto> getSections() {
        return this.loanApplicationCustomFieldSectionService
                .findAll()
                .stream()
                .map(this.loanApplicationCustomFieldSectionMapper::map)
                .collect(Collectors.toList());
    }

    @DeleteMapping(value = "/{fieldId}")
    public void deleteCustomField(@PathVariable @NonNull Long fieldId) {
        CustomField customField = this.loanApplicationCustomFieldService.findOne(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Field not found (ID=%d).")));

        this.loanApplicationCustomFieldService.delete(customField);
    }
}

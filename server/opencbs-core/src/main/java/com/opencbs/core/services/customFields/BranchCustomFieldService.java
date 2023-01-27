package com.opencbs.core.services.customFields;

import com.opencbs.core.domain.customfields.BranchCustomField;
import com.opencbs.core.domain.customfields.BranchCustomFieldSection;
import com.opencbs.core.domain.customfields.BranchCustomFieldValue;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.customFields.BranchCustomFieldSectionMapper;
import com.opencbs.core.repositories.customFields.BranchCustomFieldRepository;
import com.opencbs.core.repositories.customFields.BranchCustomFieldValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BranchCustomFieldService extends CustomFieldService<BranchCustomField,
        BranchCustomFieldValue, BranchCustomFieldRepository, BranchCustomFieldValueRepository> {

    @Autowired
    public BranchCustomFieldService(BranchCustomFieldRepository repository,
                                    BranchCustomFieldValueRepository valueRepository,
                                    BranchCustomFieldSectionMapper branchCustomFieldSectionMapper,
                                    BranchCustomFieldSectionService branchCustomFieldSectionService) {
        super(repository, valueRepository);
        this.branchCustomFieldSectionMapper = branchCustomFieldSectionMapper;
        this.branchCustomFieldSectionService = branchCustomFieldSectionService;
    }

    private final BranchCustomFieldSectionMapper branchCustomFieldSectionMapper;
    private final BranchCustomFieldSectionService branchCustomFieldSectionService;

    public void updateInsideSection(BranchCustomField branchCustomField, int oldOrder) {
        if (oldOrder == branchCustomField.getOrder()) {
            this.update(branchCustomField);
        }
        else {
            this.updateWithOrder(branchCustomField, oldOrder);
        }

    }

    public BranchCustomFieldSection getSection(long sectionId) throws ResourceNotFoundException {
        return this.branchCustomFieldSectionService.findOne(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Section not found (ID=%d).", sectionId)));
    }

    public List<CustomFieldSectionDto> getSections() {
        return this.branchCustomFieldSectionService
                .findAll()
                .stream()
                .map(this.branchCustomFieldSectionMapper::map)
                .collect(Collectors.toList());
    }
}

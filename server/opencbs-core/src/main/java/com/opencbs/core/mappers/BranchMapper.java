package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.customfields.BranchCustomField;
import com.opencbs.core.domain.customfields.BranchCustomFieldValue;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.CustomFieldSection;
import com.opencbs.core.domain.enums.CustomFieldType;
import com.opencbs.core.dto.BranchDto;
import com.opencbs.core.dto.BranchUpdateDto;
import com.opencbs.core.dto.FieldValueDto;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.dto.customfields.CustomFieldValueDto;
import com.opencbs.core.dto.profiles.ProfileCustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.customFields.BranchCustomFieldMapper;
import com.opencbs.core.services.customFields.BranchCustomFieldSectionService;
import com.opencbs.core.workers.LookupWorker;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Mapper
public class BranchMapper {

    private final BranchCustomFieldSectionService branchCustomFieldSectionService;
    private final BranchCustomFieldMapper branchCustomFieldMapper;
    private final LookupWorker lookupWorker;
    private final ModelMapper modelMapper = new ModelMapper();

    public BranchDto mapToDto(Branch branch) {
        BranchDto branchDto = this.modelMapper.map(branch, BranchDto.class);
        branchDto.setCustomFieldSections(this.getSection(branch));
        return branchDto;
    }

    public Branch mapToEntity(BranchUpdateDto branchUpdateDto) throws ResourceNotFoundException {
        Branch branch = new Branch();
        List<BranchCustomFieldValue> branchCustomFieldValues = this.getCustomFieldValuesFromDto(branchUpdateDto, branch);
        branch.setId(branchUpdateDto.getId());
        branch.setName(branchUpdateDto.getName());
        branch.setCustomFieldValues(branchCustomFieldValues);
        return branch;
    }

    private List<ProfileCustomFieldSectionDto> getSection(Branch branch) {
        List<ProfileCustomFieldSectionDto> sections = this.branchCustomFieldSectionService.findAll()
                .stream()
                .map(s -> {
                    ProfileCustomFieldSectionDto dto = this.modelMapper.map(s, ProfileCustomFieldSectionDto.class);
                    List<CustomFieldValueDto> valueDto = s.getCustomFields()
                            .stream()
                            .map(cf -> this.getCustomFieldValueDto(branch, cf))
                            .collect(Collectors.toList());
                    dto.setValues(valueDto);
                    return dto;
                })
                .collect(Collectors.toList());
        return sections;
    }

    private CustomFieldValueDto getCustomFieldValueDto(Branch branch, BranchCustomField branchCustomField) {
        CustomFieldValueDto valueDto = new CustomFieldValueDto();
        CustomFieldDto customFieldDto = this.branchCustomFieldMapper.map(branchCustomField);
        Optional<BranchCustomFieldValue> customFieldValue = branch.getCustomFieldValues()
                .stream()
                .filter(cfv -> branchCustomField.getId().equals(cfv.getCustomField().getId()))
                .findFirst();
        if (customFieldValue.isPresent()) {
            String value = customFieldValue.get().getValue();
            valueDto.setValue(value);
            if (branchCustomField.getFieldType().equals(CustomFieldType.LOOKUP) && !customFieldValue.get().getValue().isEmpty()) {
                valueDto.setValue(this.lookupWorker.getLookupValueObject(customFieldDto.getExtra().get("key").toString(), Long.valueOf(value)));
            }
            valueDto.setStatus(customFieldValue.get().getStatus());
        } else {
            valueDto.setValue("");
        }
        valueDto.setCustomField(customFieldDto);
        return valueDto;
    }

    private List<BranchCustomFieldValue> getCustomFieldValuesFromDto(BranchUpdateDto branchUpdateDto, Branch branch) {
        return this.getBranchCustomFields()
                .stream()
                .map(f -> {
                    String value = branchUpdateDto.getFieldValues()
                            .stream()
                            .filter(v -> v.getFieldId() == f.getId())
                            .findFirst()
                            .map(FieldValueDto::getValue)
                            .orElse("");
                    BranchCustomFieldValue customFieldValue = new BranchCustomFieldValue();
                    customFieldValue.setCustomField(f);
                    customFieldValue.setValue(value);
                    customFieldValue.setOwner(branch);
                    return customFieldValue;
                })
                .collect(Collectors.toList());
    }

    private List<BranchCustomField> getBranchCustomFields() {
        return this.branchCustomFieldSectionService.findAll()
                .stream()
                .sorted(Comparator.comparingInt(CustomFieldSection::getOrder))
                .flatMap(s -> s.getCustomFields().stream().sorted(Comparator.comparingInt(CustomField::getOrder)))
                .collect(Collectors.toList());
    }
}

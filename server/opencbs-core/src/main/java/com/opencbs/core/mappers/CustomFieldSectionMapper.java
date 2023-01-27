package com.opencbs.core.mappers;

import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.CustomFieldSection;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.dto.UpdateCustomFieldSectionDto;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public abstract class CustomFieldSectionMapper<Tcfs extends CustomFieldSection, Tcfm extends CustomFieldMapper> {

    private final ModelMapper modelMapper = new ModelMapper();
    private final Tcfm customFieldMapper;

    protected CustomFieldSectionMapper(Tcfm customFieldMapper) {
        this.customFieldMapper = customFieldMapper;
    }

    public Tcfs zip(Tcfs section, UpdateCustomFieldSectionDto sectionDto) {
        section.setCaption(sectionDto.getCaption());
        section.setOrder(sectionDto.getOrder());
        section.setCode(sectionDto.getCaption().trim().replace(" ", "_").toLowerCase());
        return section;
    }

    public CustomFieldSectionDto map(Tcfs section) {
        List<CustomField<Tcfs>> customFields = section.getCustomFields();
        CustomFieldSectionDto customFieldSectionDto = this.modelMapper.map(section, CustomFieldSectionDto.class);
        customFieldSectionDto.setCustomFields(customFields.stream()
                .map(this.customFieldMapper::map)
                .collect(Collectors.toList()));
        return customFieldSectionDto;
    }
}

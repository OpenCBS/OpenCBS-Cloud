package com.opencbs.core.mappers;

import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import org.modelmapper.ModelMapper;

public class CustomFieldMapper<Tcf extends CustomField> {

    private final ModelMapper modelMapper = new ModelMapper();

    public Tcf zip(Tcf customField, CustomFieldDto customFieldDto) {
        customField.setName(CustomFieldMapper.convertCustomFieldName(customFieldDto.getName()));
        customField.setCaption(customFieldDto.getCaption());
        customField.setDescription(customFieldDto.getDescription());
        customField.setFieldType(customFieldDto.getFieldType());
        customField.setUnique(customFieldDto.isUnique());
        customField.setRequired(customFieldDto.isRequired());
        customField.setOrder(customFieldDto.getOrder());
        customField.setExtra(customFieldDto.getExtra());
        return customField;
    }

    public CustomFieldDto map(Tcf customField) {
        return this.modelMapper.map(customField, CustomFieldDto.class);
    }

    public static String convertCustomFieldName(String name){
        return name.toLowerCase().replaceAll("\\W", "_");
    }
}

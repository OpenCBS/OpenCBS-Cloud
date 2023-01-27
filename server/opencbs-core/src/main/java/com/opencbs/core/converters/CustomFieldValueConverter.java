package com.opencbs.core.converters;

import com.opencbs.core.domain.customfields.CustomFieldValue;
import com.opencbs.core.dto.FieldValueDto;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

public class CustomFieldValueConverter {
    public static <T extends CustomFieldValue>List<FieldValueDto> toListDto(List<T> source) {
        List<FieldValueDto> dtoList = new ArrayList<>();
        if(CollectionUtils.isEmpty(source)){
            return dtoList;
        }

        source.forEach(customFieldValue -> {
            FieldValueDto fieldValueDto = new FieldValueDto();
            fieldValueDto.setFieldId(customFieldValue.getCustomField().getId());
            fieldValueDto.setValue(customFieldValue.getValue());

            dtoList.add(fieldValueDto);
        });

        return dtoList;
    }
}

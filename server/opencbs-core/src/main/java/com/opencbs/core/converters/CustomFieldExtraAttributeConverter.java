package com.opencbs.core.converters;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.domain.customfields.CustomFieldExtra;
import org.springframework.util.StringUtils;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.io.IOException;

@Converter(autoApply = true)
@SuppressWarnings("unused")
public class CustomFieldExtraAttributeConverter implements AttributeConverter<CustomFieldExtra, String> {

    @Override
    public String convertToDatabaseColumn(CustomFieldExtra extra) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(extra);
        } catch (JsonProcessingException e) {
            return "";
        }
    }

    @Override
    public CustomFieldExtra convertToEntityAttribute(String s) {
        if (StringUtils.isEmpty(s)) {
            return null;
        }
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(s, CustomFieldExtra.class);
        } catch (IOException e) {
            return null;
        }
    }
}

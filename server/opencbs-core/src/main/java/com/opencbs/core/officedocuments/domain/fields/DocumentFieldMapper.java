package com.opencbs.core.officedocuments.domain.fields;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.customfields.CustomFieldExtra;
import com.opencbs.core.domain.enums.CustomFieldType;
import lombok.SneakyThrows;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JRPropertiesMap;

@Mapper
public class DocumentFieldMapper {

    private static String _DOCUMENT_FIELD_IS_UNIQUE_ =  "DocumentField.isUnique";
    private static String _DOCUMENT_FIELD_TYPE_ =  "DocumentField.type";
    private static String _DOCUMENT_FIELD_CAPTION_ =  "DocumentField.caption";
    private static String _DOCUMENT_FIELD_REQUIRED_ =  "DocumentField.required";
    private static String _DOCUMENT_FIELD_ORDER_ =  "DocumentField.order";
    private static String _DOCUMENT_FIELD_DEFAULT_VALUE_ =  "DocumentField.defaultValue";
    private static String _DOCUMENT_FIELD_EXTRA_ =  "DocumentField.extra";


    @SneakyThrows
    public static DocumentField fromJRParameter(JRParameter jrParameter){
        final JRPropertiesMap propertiesMap = jrParameter.getPropertiesMap();

        DocumentField documentField = DocumentField.builder()
                .name(jrParameter.getName())
                .unique(Boolean.parseBoolean(propertiesMap.getProperty(_DOCUMENT_FIELD_IS_UNIQUE_)))
                .fieldType(CustomFieldType.valueOf(propertiesMap.getProperty(_DOCUMENT_FIELD_TYPE_)))
                .caption(propertiesMap.getProperty(_DOCUMENT_FIELD_CAPTION_))
                .required(Boolean.parseBoolean(propertiesMap.getProperty(_DOCUMENT_FIELD_REQUIRED_)))
                .order(Integer.parseInt(propertiesMap.getProperty(_DOCUMENT_FIELD_ORDER_)))
                .defaultValue(propertiesMap.getProperty(_DOCUMENT_FIELD_DEFAULT_VALUE_))
                .build();

        if (propertiesMap.getProperty(_DOCUMENT_FIELD_EXTRA_)!=null) {
            ObjectMapper objectMapper = new ObjectMapper();
            final CustomFieldExtra customFieldExtra = objectMapper.readValue(propertiesMap.getProperty(_DOCUMENT_FIELD_EXTRA_), CustomFieldExtra.class);
            documentField.setExtra(customFieldExtra);
        }

        return documentField;
    }
}

package com.opencbs.core.dto.customfields;

import com.opencbs.core.domain.customfields.CustomFieldExtra;
import com.opencbs.core.domain.enums.CustomFieldType;
import lombok.Data;

@Data
public class CustomFieldDto {

    private long id;
    private long sectionId;
    private String name;
    private String caption;
    private String description;
    private CustomFieldType fieldType;
    private boolean unique;
    private boolean required;
    private int order;
    private CustomFieldExtra extra;
}

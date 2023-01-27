package com.opencbs.core.officedocuments.domain.fields;

import com.opencbs.core.domain.customfields.CustomFieldExtra;
import com.opencbs.core.domain.enums.CustomFieldType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentField {
    private CustomFieldType fieldType;
    private String name;
    private String caption;
    private boolean unique;
    private boolean required;
    private int order;
    private String defaultValue;
    private CustomFieldExtra extra;
}

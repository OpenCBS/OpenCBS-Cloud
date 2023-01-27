package com.opencbs.core.officedocuments.domain.fields;

import lombok.Data;

@Data
public class DocumentFieldValue {
    private DocumentField field;
    private String value;
    private String replaceValue;
}

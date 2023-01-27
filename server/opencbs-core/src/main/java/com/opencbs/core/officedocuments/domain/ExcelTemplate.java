package com.opencbs.core.officedocuments.domain;

import com.opencbs.core.officedocuments.domain.fields.DocumentField;
import lombok.Data;

import java.util.List;

@Data
public class ExcelTemplate extends Template {
    private List<DocumentField> fields;
}

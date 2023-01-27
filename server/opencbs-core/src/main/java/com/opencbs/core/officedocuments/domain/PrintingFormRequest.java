package com.opencbs.core.officedocuments.domain;

import lombok.Data;

import java.util.Map;

@Data
public class PrintingFormRequest extends Request {
    private Long entityId;
    private Map<String, String> fieldsValues;
}

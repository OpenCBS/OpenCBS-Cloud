package com.opencbs.core.officedocuments.domain;

import lombok.Data;

import java.util.Map;

@Data
public class ExcelRequest extends Request {
    private Map<String, String> fieldsValues;
}

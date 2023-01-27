package com.opencbs.core.officedocuments.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import net.sf.jasperreports.engine.JasperReport;

@Data
public class JasperTemplate extends ExcelTemplate {
    @JsonIgnore
    private String fileName;

    @JsonIgnore
    private String checkSum;

    @JsonIgnore
    private JasperReport compliedJasperReport;
}

package com.opencbs.core.officedocuments;

import com.opencbs.core.officedocuments.enums.ReportFormatType;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface JasperExporter {
    ResponseEntity export(JasperPrint report) throws JRException;
    ReportFormatType getFormatType();
    Map<String, Object> getSpecificParameters();
}

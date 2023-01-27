package com.opencbs.core.officedocuments;

import com.opencbs.core.officedocuments.enums.ReportFormatType;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleXlsxReportConfiguration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class JasperExporterExcel implements JasperExporter {

    public static final String SHEET_NAME = "Report Data";

    @Override
    public ResponseEntity export(JasperPrint jasperPrint) throws JRException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        JRXlsxExporter exporter = new JRXlsxExporter();

        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporter.setExporterOutput(
                new SimpleOutputStreamExporterOutput(baos));

        SimpleXlsxReportConfiguration reportConfig
                = new SimpleXlsxReportConfiguration();

        reportConfig.setSheetNames(new String[] {SHEET_NAME});
        reportConfig.setDetectCellType(true);

        exporter.setConfiguration(reportConfig);
        exporter.exportReport();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE,
                        "application/vnd.ms-excel")
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        String.format("attachment; filename=\"%s.xlsx\"", JasperExporterHelper.getExportName(jasperPrint)))
                .body(baos.toByteArray());
    }

    @Override
    public ReportFormatType getFormatType() {
        return ReportFormatType.EXCEL;
    }

    @Override
    public Map<String, Object> getSpecificParameters() {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(JRParameter.IS_IGNORE_PAGINATION, Boolean.TRUE);
        return parameters;
    }
}

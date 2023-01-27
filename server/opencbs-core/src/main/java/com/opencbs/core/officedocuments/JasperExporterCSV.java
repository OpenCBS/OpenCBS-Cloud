package com.opencbs.core.officedocuments;

import com.opencbs.core.officedocuments.enums.ReportFormatType;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.export.SimpleCsvExporterConfiguration;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleWriterExporterOutput;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class JasperExporterCSV implements JasperExporter {

    @Override
    public ResponseEntity export(JasperPrint jasperPrint) throws JRException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        JRCsvExporter exporter = new JRCsvExporter();

        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporter.setExporterOutput(new SimpleWriterExporterOutput(baos));

        SimpleCsvExporterConfiguration reportConfig = new SimpleCsvExporterConfiguration();

        exporter.exportReport();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE,
                        "application/vnd.csv")
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        String.format("attachment; filename=\"%s.csv\"", JasperExporterHelper.getExportName(jasperPrint)))
                .body(baos.toByteArray());
    }

    @Override
    public ReportFormatType getFormatType() {
        return ReportFormatType.CSV;
    }

    @Override
    public Map<String, Object> getSpecificParameters() {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(JRParameter.IS_IGNORE_PAGINATION, Boolean.TRUE);
        return parameters;
    }
}

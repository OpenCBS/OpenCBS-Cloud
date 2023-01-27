package com.opencbs.core.officedocuments;

import com.opencbs.core.officedocuments.enums.ReportFormatType;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimplePdfExporterConfiguration;
import net.sf.jasperreports.export.SimplePdfReportConfiguration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class JasperExporterPdf implements JasperExporter {

    @Override
    public ResponseEntity export(JasperPrint jasperPrint) throws JRException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        JRPdfExporter exporter = new JRPdfExporter();

        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporter.setExporterOutput(
                new SimpleOutputStreamExporterOutput(baos));

        SimplePdfReportConfiguration reportConfig
                = new SimplePdfReportConfiguration();
        reportConfig.setSizePageToContent(true);
        reportConfig.setForceLineBreakPolicy(false);

        SimplePdfExporterConfiguration exportConfig
                = new SimplePdfExporterConfiguration();
        exportConfig.setMetadataAuthor("opencbs.com");
        exportConfig.setEncrypted(true);
        exportConfig.setAllowedPermissionsHint("PRINTING");

        exporter.setConfiguration(reportConfig);
        exporter.setConfiguration(exportConfig);

        exporter.exportReport();

       return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE,
                        "application/pdf")
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        String.format("attachment; filename=\"%s.pdf\"", JasperExporterHelper.getExportName(jasperPrint)))
                .body(baos.toByteArray());
    }

    @Override
    public ReportFormatType getFormatType() {
        return ReportFormatType.PDF;
    }

    @Override
    public Map<String, Object> getSpecificParameters() {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(JRParameter.IS_IGNORE_PAGINATION, Boolean.FALSE);
        return parameters;
    }
}

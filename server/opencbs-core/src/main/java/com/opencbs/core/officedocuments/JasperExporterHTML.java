package com.opencbs.core.officedocuments;

import com.opencbs.core.officedocuments.enums.ReportFormatType;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.engine.export.HtmlResourceHandler;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleHtmlExporterOutput;
import org.apache.commons.codec.binary.Base64;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class JasperExporterHTML implements JasperExporter {

    @Override
    public ResponseEntity export(JasperPrint jasperPrint) throws JRException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Map<String, String> images = new HashMap<>();

        HtmlExporter exporter = new  HtmlExporter();
        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        final SimpleHtmlExporterOutput simpleHtmlExporterOutput = new SimpleHtmlExporterOutput(baos);

        simpleHtmlExporterOutput.setImageHandler(new HtmlResourceHandler() {
            @Override
            public void handleResource(String id, byte[] data) {
                images.put(id, String.format("data:image/jpg;base64,%s",new String(Base64.encodeBase64(data))));
            }

            @Override
            public String getResourcePath(String id) {
                return images.get(id);
            }
        });

        exporter.setExporterOutput(simpleHtmlExporterOutput);
        exporter.exportReport();

        final ResponseEntity responseEntity = ResponseEntity
                .ok().body(baos.toByteArray());
        return responseEntity;
    }

    @Override
    public ReportFormatType getFormatType() {
        return ReportFormatType.HTML;
    }

    @Override
    public Map<String, Object> getSpecificParameters() {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(JRParameter.IS_IGNORE_PAGINATION, Boolean.TRUE);
        return parameters;
    }
}

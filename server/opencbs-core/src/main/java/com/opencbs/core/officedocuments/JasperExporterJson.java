package com.opencbs.core.officedocuments;

import com.opencbs.core.officedocuments.enums.ReportFormatType;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.JsonMetadataExporter;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

//http://jasperreports.sourceforge.net/sample.reference/subreport/index.html#jsonmetadataexport
@Service
public class JasperExporterJson implements JasperExporter {

    @Override
    public ResponseEntity export(JasperPrint report) throws JRException {
        JsonMetadataExporter jsonMetadataExporter = new JsonMetadataExporter();
        return null;
    }

    @Override
    public ReportFormatType getFormatType() {
        return ReportFormatType.JSON;
    }

    @Override
    public Map<String, Object> getSpecificParameters() {
        return null;
    }
}

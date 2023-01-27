package com.opencbs.core.officedocuments;

import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.officedocuments.enums.ReportFormatType;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class JasperExporterHelper {

    private final List<JasperExporter> jasperExporters;


    public static String getExportName(JasperPrint jasperPrint) {
        return String.format("%s_%s", jasperPrint.getName(), DateHelper.getLocalDateTimeNow().toString());
    }

    public JasperExporter getExporter(ReportFormatType reportFormatType) {
        if (reportFormatType == null) {
            reportFormatType = ReportFormatType.PDF;
        }
        for (JasperExporter jasperExporter : jasperExporters) {
            if (jasperExporter.getFormatType().equals(reportFormatType)) {
                return jasperExporter;
            }
        }

        throw new IllegalArgumentException(String.format("Not found destination type for ReportFormatType: %s", reportFormatType));
    }
}

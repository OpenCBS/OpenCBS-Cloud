package com.opencbs.core.officedocuments.services;

import com.opencbs.core.configs.properties.TemplateProperty;
import com.opencbs.core.officedocuments.JasperExporter;
import com.opencbs.core.officedocuments.JasperExporterHelper;
import com.opencbs.core.officedocuments.domain.ExcelRequest;
import com.opencbs.core.officedocuments.domain.ExcelTemplate;
import com.opencbs.core.officedocuments.domain.JasperTemplate;
import com.opencbs.core.officedocuments.domain.fields.DocumentField;
import com.opencbs.core.officedocuments.domain.fields.DocumentFieldMapper;
import com.opencbs.core.officedocuments.enums.LoaderServiceType;
import com.opencbs.core.officedocuments.enums.ReportFormatType;
import com.opencbs.core.reports.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@RequiredArgsConstructor
@Service
public class JasperReportService implements ReportService<ExcelTemplate, ExcelRequest> {

    public final static String DOCUMENT_FORMAT = "format";

    private final String TEMPLATE_FOLDER_NAME = "jasper";
    private final String JASPER_EXTENSION = ".jrxml";

    private final String META_POINT = "meta.point";
    private final String META_NAME = "meta.name";
    private final String META_LABEL = "meta.label";
    private final String META_GROUP = "meta.group";

    private static Map<String, JasperTemplate> jasperTemplates = new HashMap<>();
    private final TemplateProperty templateProperty;
    private final DataSource dataSource;
    private final JasperExporterHelper jasperExporterHelper;


    @PostConstruct
    private void init() throws Exception {
        Path reportsFolder = templateProperty.getPath().resolve(TEMPLATE_FOLDER_NAME);
        if (!this.isDirectoryExist(reportsFolder)){
            log.warn("Directory for JASPER reports with name {} not found", reportsFolder.toString());
            return;
        }

        this.loadReportFromFolder(reportsFolder);
    }

    private void loadReportFromFolder(Path reportsFolder) throws Exception {
        File[] reports = reportsFolder.toFile().listFiles((dir, name) ->
                name.endsWith(JASPER_EXTENSION));
        if (reports==null) {
            return;
        }

        for (File report: reports ) {
            this.loadTemplate(report);
        }
    }

    private void loadTemplate(File report) throws Exception {
        log.info(String.format("Load jasper report %s", report.toPath()));
        JasperReport jasperReport = this.getJasperReport(report);
        JasperTemplate jasperTemplate = this.loadTemplateFromJasperReport(jasperReport);
        if (jasperTemplates.get(jasperTemplate.getName()) != null) {
            log.warn("Jasper report from file %s with name %s and label %s will be reload.",
                    report.getName(), jasperTemplate.getName(), jasperTemplate.getLabel());
        }
        jasperTemplate.setFileName(report.getPath());
        jasperTemplate.setCheckSum(this.getCheckSum(report));
        jasperTemplate.setCompliedJasperReport(jasperReport);
        jasperTemplates.put(jasperTemplate.getName(), jasperTemplate);
    }

    private boolean isDirectoryExist(Path folder) {
        File directory = new File(folder.toString());
        return directory.exists();
    }

    public List<ExcelTemplate> getReports(){
        final List<ExcelTemplate> excelTemplates = jasperTemplates.values().stream()
                .map(template -> (ExcelTemplate) template)
                .collect(Collectors.toList());
        return excelTemplates;
    }

    private JasperTemplate loadTemplateFromJasperReport(JasperReport jasperReport) throws JRException {
        final JasperTemplate jasperTemplate = new JasperTemplate();
        String metaValue = jasperReport.getProperty(META_POINT);
        if (StringUtils.isEmpty(metaValue)) {
            throw new IllegalArgumentException(String.format("Not found property: %s", META_POINT));
        }
        jasperTemplate.setPoint(metaValue);

        metaValue = jasperReport.getProperty(META_NAME);
        if (StringUtils.isEmpty(metaValue)) {
            throw new IllegalArgumentException(String.format("Not found property: %s", META_NAME));
        }
        jasperTemplate.setName(metaValue);

        metaValue = jasperReport.getProperty(META_GROUP);
        if (StringUtils.isEmpty(metaValue)) {
            throw new IllegalArgumentException(String.format("Not found property: %s", META_GROUP));
        }
        jasperTemplate.setGroup(metaValue);

        metaValue = jasperReport.getProperty(META_LABEL);
        if (StringUtils.isEmpty(metaValue)) {
            throw new IllegalArgumentException(String.format("Not found property: %s", META_LABEL));
        }
        jasperTemplate.setLabel(metaValue);

        final List<DocumentField> documentFields = Stream.of(jasperReport.getParameters())
                .filter(jrParameter -> jrParameter.isForPrompting() && !jrParameter.isSystemDefined())
                .map(DocumentFieldMapper::fromJRParameter)
                .collect(Collectors.toList());
        jasperTemplate.setFields(documentFields);

        jasperTemplate.setLoaderType(LoaderServiceType.JASPER_LOADER);
        return jasperTemplate;
    }

    private JasperReport getJasperReport(File reportFile) throws Exception {
        try(InputStream fis = new FileInputStream(reportFile)){
            return JasperCompileManager.compileReport(fis);
        }
    }

    private JasperPrint getReport(ExcelRequest request, JasperExporter exporter) throws Exception {
        JasperTemplate jasperTemplate = jasperTemplates.get(request.getReportName());
        if (jasperTemplate==null) {
            new IllegalArgumentException(String.format("Not found template with name: %s", request.getReportName()));
        }
        if ( this.getCheckSum(new File(jasperTemplate.getFileName())).compareTo(jasperTemplate.getCheckSum())!=0) {
            this.loadTemplate(new File(jasperTemplate.getFileName()));
        }

        final JasperReport jasperReport = jasperTemplates.get(jasperTemplate.getName()).getCompliedJasperReport();

        Map<String, Object> parameters = new HashMap<>();
        parameters.putAll(request.getFieldsValues());
        parameters.putAll(exporter.getSpecificParameters());

        JasperPrint jasperPrint = null;
        try(Connection connection = this.dataSource.getConnection()){
            jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, connection);
        }

        return jasperPrint;
    }

    @Override
    public List<ExcelTemplate> getDocumentsByPoint(String point) {
        return jasperTemplates.values().stream().filter(et->point.equals(et.getPoint())).collect(Collectors.toList());
    }

    @Override
    public List<ExcelTemplate> getDocumentBySearch(String search) {
        throw new UnsupportedOperationException();
    }

    @Override
    public List<ExcelTemplate> getDocumentsByGroup(String group) {
        throw new UnsupportedOperationException();
    }

    @Override
    public ResponseEntity getDocuments(ExcelRequest request) throws Exception {
        ReportFormatType reportFormatType = ReportFormatType.valueOf(request.getFieldsValues().get(DOCUMENT_FORMAT));
        JasperExporter exporter = this.jasperExporterHelper.getExporter(reportFormatType);
        final JasperPrint report = this.getReport(request, exporter);

        return exporter.export(report);
    }

    private String getCheckSum(File report) throws Exception {
        try (InputStream is = Files.newInputStream(report.toPath())) {
            return org.apache.commons.codec.digest.DigestUtils.md5Hex(is);
        }
    }
}


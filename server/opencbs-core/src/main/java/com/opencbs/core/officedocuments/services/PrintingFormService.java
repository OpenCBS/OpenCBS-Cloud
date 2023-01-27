package com.opencbs.core.officedocuments.services;

import com.opencbs.core.configs.properties.TemplateProperty;
import com.opencbs.core.officedocuments.domain.PrintingFormRequest;
import com.opencbs.core.officedocuments.domain.Template;
import com.opencbs.core.officedocuments.repositories.DocumentRepository;
import com.opencbs.core.reports.ReportService;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.opencbs.core.officedocuments.helpers.TemplateHelper.getObjectFromJson;

@Slf4j
@Service
public class PrintingFormService extends AbstractDocumentService<Template> implements ReportService<Template, PrintingFormRequest> {

    private final static String TEMPLATE_FOLDER_NAME = "printing_forms";
    private final JasperReportService jasperReportService;
    private List<Template> templates;

    @PostConstruct
    public void init() throws Exception {
        templates = this.getAllDocument();
        templates.addAll(this.loadPrintingForms());
        templates.addAll(this.jasperReportService.getReports());
        Integer idReport = 0;
        for (Template template : templates) {
            template.setId(idReport++);
        }
    }


    @Autowired
    public PrintingFormService(TemplateProperty templateProperty,
                               DocumentRepository documentRepository,
                               JasperReportService jasperReportService) throws Exception {
        super(templateProperty, documentRepository);
        this.jasperReportService = jasperReportService;
    }

    @Override
    public List<Template> getDocumentsByPoint(String point) {
        return templates.stream().filter(x -> point.equals(x.getPoint())).collect(Collectors.toList());
    }

    @Override
    public List<Template> getDocumentBySearch(String search) {
        throw new UnsupportedOperationException();
    }

    @Override
    public List<Template> getDocumentsByGroup(String group) {
        throw new UnsupportedOperationException();
    }

    public ResponseEntity getDocuments(PrintingFormRequest request) throws IOException {
        Template template = this.getTemplate(request.getTemplateId().longValue());

        Map<String, Object> zipMap = this.loadTemplate(template.getPath());

        XWPFDocument xwpfDocument = (XWPFDocument) zipMap.get("template");

        this.validateObject(xwpfDocument, "Template file not found or corrupted.");

        String script = this.getScriptByOrder(zipMap, 1, "scripts");

        this.validateObject(script, "SQL script file not found or corrupted.");

        Map<String, Object> data;

        Map<String, String> fieldValues = new HashMap<>();
        if (request.getFieldsValues() != null) fieldValues.putAll(request.getFieldsValues());
        fieldValues.put("contractId", String.valueOf(request.getEntityId()));
        data = this.documentRepository.getStaticJsonData(this.getPreparedScript(fieldValues, script));

        return this.replaceAndGetDocument(xwpfDocument, data, template);
    }

    protected ResponseEntity.BodyBuilder getBody(String fileName) {
        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE,
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml")
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        String.format("attachment; filename=\"%s.docx\"", fileName));
    }

    public ResponseEntity getDocumentBy(Map<String, Object> data, String templateName) throws IOException {
        Assert.notNull(data, "No data.");
        Template template = this.getTemplateByName(templateName);
        Map<String, Object> zipMap = this.loadTemplate(template.getPath());
        XWPFDocument xwpfDocument = (XWPFDocument) zipMap.get("template");
        return this.replaceAndGetDocument(xwpfDocument, data, template);
    }

    protected String getPreparedScript(Map<String, String> fieldsValues, String script) {
        String result = script;
        for (Map.Entry<String, String> pair : fieldsValues.entrySet()) {
            result = result.replace(":" + pair.getKey(), pair.getValue());
        }
        return result;
    }

    protected void findAndReplace(XWPFDocument document, Map<String, Object> map) {
        Function<XWPFParagraph, Boolean> fun = paragraph -> this.replaceInParagraph(map, paragraph);
        this.foreachParagraph(document, fun);
    }

    private ResponseEntity replaceAndGetDocument(XWPFDocument xwpfDocument, Map<String, Object> data, Template template) throws IOException {
        this.findAndReplace(xwpfDocument, data);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        xwpfDocument.write(out);

        return this.getBody(template.getLabel())
                .body(new InputStreamResource(new ByteArrayInputStream(out.toByteArray())));
    }

    private void foreachParagraph(XWPFDocument source, Function<XWPFParagraph, Boolean> action) {
        for (XWPFParagraph paragraph : source.getParagraphs()) {
            if (paragraph.isEmpty()) {
                continue;
            }
            action.apply(paragraph);
        }

        for (XWPFTable table : source.getTables()) {
            for (XWPFTableRow row : table.getRows()) {
                for (XWPFTableCell cell : row.getTableCells()) {
                    for (XWPFParagraph paragraph : cell.getParagraphs()) {
                        if (paragraph.isEmpty()) {
                            continue;
                        }
                        action.apply(paragraph);
                    }
                }
            }
        }
    }

    private Boolean replaceInParagraph(Map<String, Object> replacements, XWPFParagraph paragraph) {
        if (!this.patternMatch("\\[[^\\s.]+\\]", paragraph.getText())) {
            return false;
        }
        List<XWPFRun> runs = paragraph.getRuns();

        for (Map.Entry<String, Object> replacePair : replacements.entrySet()) {
            String find = String.format("[%s]", replacePair.getKey());
            String replace = replacePair.getValue() != null ? replacePair.getValue().toString() : "";
            TextSegement found = paragraph.searchText(find, new PositionInParagraph());

            if (found != null) {
                if (found.getBeginRun() == found.getEndRun()) {
                    XWPFRun run = runs.get(found.getBeginRun());
                    String runText = run.getText(run.getTextPosition());
                    String replaced = runText.replace(find, replace);
                    run.setText(replaced, 0);
                } else {
                    StringBuilder b = new StringBuilder();

                    for (int runPos = found.getBeginRun(); runPos <= found.getEndRun(); runPos++) {
                        XWPFRun run = runs.get(runPos);
                        b.append(run.getText(run.getTextPosition()));
                    }

                    String connectedRuns = b.toString();
                    String replaced = connectedRuns.replace(find, replace);

                    XWPFRun partOne = runs.get(found.getBeginRun());
                    partOne.setText(replaced, 0);

                    for (int runPos = found.getBeginRun() + 1; runPos <= found.getEndRun(); runPos++) {
                        XWPFRun partNext = runs.get(runPos);
                        partNext.setText("", 0);
                    }
                }
            }
        }
        return true;
    }

    @Override
    Path getPath() {
        return this.templateProperty.getPath().resolve(TEMPLATE_FOLDER_NAME);
    }

    @Override
    String getDocumentPattern() {
        return ".+\\.docx$";
    }

    @Override
    int getScriptOrder(String name) {
        return 1;
    }

    @Override
    Template getDocumentMeta(InputStream is) throws IOException {
        return getObjectFromJson(this.convertToString(is), Template.class);
    }

    @Override
    XWPFDocument getDocumentFromInputStream(InputStream is) throws IOException {
        return new XWPFDocument(is);
    }

    @Override
    String getTemplateFolderName() {
        return TEMPLATE_FOLDER_NAME;
    }
}

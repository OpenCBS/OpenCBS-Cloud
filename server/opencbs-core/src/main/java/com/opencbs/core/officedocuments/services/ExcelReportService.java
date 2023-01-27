package com.opencbs.core.officedocuments.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.configs.properties.TemplateProperty;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.enums.CustomFieldType;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.officedocuments.domain.*;
import com.opencbs.core.officedocuments.domain.fields.DocumentFieldValue;
import com.opencbs.core.officedocuments.enums.LoaderServiceType;
import com.opencbs.core.officedocuments.enums.ReportFormatType;
import com.opencbs.core.officedocuments.helpers.TemplateHelper;
import com.opencbs.core.officedocuments.repositories.DocumentRepository;
import com.opencbs.core.reports.Report;
import com.opencbs.core.reports.ReportService;
import com.opencbs.core.workers.LookupWorker;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.nio.file.Path;
import java.util.*;
import java.util.function.BiFunction;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.opencbs.core.officedocuments.helpers.TemplateHelper.getObjectFromJson;


@Component
public class ExcelReportService extends AbstractDocumentService<ExcelTemplate> implements ReportService<ExcelTemplate, ExcelRequest> {

    private final LookupWorker lookupWorker;
    private final static String TEMPLATE_FOLDER_NAME = "excel_reports";
    private final static String DOCUMENT_FORMAT = "format";
    private final List<Report> excelReports;
    private List<ExcelTemplate> excelTemplates;
    private final JasperReportService jasperReportService;

    @PostConstruct
    public void init() throws Exception {
        excelTemplates = this.getAllDocument();
        excelTemplates.addAll(getReports());
        this.excelTemplates.addAll(this.jasperReportService.getReports());
        Integer idReport = 0;
        for (ExcelTemplate template : excelTemplates) {
            template.setId(idReport++);
        }
    }

    @Autowired
    public ExcelReportService(TemplateProperty templateProperty,
                              DocumentRepository documentRepository,
                              LookupWorker lookupWorker,
                              Optional<List<Report>> excelReports,
                              JasperReportService jasperReportService) throws Exception {
        super(templateProperty, documentRepository);
        this.lookupWorker = lookupWorker;
        this.excelReports = excelReports.orElseGet(ArrayList::new);
        this.jasperReportService = jasperReportService;
    }

    @Override
    public List<ExcelTemplate> getDocumentsByPoint(String point) {
        return excelTemplates.stream().filter(et -> point.equals(et.getPoint())).collect(Collectors.toList());
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
    public ResponseEntity getDocuments(ExcelRequest request) throws IOException {
        ExcelTemplate template = this.getTemplate(request.getTemplateId());
        if (LoaderServiceType.EXCEL_LOADER.equals(template.getLoaderType())) {
            return printUserReportDocument(request);
        }

        return printReport(request);
    }

    private ResponseEntity printReport(ExcelRequest request) throws IOException {
        ExcelTemplate template = this.getTemplate(request.getTemplateId());
        Optional<Report> report = excelReports.stream().filter(r -> r.getName().equals(template.getName())).findFirst();
        if (!report.isPresent()) {
            throw new ResourceNotFoundException(String.format("Report with name:%s not found", template.getName()));
        }

        ResponseEntity responseEntity = this.getBody(template)
                .body(new InputStreamResource(report.get().build(request.getFieldsValues())));

        return responseEntity;
    }

    private ResponseEntity printUserReportDocument(ExcelRequest request) throws IOException {
        if (request.getFieldsValues().containsKey(DOCUMENT_FORMAT) && request.getFieldsValues().get(DOCUMENT_FORMAT).equals(ReportFormatType.JSON.toString())) {
            return getIntoJsonFormat(request);
        }

        ExcelTemplate template = this.getTemplate(request.getTemplateId());
        Map<String, Object> zipMap = this.loadTemplate(template.getPath());
        List<DocumentFieldValue> documentFieldValues = this.mapFieldsToEntity(template, request);

        XSSFWorkbook workbook = (XSSFWorkbook) zipMap.get("template");

        this.validateObject(workbook, "Template file not found or corrupted.");

        Optional<Integer> scripts = Arrays.asList(
                ((Map<String, Object>) zipMap.get("scripts")).size()
                , ((Map<String, Object>) zipMap.get("staticScripts")).size())
                .stream()
                .reduce(Integer::max);
        for (int sheetNumber = 0; sheetNumber < scripts.get(); sheetNumber++) {
            XSSFSheet sheetAt = this.getSheetByIndex(workbook, sheetNumber);

            List<TemplateItem> items = new ArrayList<>();

            BiFunction<XSSFRow, XSSFCell, Boolean> itemsDelegate = (row, cell) -> {
                String cellValue = cell.getStringCellValue();

                Optional<TemplateItem> item = TemplateHelper.createTemplateItem(cellValue);

                if (!item.isPresent()) {
                    return false;
                }

                item.get().setCell(cell);
                items.add(item.get());
                return false;
            };

            this.foreachCell(sheetAt, CellType.STRING, itemsDelegate);
            this.writeParameters(items, documentFieldValues);
            this.writeListContent(items, sheetAt, workbook, documentFieldValues, zipMap, sheetNumber);
            this.writeStaticContent(documentFieldValues, items, zipMap, sheetNumber);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        //TODO: optimize converting to byte array, list around size 100K take huge time.

        return this.getBody(template)
                .body(new InputStreamResource(new ByteArrayInputStream(out.toByteArray())));
    }

    private ResponseEntity getIntoJsonFormat(ExcelRequest request) throws IOException {
        ExcelTemplate template = this.getTemplate(request.getTemplateId());
        Map<String, Object> zipMap = this.loadTemplate(template.getPath());
        List<DocumentFieldValue> documentFieldValues = this.mapFieldsToEntity(template, request);

        XSSFWorkbook workbook = (XSSFWorkbook) zipMap.get("template");
        this.validateObject(workbook, "Template file not found or corrupted.");
        Optional<Integer> scripts = Arrays.asList(
                ((Map<String, Object>) zipMap.get("scripts")).size()
                , ((Map<String, Object>) zipMap.get("staticScripts")).size())
                .stream()
                .reduce(Integer::max);

        Map<Integer, List<Source>> data = new HashMap<>();
        for (int sheetNumber = 0; sheetNumber < scripts.get(); sheetNumber++) {
            String script = this.getScriptByOrder(zipMap, sheetNumber + 1, "scripts");
            if (script == null) {
                continue;
            }
            script = this.replaceParameters(documentFieldValues, script);
            List<Source> sources = this.documentRepository.getJsonData(script);
            data.put(sheetNumber, sources);
        }

        String jsonBody = new ObjectMapper().writeValueAsString(data);
        return new ResponseEntity(jsonBody, HttpStatus.OK);
    }

    ResponseEntity.BodyBuilder getBody(ExcelTemplate template) {
        String fileName = String.format("%s_%s", template.getLabel(), DateHelper.getLocalDateTimeNow().toString());
        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE,
                        "application/vnd.ms-excel")
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        String.format("attachment; filename=\"%s.xlsx\"", fileName));
    }

    @Override
    Path getPath() {
        return templateProperty.getPath().resolve(TEMPLATE_FOLDER_NAME);
    }

    @Override
    XSSFWorkbook getDocumentFromInputStream(InputStream is) throws IOException {
        return new XSSFWorkbook(is);
    }

    @Override
    String getDocumentPattern() {
        return ".+\\.xlsx$";
    }

    @Override
    int getScriptOrder(String name) {
        Matcher matcher = Pattern.compile("^\\d+").matcher(name);
        if (matcher.find()) {
            return Integer.valueOf(matcher.group());
        }
        throw new RuntimeException(String.format("Illegal sql script name %s", name));
    }

    @Override
    ExcelTemplate getDocumentMeta(InputStream is) throws IOException {
        return getObjectFromJson(this.convertToString(is), ExcelTemplate.class);
    }

    private void writeParameters(List<TemplateItem> items, List<DocumentFieldValue> documentFieldValues) {
        for (TemplateItem item : items) {
            if (!item.getKey().equals(SourceEnum.PARAMETERS)) {
                continue;
            }

            Optional<DocumentFieldValue> valueByFieldName =
                    this.getValueByFieldName(documentFieldValues, item.getName());

            if (!valueByFieldName.isPresent()) {
                continue;
            }
            this.setCellValue(item.getCell(), valueByFieldName.get().getReplaceValue());
            item.setApplied(true);
        }
    }

    private void writeListContent(List<TemplateItem> items,
                                  XSSFSheet sheetAt,
                                  XSSFWorkbook workbook,
                                  List<DocumentFieldValue> documentFieldValues,
                                  Map<String, Object> zipMap,
                                  int sheetNumber) throws IOException {
        String script = this.getScriptByOrder(zipMap, sheetNumber + 1, "scripts");

        if (script == null) {
            return;
        }

        script = this.replaceParameters(documentFieldValues, script);

        List<Source> sources = this.documentRepository.getJsonData(script);

        if (sources.isEmpty()) {
            return;
        }

        for (Source list : sources) {
            boolean isShifted = false;

            items = items
                    .stream()
                    .filter(x -> !x.isApplied() && x.getKey().equals(SourceEnum.ITEMS))
                    .collect(Collectors.toList());

            for (TemplateItem item : items) {
                if (!isShifted) {
                    sheetAt.shiftRows(item.getCell().getRowIndex() + 1,
                            sheetAt.getLastRowNum() + 1,
                            list.size() + 1,
                            true,
                            true);
                    isShifted = true;
                }

                XSSFCell cell = item.getCell();
                CellStyle style = this.cloneStyleFrom(workbook, item.getCell());

                XSSFRow headerRow = this.getRow(cell.getRow().getRowNum() - 1, sheetAt);

                XSSFCell lastCell = cell;
                XSSFRow innerRow = cell.getRow();
                XSSFCell innerCell = cell;

                for (int t = 0; t < list.size(); t++) {
                    Map<String, Object> mapData = list.get(t);
                    if (!mapData.containsKey(item.getName())) {
                        continue;
                    }
                    this.setCellValue(innerCell, mapData.getOrDefault(item.getName(), null));

                    if (item.getFormat() != null) {
                        this.applyFormat(item.getFormat(), style, workbook);
                    }

                    innerCell.setCellStyle(style);
                    lastCell = innerCell;
                    innerRow = this.getRow(innerRow, sheetAt);
                    innerCell = this.getCell(cell.getColumnIndex(), innerRow);
                    item.setApplied(true);
                }
                XSSFCell headerCell = headerRow.getCell(cell.getColumnIndex());
                CellStyle footerStyle = this.cloneStyleFrom(workbook, headerCell);

                this.applyCommand(item.getCommand(), innerCell, cell, lastCell);
                if (!innerCell.equals(cell)) {
                    footerStyle.setAlignment(HorizontalAlignment.RIGHT);
                    if (item.getFormat() != null) {
                        this.applyFormat(item.getFormat(), footerStyle, workbook);
                    }
                    innerCell.setCellStyle(footerStyle);
                }
            }
        }
    }

    private void writeStaticContent(
            List<DocumentFieldValue> documentFieldValues,
            List<TemplateItem> items,
            Map<String, Object> zipMap,
            int sheetNumber) throws IOException {
        String staticString = this.getScriptByOrder(zipMap, sheetNumber + 1, "staticScripts");

        if (staticString == null) {
            return;
        }

        staticString = this.replaceParameters(documentFieldValues, staticString);

        Map<String, Object> data = this.documentRepository.getStaticJsonData(staticString);

        if (data.isEmpty()) {
            return;
        }

        items = items
                .stream()
                .filter(x -> !x.isApplied() && x.getKey().equals(SourceEnum.STATICS))
                .collect(Collectors.toList());

        for (TemplateItem item : items) {
            if (!data.keySet().contains(item.getName())) {
                continue;
            }
            this.setCellValue(item.getCell(), data.get(item.getName()));
        }
    }

    private void applyFormat(String stringFormat, CellStyle style, XSSFWorkbook workbook) {
        XSSFDataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat(stringFormat));
    }

    private void applyCommand(String command, XSSFCell currentCell, XSSFCell firstCell, XSSFCell lastCell) {
        if (command == null) {
            return;
        }
        if (command.equals("total")) {
            currentCell.setCellFormula(String.format("SUM(%s:%s)",
                    firstCell.getAddress().toString(),
                    lastCell.getAddress().toString()));
            currentCell.setCellType(CellType.FORMULA);
        }
    }

    private CellStyle cloneStyleFrom(Workbook workbook, XSSFCell cell) {
        CellStyle style = workbook.createCellStyle();
        style.cloneStyleFrom(cell.getCellStyle());
        return style;
    }

    private String replaceParameters(List<DocumentFieldValue> values, String script) {
        if (script == null) {
            return null;
        }

        for (DocumentFieldValue value : values) {
            if (value.getField().getFieldType().equals(CustomFieldType.NUMERIC)
                    || value.getField().getFieldType().equals(CustomFieldType.LOOKUP)) {
                script = script.replace(String.format(":%s", value.getField().getName()), value.getValue());
                continue;
            }
            script = script.replace(String.format(":%s", value.getField().getName()), String.format("'%s'", value.getValue()));
        }
        return script;
    }

    private XSSFRow getRow(int rowNum, XSSFSheet sheetAt) {
        return sheetAt.getRow(rowNum) != null
                ? sheetAt.getRow(rowNum)
                : sheetAt.createRow(rowNum);
    }

    private XSSFRow getRow(XSSFRow row, XSSFSheet sheetAt) {

        if (sheetAt.getRow(row.getRowNum() + 1) != null) {
            return sheetAt.getRow(row.getRowNum() + 1);
        }
        CellCopyPolicy cellCopyPolicy = new CellCopyPolicy();
        cellCopyPolicy.setCopyMergedRegions(true);
        cellCopyPolicy.setCopyCellValue(false);
        sheetAt.copyRows(Arrays.asList(row), row.getRowNum() + 1, cellCopyPolicy);
        return sheetAt.getRow(row.getRowNum() + 1);
    }

    private XSSFCell getCell(int columnIndex, XSSFRow row) {
        return row.getCell(columnIndex) != null
                ? row.getCell(columnIndex)
                : row.createCell(columnIndex);
    }

    private void foreachCell(XSSFSheet source, CellType cellType, BiFunction<XSSFRow, XSSFCell, Boolean> action) {
        for (int rowNum = source.getFirstRowNum(); rowNum <= source.getLastRowNum(); rowNum++) {
            XSSFRow row = source.getRow(rowNum);

            if (row == null) continue;

            for (int cellNum = row.getFirstCellNum(); cellNum <= row.getLastCellNum(); cellNum++) {
                if (cellNum < 0) {
                    continue;
                }
                XSSFCell cell = row.getCell(cellNum);

                if (cell == null) continue;

                if (!cell.getCellTypeEnum().equals(cellType)) continue;


                if (action.apply(row, cell)) {
                    cellNum = cell.getColumnIndex() - 1;
                }
            }
        }
    }

    private void setCellValue(XSSFCell cell, Object o) {
        if (o == null) {
            cell.setCellValue("");
            return;
        }

        if (o instanceof Double) {
            cell.setCellValue((Double) o);
            cell.setCellType(CellType.NUMERIC);
            return;
        }

        if (o instanceof Integer) {
            cell.setCellValue((Integer) o);
            cell.setCellType(CellType.NUMERIC);
            return;
        }

        if (o instanceof Boolean) {
            cell.setCellValue((Boolean) o);
            cell.setCellType(CellType.BOOLEAN);
            return;
        }

        if (o instanceof Date) {
            cell.setCellValue((Date) o);
        }

        cell.setCellValue(String.valueOf(o));
    }

    private XSSFSheet getSheetByIndex(XSSFWorkbook book, int index) {
        return book.getSheetAt(index);
    }

    private List<DocumentFieldValue> mapFieldsToEntity(ExcelTemplate template, ExcelRequest request) {
        return template.getFields()
                .stream()
                .map(x -> {
                    DocumentFieldValue documentFieldValue = new DocumentFieldValue();
                    documentFieldValue.setField(x);
                    if (!request.getFieldsValues().containsKey(x.getName()) && x.isRequired()) {
                        throw new IllegalArgumentException(String.format("%s is required.", x.getCaption()));
                    }

                    if (request.getFieldsValues().containsKey(x.getName())
                            && !StringUtils.isEmpty(request.getFieldsValues().get(x.getName()))) {
                        String value = request.getFieldsValues().get(x.getName());
                        String replaceValue = request.getFieldsValues().get(x.getName());
                        if (x.getExtra() != null && x.getExtra().containsKey("key")) {
                            replaceValue = this.getParameterName(String.valueOf(x.getExtra().get("key")), Long.valueOf(value));
                        }

                        // TODO: It is temp fix for date format. Need to add data type to meta file in reports
                        if (x.getFieldType().equals(CustomFieldType.DATE)) {
                            replaceValue = replaceValue.substring(0, 10);
                        }

                        documentFieldValue.setValue(value);
                        documentFieldValue.setReplaceValue(replaceValue);
                        return documentFieldValue;
                    }
                    documentFieldValue.setValue(x.getDefaultValue());
                    documentFieldValue.setReplaceValue("All");
                    return documentFieldValue;
                })
                .collect(Collectors.toList());
    }

    private String getParameterName(String type, long id) {
        Optional<BaseEntity> key = this.lookupWorker.getLookup(type, id);
        if (key.isPresent()) {
            BaseEntity baseEntity = key.get();
            Class<? extends BaseEntity> clz = baseEntity.getClass();
            try {
                Field field = ReflectionUtils.findField(clz, "name");
                field.setAccessible(true);
                return String.valueOf(field.get(baseEntity));
            } catch (Exception ex) {
                try {
                    Field firstName = clz.getDeclaredField("firstName");
                    firstName.setAccessible(true);
                    Field lastName = clz.getDeclaredField("lastName");
                    lastName.setAccessible(true);
                    return firstName.get(baseEntity) + " " + lastName.get(baseEntity);
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    return "ERROR";
                }
            }
        }
        return "All";
    }

    private Optional<DocumentFieldValue> getValueByFieldName(List<DocumentFieldValue> values, String name) {
        return values
                .stream()
                .filter(x -> x.getField().getName().equals(name))
                .findFirst();
    }

    protected List<ExcelTemplate> getReports() {
        return excelReports.stream()
                .map(ExcelReportService::createExcelTemplate)
                .collect(Collectors.toList());
    }

    private static ExcelTemplate createExcelTemplate(Report report) {
        ExcelTemplate excelTemplate = new ExcelTemplate();

        excelTemplate.setLabel(report.getLabel());
        excelTemplate.setName(report.getName());
        excelTemplate.setGroup(report.getGroup());
        excelTemplate.setFields(report.getParameters());
        excelTemplate.setPoint(report.getPoint());
        excelTemplate.setLoaderType(LoaderServiceType.EXCEL_LOADER);
        return excelTemplate;
    }

    @Override
    String getTemplateFolderName() {
        return TEMPLATE_FOLDER_NAME;
    }
}

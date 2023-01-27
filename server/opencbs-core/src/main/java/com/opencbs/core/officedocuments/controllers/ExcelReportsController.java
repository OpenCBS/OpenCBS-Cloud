package com.opencbs.core.officedocuments.controllers;

import com.opencbs.core.exceptions.ValidationException;
import com.opencbs.core.officedocuments.domain.ExcelRequest;
import com.opencbs.core.officedocuments.domain.ExcelTemplate;
import com.opencbs.core.officedocuments.services.ExcelReportService;
import com.opencbs.core.officedocuments.services.JasperReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor

@RestController
@RequestMapping (value = "/api/reports")
@SuppressWarnings("unused")
public class ExcelReportsController {

    private final ExcelReportService excelReportService;
    private final JasperReportService jasperReportService;


    @GetMapping
    public List<ExcelTemplate> getByPoint(@RequestParam(value = "point") String point) throws IOException, ValidationException {
        return this.excelReportService.getDocumentsByPoint(point);
    }

    @GetMapping(value = "/by-search")
    public List<ExcelTemplate> getBySearch(@RequestParam(value = "point") String point,
                                           @RequestParam(value = "search") String search) throws IOException, ValidationException {
        return this.excelReportService.getDocumentBySearch(search);
    }

    @GetMapping(value = "/by-group")
    public List<ExcelTemplate> getByGroup(@RequestParam(value = "point") String point,
                                          @RequestParam(value = "group") String group) throws IOException, ValidationException {
        return this.excelReportService.getDocumentsByGroup(group);
    }

    @PostMapping(value = "/excel")
    @ResponseBody
    public ResponseEntity getExcelReport(@RequestBody ExcelRequest request) throws Exception {
        return this.excelReportService.getDocuments(request);
    }

    @PostMapping(value = "/json")
    @ResponseBody
    public ResponseEntity getReport(@RequestBody ExcelRequest request) throws Exception {
        return this.excelReportService.getDocuments(request);
    }

    @PostMapping(value = "/{reportName}")
    @ResponseBody
    public ResponseEntity getReport(@PathVariable String reportName, @RequestBody ExcelRequest request) throws Exception {
        return this.jasperReportService.getDocuments(request);
    }
}

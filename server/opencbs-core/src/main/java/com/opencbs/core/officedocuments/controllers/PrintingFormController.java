package com.opencbs.core.officedocuments.controllers;

import com.opencbs.core.officedocuments.domain.ExcelRequest;
import com.opencbs.core.officedocuments.domain.PrintingFormRequest;
import com.opencbs.core.officedocuments.domain.Template;
import com.opencbs.core.officedocuments.services.JasperReportService;
import com.opencbs.core.officedocuments.services.PrintingFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/printing-forms")
public class PrintingFormController {

    private final PrintingFormService printingFormService;
    private final JasperReportService jasperReportService;

    @GetMapping
    public List<Template> getByPoint(@RequestParam(value = "point") String point) throws Exception {
        return printingFormService.getDocumentsByPoint(point);
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity getForm(@RequestBody ExcelRequest request)
            throws Exception {
        return this.jasperReportService.getDocuments(request);
    }

    @PostMapping(value = "/excel")
    @ResponseBody
    public ResponseEntity getExcelForm(@RequestBody PrintingFormRequest request)
            throws IOException {
        return this.printingFormService.getDocuments(request);
    }

    @PostMapping(value = "/word")
    @ResponseBody
    public ResponseEntity getWordForm(@RequestBody PrintingFormRequest request)
            throws IOException {
        return this.printingFormService.getDocuments(request);
    }

}

package com.opencbs.loans.controllers;

import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.responses.ApiResponse;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.loans.domain.enums.SepaDocumentType;
import com.opencbs.loans.dto.sepaintegration.SepaDocumentDto;
import com.opencbs.loans.dto.sepaintegration.SepaIntegrationExportDto;
import com.opencbs.loans.dto.sepaintegration.SepaRepaymentDto;
import com.opencbs.loans.services.sepaintegration.SepaDocumentService;
import com.opencbs.loans.services.sepaintegration.SepaIntegrationService;
import io.jsonwebtoken.lang.Assert;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sepa/integration")
@RequiredArgsConstructor
public class SepaIntegrationController {

    private final SepaIntegrationService sepaIntegrationService;
    private final SepaDocumentService sepaDocumentService;

    @GetMapping("/export/file-list")
    @PermissionRequired(name = "SEPA", moduleType = ModuleType.SEPA, description = "")
    public Page<SepaDocumentDto> getExportedFiles(
            Pageable pageable
    ){
        return sepaDocumentService.findAllByType(pageable, SepaDocumentType.EXPORT);
    }

    @GetMapping("/import/file-list")
    @PermissionRequired(name = "SEPA", moduleType = ModuleType.SEPA, description = "")
    public Page<SepaDocumentDto> getImportedFiles(
            Pageable pageable
    ){
        return sepaDocumentService.findAllByType(pageable, SepaDocumentType.IMPORT);
    }

    @GetMapping("/export/generate-for-date")
    @PermissionRequired(name = "SEPA", moduleType = ModuleType.SEPA, description = "")
    public ApiResponse<List<SepaIntegrationExportDto>> getLoanInstallmentsForDate(
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            @RequestParam("date") LocalDate requiredDate
    ){
        return new ApiResponse<>(sepaIntegrationService.getSepaIntegrationExportDtosByDate(requiredDate));
    }

    @PostMapping("/export/export-xml")
    @PermissionRequired(name = "SEPA", moduleType = ModuleType.SEPA, description = "")
    public String getGeneratedXML(
            HttpServletResponse httpServletResponse,
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            @RequestParam("date") LocalDate requiredDate,
            @RequestBody List<String> codes
    ){
        Assert.isTrue(!codes.isEmpty(), "At least one row required to export XML file");
        httpServletResponse.setContentType("application/xml");
        return sepaIntegrationService.getSepaExportXML(codes, requiredDate);
    }

    @PostMapping(value = "/import/parse-xml")
    @PermissionRequired(name = "SEPA", moduleType = ModuleType.SEPA, description = "")
    public ApiResponse<SepaRepaymentDto> parseSepaXmlFile(
            @RequestParam("file") MultipartFile importFile
    ){
        Assert.isTrue(importFile.getContentType().equals(MediaType.TEXT_XML_VALUE), "Imported file should be *.xml");
        return new ApiResponse<>(sepaIntegrationService.uploadAndParseXMLFile(importFile));
    }

    @PostMapping("/import/repay")
    @PermissionRequired(name = "SEPA", moduleType = ModuleType.SEPA, description = "")
    public ApiResponse<Boolean> repaySepaLoans(
            @RequestBody SepaRepaymentDto repaymentDto
    ){
        Assert.isTrue(!repaymentDto.getData().isEmpty(), "No payments to repay");
        sepaIntegrationService.sepaRepayment(repaymentDto);
        return new ApiResponse<>(Boolean.TRUE);
    }
}

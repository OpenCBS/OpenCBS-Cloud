package com.opencbs.loans.controllers;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.loans.domain.ImportPaymentHistory;
import com.opencbs.loans.dto.impotrpaymenthistory.ClientInfoImportPaymentHistoryIdDto;
import com.opencbs.loans.dto.impotrpaymenthistory.ImportPaymentHistoryCreateResponseDto;
import com.opencbs.loans.dto.impotrpaymenthistory.ImportPaymentHistoryDto;
import com.opencbs.loans.dto.impotrpaymenthistory.RepaymentHistoryFilterDto;
import com.opencbs.loans.services.ImportPaymentHistoryService;
import com.opencbs.loans.validators.ImportPaymentHistoryDtoValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/payment-gateway")
@RequiredArgsConstructor
public class ImportPaymentHistoryController extends BaseController {

    private final ImportPaymentHistoryService service;
    private final ImportPaymentHistoryDtoValidator validator;

    @GetMapping
    @PermissionRequired(name = "OXUS", moduleType = ModuleType.OXUS, description = "")
    public List<ImportPaymentHistoryDto> get(RepaymentHistoryFilterDto filterDto) {
        return service.getList(filterDto);
    }

    @GetMapping("/code")
    @PermissionRequired(name = "OXUS_CLIENT", moduleType = ModuleType.OXUS, description = "")
    public ClientInfoImportPaymentHistoryIdDto getClientName(String contract) {
        Person clientInfo = service.getClientInfo(contract);
        ClientInfoImportPaymentHistoryIdDto dto = new ClientInfoImportPaymentHistoryIdDto();
        dto.setName(clientInfo.getName());
        return dto;
    }

    @PostMapping("/export")
    @PermissionRequired(name = "OXUS_EXPORT", moduleType = ModuleType.OXUS, description = "")
    public ResponseEntity getExcelReport(@RequestBody List<Long> ids) throws Exception {
        List<ImportPaymentHistory> entities = service.findAllByIds(ids);
        return this.service.getImportPaymentHistoryExcel(entities);
    }


    @PostMapping
    @PermissionRequired(name = "OXUS_CREATE", moduleType = ModuleType.OXUS, description = "")
    public ImportPaymentHistoryCreateResponseDto create(@RequestBody ImportPaymentHistoryDto dto) {
        validator.validate(dto);
        ImportPaymentHistoryCreateResponseDto responseDto = new ImportPaymentHistoryCreateResponseDto();
        responseDto.setId(this.service.addPayment(dto));
        return responseDto;
    }
}


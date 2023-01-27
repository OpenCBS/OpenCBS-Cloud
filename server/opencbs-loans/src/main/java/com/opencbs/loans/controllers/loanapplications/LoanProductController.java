package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.domain.enums.AccountRuleType;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.audit.HistoryDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.dto.RequestDto;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.loans.dto.products.LoanProductDetailsDto;
import com.opencbs.loans.dto.products.LoanProductDto;
import com.opencbs.loans.dto.products.LoanProductLookupDto;
import com.opencbs.loans.dto.requests.LoanProductRequest;
import com.opencbs.loans.mappers.LoanProductMapper;
import com.opencbs.loans.services.LoanProductService;
import com.opencbs.loans.validators.LoanProductValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = "/api/loan-products")
@SuppressWarnings("unused")
@RequiredArgsConstructor
public class LoanProductController {

    private final LoanProductService loanProductService;
    private final LoanProductValidator loanProductValidator;
    private final LoanProductMapper loanProductMapper;
    private final MakerCheckerWorker makerCheckerWorker;


    @GetMapping
    public Page<LoanProductDetailsDto> get(Pageable pageable, @RequestParam(name = "show_all", defaultValue = "false") Boolean showAll ) {
        if (showAll) {
            return this.loanProductService.findAll(pageable).map(LoanProductController.this.loanProductMapper::mapEntityToDto);
        }

        return this.loanProductService.findActiveLoanProduct(pageable)
                .map(LoanProductController.this.loanProductMapper::mapEntityToDto);
    }

    @GetMapping(value = "/{id}")
    public LoanProductDetailsDto get(@PathVariable long id) throws ResourceNotFoundException {
        return this.loanProductService
                .getOne(id)
                .map(this.loanProductMapper::mapEntityToDto)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan product not found (ID=%d).", id)));
    }

    @PermissionRequired(name = "MAKER_FOR_LOAN_PRODUCT", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PostMapping
    public RequestDto create(@RequestBody LoanProductDto loanProductDto) throws Exception {
        this.loanProductValidator.validate(loanProductDto);
        Request request = this.makerCheckerWorker.create(RequestType.LOAN_PRODUCT_CREATE, loanProductDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @PermissionRequired(name = "MAKER_FOR_LOAN_PRODUCT", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PutMapping(value = "/{id}")
    public RequestDto update(@PathVariable long id, @RequestBody LoanProductDto loanProductDto) throws Exception {
        this.loanProductService.getOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan product not found (ID=%d)", id)));
        loanProductDto.setId(id);
        this.loanProductValidator.validate(loanProductDto);
        Request request = this.makerCheckerWorker.create(RequestType.LOAN_PRODUCT_EDIT, loanProductDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @GetMapping(value = "/account-rules")
    public AccountRuleType[] getAllEnums() {
        return AccountRuleType.values();
    }

    @GetMapping(value = "/lookup")
    public Page<LoanProductLookupDto> lookup(Pageable pageable, LoanProductRequest request) {
        return this.loanProductService.lookup(pageable, request).map(LoanProductController.this.loanProductMapper::mapEntityToDtoLookup);
    }

    @GetMapping(value = "/{id}/history")
    public List<HistoryDto> getHistory(@PathVariable Long id) throws Exception {
        this.loanProductService.getOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan Product not found(ID=%d).", id)));

        return loanProductService.getAllRevisions(id);
    }

    @GetMapping(value = "/{id}/history/last_change")
    public HistoryDto getLastChange(@PathVariable Long id,
                                    @RequestParam(value = "dateTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) throws Exception {
        this.loanProductService.getOne(id).orElseThrow(() -> new ResourceNotFoundException(String.format("Loan Product not found(ID=%d).", id)));
        return this.loanProductService.getRevisionByDate(id, dateTime);
    }
}

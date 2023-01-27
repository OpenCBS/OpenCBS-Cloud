package com.opencbs.termdeposite.controllers;

import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.audit.HistoryDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.dto.RequestDto;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.termdeposite.domain.TermDepositProduct;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;
import com.opencbs.termdeposite.dto.TermDepositProductDetailsDto;
import com.opencbs.termdeposite.dto.TermDepositProductDto;
import com.opencbs.termdeposite.services.TermDepositProductsService;
import com.opencbs.termdeposite.validators.TermDepositProductValidator;
import com.opencbs.termdeposite.work.TermDepositProductWork;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping(value = "/api/term-deposit-products")
@SuppressWarnings("unused")
@RequiredArgsConstructor
public class TermDepositProductController {

    private final TermDepositProductWork termDepositProductWork;
    private final MakerCheckerWorker makerCheckerWorker;
    private final TermDepositProductsService termDepositProductsService;
    private final TermDepositProductValidator termDepositProductValidator;


    @GetMapping
    public Page get(Pageable pageable,
                    @RequestParam(value = "search", required = false) String searchString, @RequestParam(name = "show_all", defaultValue = "false") Boolean showAll) {
        return termDepositProductWork.getAll(pageable, searchString, showAll);
    }

    @GetMapping(value = "/{id}")
    public TermDepositProductDetailsDto get(@NonNull @PathVariable Long id) throws ResourceNotFoundException {
        return this.termDepositProductWork.getById(id);
    }

    @PermissionRequired(name = "MAKER_FOR_TERM_DEPOSIT_PRODUCT", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PostMapping
    public RequestDto create(@RequestBody TermDepositProductDto termDepositProductDto) throws Exception {
        this.termDepositProductValidator.validateOnCreate(termDepositProductDto);
        Request request = this.makerCheckerWorker.create(RequestType.TERM_DEPOSIT_PRODUCT_CREATE, termDepositProductDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @PermissionRequired(name = "MAKER_FOR_TERM_DEPOSIT_PRODUCT", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PutMapping(value = "/{id}")
    public RequestDto update(@PathVariable Long id,
                             @RequestBody TermDepositProductDto termDepositProductDto) throws Exception {
        Optional<TermDepositProduct> termDepositsProductOptional = this.termDepositProductsService.getOne(id);
        if (!termDepositsProductOptional.isPresent()) {
            throw new ResourceNotFoundException(String.format("Term deposit product not found (ID=%d)", id));
        }
        termDepositProductDto.setId(id);
        this.termDepositProductValidator.validateOnUpdate(termDepositProductDto);
        Request request = this.makerCheckerWorker.create(RequestType.TERM_DEPOSIT_PRODUCT_EDIT, termDepositProductDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @GetMapping(value = "/account-rules")
    public TermDepositAccountType[] getAllEnums() {
        return TermDepositAccountType.values();
    }

    @GetMapping(value = "/{id}/history")
    public List<HistoryDto> getHistory(@PathVariable Long id) throws Exception {
        this.termDepositProductsService.getOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Term Deposit Product not found(ID=%d).", id)));

        return this.termDepositProductsService.getAllRevisions(id);
    }

    @GetMapping(value = "/{id}/history/last_change")
    public HistoryDto getLastChange(@PathVariable Long id, @RequestParam(value = "dateTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) throws Exception {
        this.termDepositProductsService.getOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Term Deposit Product not found(ID=%d).", id)));
        return this.termDepositProductsService.getRevisionByDate(id, dateTime);
    }

}
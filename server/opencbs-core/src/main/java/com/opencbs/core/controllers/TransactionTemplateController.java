package com.opencbs.core.controllers;

import com.opencbs.core.domain.TransactionTemplate;
import com.opencbs.core.dto.TransactionTemplateDetailsDto;
import com.opencbs.core.dto.TransactionTemplateDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.TransactionTemplateMapper;
import com.opencbs.core.services.TransactionTemplateService;
import com.opencbs.core.validators.TransactionTemplateValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/transaction-templates")
public class TransactionTemplateController {

    private final TransactionTemplateValidator transactionTemplateValidator;
    private final TransactionTemplateMapper transactionTemplateMapper;
    private final TransactionTemplateService transactionTemplateService;

    @PostMapping
    public TransactionTemplateDetailsDto create(@RequestBody TransactionTemplateDto transactionTemplateDto) {
        this.transactionTemplateValidator.validateOnCreate(transactionTemplateDto);
        TransactionTemplate transactionTemplate = this.transactionTemplateMapper.mapToEntity(transactionTemplateDto);
        return this.transactionTemplateMapper.mapToDto(this.transactionTemplateService.create(transactionTemplate));
    }

    @PutMapping(value = "/{id}")
    public TransactionTemplateDetailsDto update(@PathVariable Long id, @RequestBody TransactionTemplateDto transactionTemplateDto) {
        this.transactionTemplateService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Transaction Template not found(ID=%d).", id)));
        this.transactionTemplateValidator.validateOnUpdate(transactionTemplateDto, id);
        TransactionTemplate transactionTemplate = this.transactionTemplateMapper.mapToEntity(transactionTemplateDto);
        transactionTemplate.setId(id);
        return this.transactionTemplateMapper.mapToDto(this.transactionTemplateService.update(transactionTemplate));
    }

    @GetMapping(value = "/{id}")
    public TransactionTemplateDetailsDto get(@PathVariable Long id) {
        TransactionTemplate transactionTemplate = this.transactionTemplateService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Transaction Template not found(ID=%d).", id)));
        return this.transactionTemplateMapper.mapToDto(transactionTemplate);
    }

    @GetMapping
    public Page<TransactionTemplateDetailsDto> get(Pageable pageable) {
        return transactionTemplateService.findAll(pageable).map(this.transactionTemplateMapper::mapToDto);
    }

    @GetMapping(value = "/lookup")
    public Page<TransactionTemplateDetailsDto> searchTemplate(String search, Pageable pageable) {
        return this.transactionTemplateService.search(search, pageable).map(this.transactionTemplateMapper::mapToDto);
    }
}

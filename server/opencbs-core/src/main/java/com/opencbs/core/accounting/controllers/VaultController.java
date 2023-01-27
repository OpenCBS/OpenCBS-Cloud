package com.opencbs.core.accounting.controllers;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.till.Vault;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.dto.VaultDetailsDto;
import com.opencbs.core.accounting.dto.VaultDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.accounting.mappers.VaultMapper;
import com.opencbs.core.accounting.services.VaultService;
import com.opencbs.core.accounting.validators.VaultValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/vaults")
@SuppressWarnings("unused")
public class VaultController extends BaseController {

    private final VaultService vaultService;
    private final VaultMapper vaultMapper;
    private final VaultValidator vaultValidator;

    @Autowired
    public VaultController(VaultService vaultService,
                           VaultMapper vaultMapper,
                           VaultValidator vaultValidator) {
        this.vaultService = vaultService;
        this.vaultMapper = vaultMapper;
        this.vaultValidator = vaultValidator;
    }

    @GetMapping()
    public Page<VaultDetailsDto> findAll(Pageable pageable) {
        return this.vaultService.findAll(pageable)
                .map(this.vaultMapper::mapToDto);
    }

    @GetMapping(value = "/{id}")
    public VaultDetailsDto get(@PathVariable long id) throws ResourceNotFoundException {
        Vault vault = this.vaultService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Vault not found (ID=%d).", id)));
        List<Account> accounts = vault.getAccounts()
                .stream()
                .sorted(Comparator.comparing(account -> account.getCurrency().getName()))
                .collect(Collectors.toList());
        vault.setAccounts(new LinkedHashSet<>(accounts));
        return this.vaultMapper.mapToDto(vault);
    }

    @PostMapping()
    public VaultDetailsDto create(@RequestBody VaultDto vaultDto) throws ResourceNotFoundException {
        this.vaultValidator.validateOnCreate(vaultDto);
        Vault vault = this.vaultMapper.mapToEntity(vaultDto);
        return this.vaultMapper.mapToDto(this.vaultService.create(vault));
    }

    @PutMapping(value = "/{id}")
    public VaultDetailsDto update(@PathVariable long id, @RequestBody VaultDto vaultDto) throws ResourceNotFoundException {
        this.vaultService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Vault not found (ID=%d).", id)));
        vaultDto.setId(id);
        this.vaultValidator.validateOnUpdate(vaultDto);
        Vault vault = this.vaultMapper.mapToEntity(vaultDto);
        return this.vaultMapper.mapToDto(this.vaultService.update(vault));
    }
}
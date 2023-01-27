package com.opencbs.core.accounting.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.till.Vault;
import com.opencbs.core.accounting.dto.VaultDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.services.BranchService;
import com.opencbs.core.accounting.services.VaultService;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Validator
public class VaultValidator {
    private final VaultService vaultService;
    private final AccountService accountService;
    private final BranchService branchService;

    public VaultValidator(VaultService vaultService,
                          AccountService accountService, BranchService branchService) {
        this.vaultService = vaultService;
        this.accountService = accountService;
        this.branchService = branchService;
    }

    public void validate(VaultDto dto) throws ResourceNotFoundException {
        Assert.isTrue(!StringUtils.isEmpty(dto.getName()), "Name is required.");
        Assert.isTrue(!StringUtils.isEmpty(dto.getName().trim()), "Name is required.");
        Assert.notNull(dto.getBranchId(), "Branch is required.");

        this.branchService.findOne(Long.valueOf(dto.getBranchId()))
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Branch not found (ID=%d).", Long.valueOf(dto.getBranchId()))));

        Assert.notEmpty(dto.getAccounts(), "Accounts is required.");
        for (Long x : dto.getAccounts()) {
            this.accountService.findOne(x)
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found (ID=%d).", x)));
        }
    }

    public void validateOnUpdate(VaultDto dto) throws ResourceNotFoundException {
        this.validate(dto);

        Optional<Vault> optional = this.vaultService.findByName(dto.getName());
        optional.ifPresent(vault -> Assert.isTrue(vault.getId() == dto.getId(), "Name already taken."));

    }

    public void validateOnCreate(VaultDto dto) throws ResourceNotFoundException {
        this.validate(dto);
        Assert.isTrue(!this.vaultService.findByName(dto.getName()).isPresent(), "Name already taken.");
    }
}
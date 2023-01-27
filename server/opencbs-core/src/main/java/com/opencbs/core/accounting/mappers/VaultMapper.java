package com.opencbs.core.accounting.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.till.Vault;
import com.opencbs.core.accounting.dto.VaultDetailsDto;
import com.opencbs.core.accounting.dto.VaultDto;
import com.opencbs.core.repositories.BranchRepository;
import com.opencbs.core.accounting.services.AccountService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;

@Mapper
public class VaultMapper {

    private final BranchRepository branchRepository;

    private final AccountService accountService;

    @Autowired
    public VaultMapper(BranchRepository branchRepository,
                       AccountService accountService) {
        this.branchRepository = branchRepository;
        this.accountService = accountService;
    }

    public Vault mapToEntity(VaultDto dto) {
        Vault vault = new ModelMapper().map(dto, Vault.class);
        Branch branch = this.getBranch(dto.getBranchId());
        vault.setBranch(branch);
        Set<Account> accounts = this.getAccounts(dto.getAccounts());
        vault.setAccounts(accounts);
        return vault;
    }

    public VaultDetailsDto mapToDto(Vault vault) {
        return new ModelMapper().map(vault, VaultDetailsDto.class);
    }

    private Branch getBranch(long branchId) {
        return this.branchRepository.findOne(branchId);
    }

    private Set<Account> getAccounts(Set<Long> accountIds) {
        return this.accountService.findByIds(accountIds);
    }
}
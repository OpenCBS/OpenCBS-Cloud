package com.opencbs.core.controllers;

import com.opencbs.core.accounting.dto.AccountingEntryDto;
import com.opencbs.core.accounting.mappers.AccountingMapper;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.transfers.TransferBetweenMemberships;
import com.opencbs.core.domain.transfers.TransferFromBankToVault;
import com.opencbs.core.domain.transfers.TransferFromVaultToBank;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.core.services.TransferServiceHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor

@RestController
@RequestMapping(value = "/api/transfers")
@SuppressWarnings("unused")
public class TransfersController {

    private final TransferServiceHelper transferServiceHelperHelper;
    private final AccountingMapper accountingMapper;


    @PermissionRequired(name = "BANK_TO_VAULT", moduleType = ModuleType.TRANSFERS, description = "Transfer from bank to vault")
    @PostMapping(value = "/from-bank-to-vault")
    public AccountingEntryDto transferFromBankToVault(@RequestBody TransferFromBankToVault transferFromBankToVault) {
        return this.accountingMapper.mapToDto(this.transferServiceHelperHelper.transferToVault(transferFromBankToVault));
    }

    @PermissionRequired(name = "VAULT_TO_BANK", moduleType = ModuleType.TRANSFERS, description = "Transfer from vault to bank")
    @PostMapping(value = "/from-vault-to-bank")
    public AccountingEntryDto transferFromVaultToBank(@RequestBody TransferFromVaultToBank transferFromVaultToBank) {
        return this.accountingMapper.mapToDto(this.transferServiceHelperHelper.transferToBank(transferFromVaultToBank));
    }

    @PermissionRequired(name = "BETWEEN_MEMBERS", moduleType = ModuleType.TRANSFERS, description = "Transfer between members")
    @PostMapping(value = "/between-members")
    public AccountingEntryDto transferBetweenMembership(@RequestBody TransferBetweenMemberships transferBetweenMemberships) {
        return this.accountingMapper.mapToDto(this.transferServiceHelperHelper.transferBetweenMembership(transferBetweenMemberships));
    }
}

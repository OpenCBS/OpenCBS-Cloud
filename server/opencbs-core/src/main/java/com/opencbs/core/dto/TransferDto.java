package com.opencbs.core.dto;

import com.opencbs.core.accounting.dto.TillTransactionDto;
import lombok.Data;

import java.util.List;

@Data
public class TransferDto {
    private Long tillId;
    private Long vaultId;
    private List<TillTransactionDto> transactions;
    private String description;
}

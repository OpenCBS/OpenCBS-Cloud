package com.opencbs.loans.dto.sepaintegration;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class SepaIntegrationImportDto {

    private Long loanId;

    private String code;

    private String date;

    private BigDecimal amount;

    private String status;

    private String iban;

    private String profileName;

    private String description;

    private String message;

    private Boolean isValid;

    private Boolean isLoanExistsByContractCode;
}

package com.opencbs.loans.dto.sepaintegration;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class SepaIntegrationExportDto {

    private String profileName;

    private String code;

    private LocalDate date;

    private BigDecimal interest;

    private BigDecimal principal;

    private String iban;
}

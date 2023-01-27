package com.opencbs.savings.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SavingDetailsDto extends BaseSavingDto {

    private String code;
    private String profileName;
    private String profileType;
    private String savingProductName;
    private String savingOfficerName;
    private String status;
    private long profileId;
    private long savingAccountId;
    private long savingOfficerId;
    private long savingProductId;
    private BigDecimal savingProductInitialAmountMin;
    private BigDecimal savingProductInitialAmountMax;
    private BigDecimal savingProductDepositAmountMin;
    private BigDecimal savingProductDepositAmountMax;
    private BigDecimal savingProductWithdrawalAmountMin;
    private BigDecimal savingProductWithdrawalAmountMax;
    private BigDecimal savingBalance;
    private BigDecimal accruedInterest;

}
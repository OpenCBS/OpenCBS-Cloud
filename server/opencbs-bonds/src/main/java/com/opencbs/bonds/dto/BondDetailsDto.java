package com.opencbs.bonds.dto;

import com.opencbs.core.accounting.dto.AccountDto;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.User;
import com.opencbs.core.dto.profiles.ProfileDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BondDetailsDto extends BondBaseDto {
    private AccountDto bankAccount;
    private ProfileDto profile;
    private Currency equivalentCurrency;
    private User createdBy;
    private BondProductDetailsDto bondProduct;
    private BondAmountDto bondAmount;
    private BigDecimal interestToRefund;
}

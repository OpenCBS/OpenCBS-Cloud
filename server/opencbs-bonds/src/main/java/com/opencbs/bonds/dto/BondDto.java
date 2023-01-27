package com.opencbs.bonds.dto;

import lombok.Data;

@Data
public class BondDto extends BondBaseDto {
    private Long bondProductId;
    private Long profileId;
    private Long bankAccountId;
    private Long equivalentCurrencyId;
}

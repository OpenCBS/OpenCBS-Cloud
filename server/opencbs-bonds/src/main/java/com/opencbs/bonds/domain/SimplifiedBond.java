package com.opencbs.bonds.domain;

import com.opencbs.bonds.domain.enums.BondStatus;
import com.opencbs.core.domain.BaseEntity;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SimplifiedBond extends BaseEntity {

    private String isin;
    private Long profileId;
    private String profileName;
    private BigDecimal amount;
    private LocalDateTime createdAt;
    private Long createdById;
    private String createdByFirstName;
    private String createdByLastName;
    private BondStatus status;
    private BigDecimal interestRate;
    private BigDecimal penaltyRate;
    private Integer number;

    public String getCreatedBy(){
        return String.format("%s %s", this.createdByFirstName, createdByLastName);
    }
}
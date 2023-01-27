package com.opencbs.bonds.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BondExpireDateDto {
    private Long bondProductId;
    private String frequency;
    private Integer maturity;
    private LocalDate couponDate;
}

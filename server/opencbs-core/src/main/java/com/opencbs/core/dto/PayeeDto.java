package com.opencbs.core.dto;

import lombok.Data;

import java.util.Set;

@Data
public class PayeeDto extends BaseDto {
    private String name;
    private String description;
    private Set<Long> currentAccounts;
}

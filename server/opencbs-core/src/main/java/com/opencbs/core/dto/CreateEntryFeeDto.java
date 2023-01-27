package com.opencbs.core.dto;

import lombok.Data;

@Data
public class CreateEntryFeeDto extends EntryFeeDto {
    private boolean isPercentage;

    private String name;

    private Long accountId;
}

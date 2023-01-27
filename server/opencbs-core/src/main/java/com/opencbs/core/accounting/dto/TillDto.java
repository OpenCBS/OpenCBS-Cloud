package com.opencbs.core.accounting.dto;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.util.Set;

@Data
public class TillDto extends BaseDto {

    private String name;
    private Long branchId;
    private Set<Long> accounts;
}

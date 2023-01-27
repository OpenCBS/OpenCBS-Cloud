package com.opencbs.core.accounting.dto;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.util.Set;

@Data
public class VaultDto extends BaseDto {

    private String name;

    private Set<Long> accounts;

    private Integer branchId;
}
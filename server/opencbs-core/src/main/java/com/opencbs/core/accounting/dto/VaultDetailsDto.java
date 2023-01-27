package com.opencbs.core.accounting.dto;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.BranchDto;
import lombok.Data;

import java.util.LinkedHashSet;

@Data
public class VaultDetailsDto extends BaseDto {

    private String name;

    private LinkedHashSet<AccountDto> accounts;

    private BranchDto branch;

}
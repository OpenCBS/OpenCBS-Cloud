package com.opencbs.loans.dto.products;

import com.opencbs.core.dto.BaseProductDto;
import lombok.Data;

import java.util.List;

@Data
public class LoanProductBaseDto extends BaseProductDto {

    private boolean hasPayees;
    private List<String> availability;
    private List<LoanProductProvisionDto> provisioning;
}
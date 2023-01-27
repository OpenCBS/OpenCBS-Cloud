package com.opencbs.loans.dto;

import com.opencbs.core.domain.RepaymentTypes;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RepaymentTypeDto {

    private long id;
    private RepaymentTypes name;
}

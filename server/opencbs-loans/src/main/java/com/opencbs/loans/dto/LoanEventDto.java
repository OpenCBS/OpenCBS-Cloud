package com.opencbs.loans.dto;

import com.opencbs.core.dto.EventDto;
import com.opencbs.core.dto.OtherFeeDto;
import lombok.Data;

@Data
public class LoanEventDto extends EventDto {

    private OtherFeeDto otherFee;

}

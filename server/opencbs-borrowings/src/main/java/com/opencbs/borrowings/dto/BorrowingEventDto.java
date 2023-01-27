package com.opencbs.borrowings.dto;

import com.opencbs.core.dto.EventDto;
import com.opencbs.core.dto.OtherFeeDetailDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class BorrowingEventDto extends EventDto {

    private OtherFeeDetailDto otherFee;

}
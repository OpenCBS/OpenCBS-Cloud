package com.opencbs.loans.dto.impotrpaymenthistory;


import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ImportPaymentHistoryDto extends BaseDto {

    private LocalDateTime paymentDate;
    private BigDecimal repaymentAmount;
    private String formattedNumber;
    private String customerName;

}

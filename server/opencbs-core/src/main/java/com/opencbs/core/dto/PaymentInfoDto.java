package com.opencbs.core.dto;

import com.opencbs.core.domain.enums.PaymentType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentInfoDto {
    private PaymentType paymentType;
    private BigDecimal total;
    private LocalDateTime date;
}

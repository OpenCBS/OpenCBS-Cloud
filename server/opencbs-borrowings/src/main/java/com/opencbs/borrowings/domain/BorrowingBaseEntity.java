package com.opencbs.borrowings.domain;

import com.opencbs.core.contracts.Contract;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@MappedSuperclass
public abstract class BorrowingBaseEntity extends Contract {

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "interest_rate", precision = 8, scale = 4, nullable = false)
    private BigDecimal interestRate;

    @Column(name = "schedule_type", nullable = false)
    private String scheduleType;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
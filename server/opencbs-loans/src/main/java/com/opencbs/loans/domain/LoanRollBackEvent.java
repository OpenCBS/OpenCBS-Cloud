package com.opencbs.loans.domain;

import com.opencbs.core.domain.User;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class LoanRollBackEvent {

    public LoanRollBackEvent(Long groupKey, User rolledBackBy, LocalDateTime rolledBackTime, BigDecimal amount) {
        this.groupKey = groupKey;
        this.rolledBackBy = rolledBackBy;
        this.rolledBackTime = rolledBackTime;
        this.amount = amount;
    }

    private Long groupKey;

    private User rolledBackBy;

    private LocalDateTime rolledBackTime;

    private BigDecimal amount;

    List<Long> eventsIds;
}

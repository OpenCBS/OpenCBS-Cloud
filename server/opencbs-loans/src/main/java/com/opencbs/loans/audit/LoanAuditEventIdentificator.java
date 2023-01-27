package com.opencbs.loans.audit;

import com.opencbs.core.audit.AuditEventIdentificator;
import lombok.Data;

import java.time.LocalDateTime;


@Data
public class LoanAuditEventIdentificator extends AuditEventIdentificator {

    public LoanAuditEventIdentificator(Long loanEventId, LocalDateTime effectiveAt) {
        super(loanEventId, effectiveAt);
    }

    Boolean rollback = Boolean.FALSE;
}

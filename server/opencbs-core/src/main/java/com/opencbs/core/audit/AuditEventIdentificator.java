package com.opencbs.core.audit;

import com.opencbs.core.audit.interfaces.Auditable;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class  AuditEventIdentificator {

    public AuditEventIdentificator(Long loanEventId, LocalDateTime effectiveAt) {
        this.loanEventId = loanEventId;
        this.effectiveAt = effectiveAt;
    }

    Long loanEventId;

    LocalDateTime effectiveAt;

    Auditable auditor;
}
